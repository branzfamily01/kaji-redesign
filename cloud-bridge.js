(() => {
"use strict";

const APP_KEY="kaji-redesign-v1";
const COMP_KEY="kaji-redesign-completions-v1";
const SESSION_KEY="kaji-redesign-cloud-session-v1";
const DEVICE_KEY="kaji-redesign-device-id-v1";
const SDK="12.16.0";
const cfg=globalThis.KAJI_FIREBASE_CONFIG||{enabled:false};
const cloud={ready:false,configured:false,user:null,householdId:null,deviceMemberId:null,status:"Firebase未設定",error:null};
let api=null,app=null,auth=null,db=null,messaging=null,unsubs=[],remoteApplying=false,syncTimer=null,initializing=false;
let remote={members:null,tasks:null,meta:null,completions:null};

function loadJSON(k,f){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function session(){return loadJSON(SESSION_KEY,{})||{}}
function saveSession(patch){const s={...session(),...patch};Object.keys(s).forEach(k=>s[k]===undefined&&delete s[k]);localStorage.setItem(SESSION_KEY,JSON.stringify(s));cloud.householdId=s.householdId||null;cloud.deviceMemberId=s.memberId||null;injectCardSoon();return s}
function deviceId(){let id=localStorage.getItem(DEVICE_KEY);if(!id){id=(crypto.randomUUID?crypto.randomUUID():`d-${Date.now()}-${Math.random().toString(36).slice(2)}`);localStorage.setItem(DEVICE_KEY,id)}return id}
function e(s=""){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function localState(){return loadJSON(APP_KEY,null)}
function localCompletions(){return loadJSON(COMP_KEY,{})||{}}
function memberList(){return localState()?.members||[]}
function sessionLabel(){if(!cloud.configured)return"未設定";if(!cloud.user)return"ログイン待ち";if(!cloud.householdId)return"家庭未参加";return cloud.ready?"同期中":"接続中"}
function setStatus(s,err=null){cloud.status=s;cloud.error=err?String(err.message||err):null;injectCardSoon()}

const nativeSetItem=Storage.prototype.setItem;
Storage.prototype.setItem=function(key,value){nativeSetItem.call(this,key,value);if(this===localStorage&&!remoteApplying&&(key===APP_KEY||key===COMP_KEY))schedulePush()};

function schedulePush(){if(!cloud.ready||!cloud.householdId)return;clearTimeout(syncTimer);syncTimer=setTimeout(()=>pushLocalState().catch(err=>setStatus("同期エラー",err)),500)}

async function importFirebase(){
  const [appMod,authMod,firestoreMod,messagingMod]=await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-firestore.js`),
    import(`https://www.gstatic.com/firebasejs/${SDK}/firebase-messaging.js`)
  ]);
  return {...appMod,...authMod,...firestoreMod,...messagingMod};
}

async function init(){
  if(initializing||cloud.ready)return;initializing=true;
  try{
    const f=cfg.firebase||{};
    cloud.configured=!!(cfg.enabled&&f.apiKey&&f.projectId&&f.appId);
    if(!cloud.configured){setStatus("Firebaseプロジェクト設定待ち");return}
    api=await importFirebase();
    app=api.initializeApp(f);
    auth=api.getAuth(app);db=api.getFirestore(app);
    await api.setPersistence(auth,api.browserLocalPersistence);
    const s=session();cloud.householdId=s.householdId||null;cloud.deviceMemberId=s.memberId||null;
    api.onAuthStateChanged(auth,async user=>{
      cloud.user=user||null;
      stopListeners();
      if(user&&cloud.householdId){await startListeners(cloud.householdId)}
      else{cloud.ready=false;setStatus(user?"家庭を作成または参加してください":"ログインしてください")}
      injectCardSoon();
    });
  }catch(err){setStatus("Firebase初期化エラー",err)}finally{initializing=false}
}

function stopListeners(){unsubs.forEach(fn=>{try{fn()}catch{}});unsubs=[];remote={members:null,tasks:null,meta:null,completions:null};cloud.ready=false}

async function registerEmail(email,password){
  if(!auth)throw new Error("Firebase未設定です");
  const cred=await api.createUserWithEmailAndPassword(auth,email,password);
  await api.setDoc(api.doc(db,"users",cred.user.uid),{email:cred.user.email||email,createdAt:api.serverTimestamp()},{merge:true});
  return cred.user;
}
async function loginEmail(email,password){if(!auth)throw new Error("Firebase未設定です");return (await api.signInWithEmailAndPassword(auth,email,password)).user}
async function loginAnonymous(){if(!auth)throw new Error("Firebase未設定です");return (await api.signInAnonymously(auth)).user}
async function logout(){stopListeners();saveSession({householdId:null,memberId:null});if(auth)await api.signOut(auth)}

async function createHousehold(name){
  if(!cloud.user)throw new Error("先にログインしてください");
  const hid=api.doc(api.collection(db,"households")).id;
  await api.setDoc(api.doc(db,"households",hid),{name:name||"わが家",ownerUid:cloud.user.uid,createdAt:api.serverTimestamp(),updatedAt:api.serverTimestamp(),schemaVersion:1});
  await api.setDoc(api.doc(db,"households",hid,"access",cloud.user.uid),{uid:cloud.user.uid,role:"admin",joinedAt:api.serverTimestamp()});
  await api.setDoc(api.doc(db,"users",cloud.user.uid,"households",hid),{householdId:hid,role:"admin",joinedAt:api.serverTimestamp()});
  saveSession({householdId:hid});cloud.householdId=hid;
  await pushLocalState(true);await startListeners(hid);setStatus("リアルタイム同期中");return hid;
}

function inviteCode(){const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let out="";for(let i=0;i<10;i++)out+=chars[Math.floor(Math.random()*chars.length)];return out}
async function createInvite(){
  if(!cloud.user||!cloud.householdId)throw new Error("家庭に接続してください");
  const code=inviteCode(),expires=new Date(Date.now()+7*24*60*60*1000);
  await api.setDoc(api.doc(db,"invites",code),{householdId:cloud.householdId,createdBy:cloud.user.uid,createdAt:api.serverTimestamp(),expiresAt:api.Timestamp.fromDate(expires),active:true});
  return code;
}
async function joinHousehold(code){
  if(!cloud.user)throw new Error("先にログインしてください");
  code=String(code||"").trim().toUpperCase();
  const invRef=api.doc(db,"invites",code),snap=await api.getDoc(invRef);
  if(!snap.exists())throw new Error("招待コードが見つかりません");
  const inv=snap.data();if(!inv.active)throw new Error("この招待コードは無効です");
  if(inv.expiresAt?.toDate&&inv.expiresAt.toDate()<new Date())throw new Error("招待コードの期限が切れています");
  const hid=inv.householdId;
  const batch=api.writeBatch(db);
  batch.set(api.doc(db,"households",hid,"access",cloud.user.uid),{uid:cloud.user.uid,role:"member",inviteCode:code,joinedAt:api.serverTimestamp()});
  batch.set(api.doc(db,"users",cloud.user.uid,"households",hid),{householdId:hid,role:"member",joinedAt:api.serverTimestamp()});
  await batch.commit();
  saveSession({householdId:hid});cloud.householdId=hid;await startListeners(hid);setStatus("リアルタイム同期中");return hid;
}

async function pushLocalState(force=false){
  if(!db||!cloud.user||!cloud.householdId)return;
  const state=localState();if(!state)return;
  const hid=cloud.householdId,batch=api.writeBatch(db),now=api.serverTimestamp();
  batch.set(api.doc(db,"households",hid,"meta","current"),{settings:state.settings||{},history:state.history||[],version:state.version||2,updatedAt:now,updatedBy:cloud.user.uid},{merge:true});
  for(const m of state.members||[])batch.set(api.doc(db,"households",hid,"members",m.id),{...m,updatedAt:now},{merge:true});
  for(const t of state.tasks||[])batch.set(api.doc(db,"households",hid,"tasks",t.id),{...t,householdId:hid,updatedAt:now,updatedBy:cloud.user.uid},{merge:true});
  const comps=localCompletions();for(const [date,value] of Object.entries(comps))batch.set(api.doc(db,"households",hid,"completions",date),{value,updatedAt:now,updatedBy:cloud.user.uid},{merge:true});
  await batch.commit();
  await api.setDoc(api.doc(db,"households",hid,"meta","ids"),{memberIds:(state.members||[]).map(x=>x.id),taskIds:(state.tasks||[]).map(x=>x.id),updatedAt:now},{merge:true});
  if(force)setStatus("初期データをクラウドへ保存しました");
}

async function startListeners(hid){
  if(!db||!cloud.user)return;stopListeners();cloud.householdId=hid;setStatus("クラウドを読み込み中");
  let ids={memberIds:null,taskIds:null};
  const apply=()=>{
    if(remote.members===null||remote.tasks===null||remote.meta===null||remote.completions===null)return;
    const current=localState()||{};
    const memberIds=ids.memberIds||Object.keys(remote.members),taskIds=ids.taskIds||Object.keys(remote.tasks);
    const next={...current,version:Math.max(2.1,Number(remote.meta.version||current.version||2)),settings:remote.meta.settings||current.settings||{},history:remote.meta.history||current.history||[],members:memberIds.map(id=>remote.members[id]).filter(Boolean),tasks:taskIds.map(id=>remote.tasks[id]).filter(Boolean)};
    const comps=remote.completions||{};
    const a=JSON.stringify(current),b=JSON.stringify(next),c=JSON.stringify(localCompletions()),d=JSON.stringify(comps);
    if(a!==b||c!==d){remoteApplying=true;nativeSetItem.call(localStorage,APP_KEY,b);nativeSetItem.call(localStorage,COMP_KEY,d);remoteApplying=false;debouncedReload()}
    cloud.ready=true;setStatus("リアルタイム同期中");
  };
  unsubs.push(api.onSnapshot(api.collection(db,"households",hid,"members"),snap=>{remote.members={};snap.forEach(x=>remote.members[x.id]=stripMeta(x.data()));apply()},err=>setStatus("メンバー同期エラー",err)));
  unsubs.push(api.onSnapshot(api.collection(db,"households",hid,"tasks"),snap=>{remote.tasks={};snap.forEach(x=>remote.tasks[x.id]=stripMeta(x.data()));apply()},err=>setStatus("タスク同期エラー",err)));
  unsubs.push(api.onSnapshot(api.doc(db,"households",hid,"meta","current"),snap=>{remote.meta=snap.exists()?stripMeta(snap.data()):{};apply()},err=>setStatus("設定同期エラー",err)));
  unsubs.push(api.onSnapshot(api.doc(db,"households",hid,"meta","ids"),snap=>{if(snap.exists()){const d=snap.data();ids={memberIds:d.memberIds||null,taskIds:d.taskIds||null};apply()}},err=>setStatus("ID同期エラー",err)));
  unsubs.push(api.onSnapshot(api.collection(db,"households",hid,"completions"),snap=>{remote.completions={};snap.forEach(x=>remote.completions[x.id]=x.data().value||{});apply()},err=>setStatus("完了同期エラー",err)));
}
function stripMeta(obj){const o={...obj};delete o.updatedAt;delete o.updatedBy;delete o.householdId;return o}
let reloadTimer=null;function debouncedReload(){clearTimeout(reloadTimer);reloadTimer=setTimeout(()=>{if(!document.hidden)location.reload();else window.addEventListener("focus",()=>location.reload(),{once:true})},700)}

async function enablePush(memberId){
  if(!cloud.user||!cloud.householdId)throw new Error("先に家庭同期へ接続してください");
  if(!cfg.vapidKey)throw new Error("FirebaseのVAPID公開鍵が未設定です");
  if(!("Notification" in window))throw new Error("このブラウザは通知に対応していません");
  const permission=await Notification.requestPermission();if(permission!=="granted")throw new Error("通知が許可されませんでした");
  if(api.isSupported && !(await api.isSupported()))throw new Error("このブラウザ環境ではFirebase Web Pushを利用できません");
  messaging=messaging||api.getMessaging(app);
  const reg=await navigator.serviceWorker.ready;
  const token=await api.getToken(messaging,{vapidKey:cfg.vapidKey,serviceWorkerRegistration:reg});
  if(!token)throw new Error("Pushトークンを取得できませんでした");
  const did=deviceId(),m=memberId||cloud.deviceMemberId||"";
  await api.setDoc(api.doc(db,"households",cloud.householdId,"devices",`${cloud.user.uid}_${did}`),{uid:cloud.user.uid,deviceId:did,memberId:m,token,platform:navigator.userAgent,enabled:true,updatedAt:api.serverTimestamp()},{merge:true});
  saveSession({memberId:m});cloud.deviceMemberId=m;setStatus("同期＋Push有効");return token;
}
async function disablePush(){
  if(!cloud.user||!cloud.householdId)return;const did=deviceId();
  await api.setDoc(api.doc(db,"households",cloud.householdId,"devices",`${cloud.user.uid}_${did}`),{enabled:false,updatedAt:api.serverTimestamp()},{merge:true});
  setStatus("同期中（Push停止）");
}

function injectCardSoon(){setTimeout(injectCard,0)}
function injectCard(){
  document.querySelectorAll(".brand-title .badge.green").forEach(b=>{if(b.textContent.trim()==="v2")b.textContent="v2.1"});
  document.querySelectorAll(".v2-row").forEach(row=>{
    const txt=row.textContent;
    if(txt.includes("家族の複数端末リアルタイム同期")||txt.includes("アプリを閉じた後の自動通知")){
      const badge=row.querySelector(".badge");if(badge){badge.textContent="基盤実装";badge.classList.remove("warn");badge.classList.add("blue")}
    }
  });
  const title=[...document.querySelectorAll(".page-title")].find(x=>x.textContent.trim()==="設定");if(!title)return;
  const content=title.closest(".content")||document.querySelector(".content");if(!content||content.querySelector("#cloud-sync-card"))return;
  const members=memberList();const s=session();
  const card=document.createElement("div");card.className="card cloud-card";card.id="cloud-sync-card";
  card.innerHTML=`<div class="card-title-row"><div><h3 class="card-title">☁️ 家族同期・Push <span class="badge green">v2.1</span></h3><div class="card-sub">販売版と同じ考え方で Firebase を同期基盤にします。</div></div><span class="badge ${cloud.ready?"green":"warn"}">${e(sessionLabel())}</span></div>
  <div class="cloud-status"><strong>${e(cloud.status)}</strong>${cloud.error?`<small>${e(cloud.error)}</small>`:""}</div>
  ${!cloud.configured?`<div class="callout warn">コード側のFirebase基盤は実装済みです。次はFirebaseコンソールでプロジェクトを作り、<code>firebase-config.js</code>へWeb App設定とVAPID公開鍵を入れると有効になります。</div>`:
  !cloud.user?`<div class="cloud-auth"><input id="cloud-email" type="email" placeholder="メールアドレス"><input id="cloud-password" type="password" placeholder="パスワード（6文字以上）"><div class="cloud-buttons"><button class="primary-btn" data-cloud="login">ログイン</button><button class="ghost-btn" data-cloud="register">新規登録</button><button class="ghost-btn" data-cloud="anonymous">端末テスト</button></div></div>`:
  `<div class="cloud-user">ログイン：<strong>${e(cloud.user.email||"匿名ユーザー")}</strong></div>
   ${!cloud.householdId?`<div class="cloud-buttons"><button class="primary-btn" data-cloud="create-household">わが家を作る</button><button class="ghost-btn" data-cloud="join-household">招待コードで参加</button></div>`:
   `<div class="cloud-house"><div><span>家庭ID</span><code>${e(cloud.householdId)}</code></div><div class="cloud-buttons"><button class="soft-btn" data-cloud="invite">招待コード発行</button><button class="ghost-btn" data-cloud="sync-now">今すぐ同期</button></div></div>
    <div class="field" style="margin-top:10px"><label>この端末を誰として通知する？</label><select id="cloud-member"><option value="">未指定</option>${members.filter(m=>m.role!=="auto").map(m=>`<option value="${e(m.id)}" ${s.memberId===m.id?"selected":""}>${e(m.emoji)} ${e(m.name)}</option>`).join("")}</select></div>
    <div class="cloud-buttons"><button class="primary-btn" data-cloud="push">Pushを有効化</button><button class="ghost-btn" data-cloud="push-off">Push停止</button></div>`}
   <div class="cloud-buttons"><button class="danger-btn" data-cloud="logout">ログアウト</button></div>`}
  <p class="cloud-note">Web/PWAではFirestoreでリアルタイム同期し、FCM→Web Pushで通知します。将来iOS/Android版は同じFirestore/FCMを共有できます。</p>`;
  const firstCard=content.querySelector(".card");if(firstCard)content.insertBefore(card,firstCard);else content.appendChild(card);
  card.querySelectorAll("[data-cloud]").forEach(btn=>btn.addEventListener("click",()=>cloudAction(btn.dataset.cloud)));
  const memberSel=card.querySelector("#cloud-member");if(memberSel)memberSel.onchange=()=>saveSession({memberId:memberSel.value});
}

async function cloudAction(action){
  try{
    setStatus("処理中…");
    const card=document.querySelector("#cloud-sync-card"),email=card?.querySelector("#cloud-email")?.value.trim(),password=card?.querySelector("#cloud-password")?.value||"";
    if(action==="register"){if(!email||password.length<6)throw new Error("メールと6文字以上のパスワードを入力してください");await registerEmail(email,password)}
    if(action==="login"){if(!email||!password)throw new Error("メールとパスワードを入力してください");await loginEmail(email,password)}
    if(action==="anonymous")await loginAnonymous();
    if(action==="logout")await logout();
    if(action==="create-household"){const name=prompt("家庭名",`${memberList()[0]?.name||"わが"}家`)||"わが家";await createHousehold(name)}
    if(action==="join-household"){const code=prompt("招待コードを入力")||"";if(code)await joinHousehold(code)}
    if(action==="invite"){const code=await createInvite();await navigator.clipboard?.writeText(code).catch(()=>{});alert(`招待コード：${code}\n\n7日間有効です。コピーしました。`);setStatus("招待コードを発行しました")}
    if(action==="sync-now"){await pushLocalState(true);setStatus("同期しました")}
    if(action==="push"){const m=document.querySelector("#cloud-member")?.value||"";await enablePush(m);alert("Push通知を有効にしました。")}
    if(action==="push-off")await disablePush();
  }catch(err){setStatus("処理できませんでした",err);alert(err.message||String(err))}
}

new MutationObserver(()=>injectCardSoon()).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("DOMContentLoaded",()=>{injectCardSoon();init()});
globalThis.KajiCloud={state:cloud,init,pushLocalState,createHousehold,joinHousehold,createInvite,enablePush,disablePush};
})();
