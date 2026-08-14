(() => {
"use strict";

const APP_KEY="kaji-redesign-v1";
const TODAY_KEY="kaji-redesign-completions-v1";
const REDESIGN={none:"未検討",keep:"維持",stop:"やめる",automate:"自動化",simplify:"簡略化",share:"大人で分担",self:"本人へ返す"};
const TIMES={morning:"朝",daytime:"日中",afterschool:"帰宅後",evening:"夜",anytime:"いつでも"};
const TIC={morning:"☀️",daytime:"🌤️",afterschool:"🏠",evening:"🌙",anytime:"🕒"};
const CATS={home:"家そのもの",child:"子ども関連",management:"管理・名もなき家事",personal:"個人の生活",school:"学校",cooking:"料理",cleaning:"掃除",shopping:"買い物",stock:"在庫・補充",other:"その他"};
const DOW=["日","月","火","水","木","金","土"];
const COLORS=[["#3973b8","#edf5ff"],["#7359a7","#f1edfa"],["#c45b7d","#fff0f5"],["#c97427","#fff4e9"],["#138a72","#e6f5f0"],["#8a6d3b","#f8f0df"]];
const FONT_LABELS={system:"標準ゴシック",rounded:"丸ゴシック",textbook:"教科書風",mincho:"明朝"};
const V2_IDEAS=[
  "家族の複数端末で同期・共有",
  "通知・リマインダーと担当者への声かけ代替",
  "子ども専用のシンプルな『今日やること』画面",
  "家庭タスクのテンプレートと初回棚卸しウィザード",
  "ChatGPT等へ改善相談文をコピーするAPI不要のAI連携",
  "月1回・期限付き・不定期タスクの高度なスケジュール",
  "カレンダー・在庫・買い物との連携",
  "自立の成長記録と月次レポート"
];

const seed=()=>({
  version:1.1,
  settings:{childDailyMinutes:15,font:"system",taskSort:"created"},
  members:[
    {id:"me",name:"わたし",role:"adult",emoji:"👩",color:"#3973b8",soft:"#edf5ff"},
    {id:"dad",name:"パパ",role:"adult",emoji:"👨",color:"#7359a7",soft:"#f1edfa"},
    {id:"yui",name:"結衣",role:"child",emoji:"👧",color:"#c45b7d",soft:"#fff0f5"},
    {id:"so",name:"湊",role:"child",emoji:"👦",color:"#c97427",soft:"#fff4e9"},
    {id:"auto",name:"自動・機械",role:"auto",emoji:"🤖",color:"#138a72",soft:"#e6f5f0"}
  ],
  tasks:[
    {id:"t1",name:"洗濯機を回す",category:"home",forWhom:"family",owners:["me"],days:[0,1,2,3,4,5,6],time:"morning",minutes:8,burden:2,redesign:"keep",level:0,active:true,baselineMinutes:8},
    {id:"t2",name:"学校プリント確認",category:"management",forWhom:"children",owners:["me"],days:[1,2,3,4,5],time:"evening",minutes:6,burden:3,redesign:"none",level:0,active:true,baselineMinutes:6},
    {id:"t3",name:"夕食づくり",category:"cooking",forWhom:"family",owners:["me"],days:[0,1,2,3,4,5,6],time:"evening",minutes:35,burden:4,redesign:"simplify",level:0,active:true,baselineMinutes:50},
    {id:"t4",name:"明日の予定確認",category:"management",forWhom:"family",owners:["me"],days:[0,1,2,3,4,5,6],time:"evening",minutes:5,burden:2,redesign:"none",level:0,active:true,baselineMinutes:5},
    {id:"t5",name:"ゴミをまとめる",category:"home",forWhom:"family",owners:["me"],days:[1,4],time:"evening",minutes:5,burden:2,redesign:"share",level:0,active:true,baselineMinutes:5},
    {id:"t6",name:"ゴミ出し",category:"home",forWhom:"family",owners:["dad"],days:[2,5],time:"morning",minutes:5,burden:2,redesign:"share",level:0,active:true,baselineMinutes:5},
    {id:"t7",name:"お風呂掃除",category:"cleaning",forWhom:"family",owners:["dad"],days:[0,1,2,3,4,5,6],time:"evening",minutes:10,burden:3,redesign:"share",level:0,active:true,baselineMinutes:10},
    {id:"t8",name:"食器を片づける",category:"home",forWhom:"family",owners:["dad"],days:[0,1,2,3,4,5,6],time:"evening",minutes:12,burden:3,redesign:"share",level:0,active:true,baselineMinutes:12},
    {id:"t9",name:"水筒を出す",category:"child",forWhom:"yui",owners:["yui"],days:[1,2,3,4,5],time:"evening",minutes:1,burden:1,redesign:"self",level:4,active:true,baselineMinutes:3},
    {id:"t10",name:"明日の学校準備",category:"school",forWhom:"yui",owners:["yui"],days:[1,2,3,4,5],time:"evening",minutes:4,burden:2,redesign:"self",level:3,active:true,baselineMinutes:8},
    {id:"t11",name:"自分の洗濯物をしまう",category:"personal",forWhom:"yui",owners:["yui"],days:[0,2,4,6],time:"evening",minutes:3,burden:2,redesign:"self",level:2,active:true,baselineMinutes:5},
    {id:"t12",name:"脱いだ服を洗濯カゴへ",category:"personal",forWhom:"so",owners:["so"],days:[0,1,2,3,4,5,6],time:"evening",minutes:1,burden:1,redesign:"self",level:4,active:true,baselineMinutes:2},
    {id:"t13",name:"学校の準備",category:"school",forWhom:"so",owners:["so"],days:[1,2,3,4,5],time:"evening",minutes:3,burden:2,redesign:"self",level:2,active:true,baselineMinutes:7},
    {id:"t14",name:"朝の起床アラーム",category:"child",forWhom:"children",owners:["auto"],days:[1,2,3,4,5],time:"morning",minutes:0,burden:1,redesign:"automate",level:0,active:true,baselineMinutes:10},
    {id:"t15",name:"ロボット掃除",category:"cleaning",forWhom:"family",owners:["auto"],days:[1,3,5],time:"daytime",minutes:0,burden:1,redesign:"automate",level:0,active:true,baselineMinutes:20},
    {id:"t16",name:"麦茶を作る",category:"home",forWhom:"family",owners:[],days:[0,1,2,3,4,5,6],time:"evening",minutes:5,burden:2,redesign:"none",level:0,active:true,baselineMinutes:5},
    {id:"t17",name:"習い事の持ち物確認",category:"child",forWhom:"children",owners:[],days:[4],time:"afterschool",minutes:5,burden:3,redesign:"none",level:0,active:true,baselineMinutes:5}
  ]
});

function load(k,f){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function normalize(s){
  if(!s||!Array.isArray(s.tasks)||!Array.isArray(s.members)) s=seed();
  s.version=1.1;
  s.settings=s.settings||{};
  if(!Number.isFinite(+s.settings.childDailyMinutes)) s.settings.childDailyMinutes=15;
  if(!FONT_LABELS[s.settings.font]) s.settings.font="system";
  if(!["created","kana"].includes(s.settings.taskSort)) s.settings.taskSort="created";
  s.tasks.forEach(t=>{
    if(!Array.isArray(t.owners)) t.owners=t.owner?[t.owner]:[];
    t.owners=[...new Set(t.owners.filter(id=>s.members.some(m=>m.id===id)))];
    delete t.owner;
    if(t.active==null)t.active=true;
    if(t.redesign==null)t.redesign="none";
    if(t.level==null)t.level=0;
    if(t.baselineMinutes==null)t.baselineMinutes=+t.minutes||0;
  });
  return s;
}

let state=normalize(load(APP_KEY,null));
let completions=load(TODAY_KEY,{});
let ui={page:"home",homeMode:"person",taskFilter:"all",search:"",editTaskId:null,editMemberId:null,modal:null,redesignTaskId:null,toast:null};

function save(){localStorage.setItem(APP_KEY,JSON.stringify(state))}
function saveC(){localStorage.setItem(TODAY_KEY,JSON.stringify(completions))}
function applyFont(){document.documentElement.dataset.font=state.settings.font||"system"}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function dateKey(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function mem(id){return state.members.find(m=>m.id===id)}
function ownersOf(t){return Array.isArray(t.owners)?t.owners:[]}
function ownerMembers(t){return ownersOf(t).map(mem).filter(Boolean)}
function hasOwner(t,id){return ownersOf(t).includes(id)}
function ownerSummary(t){const ms=ownerMembers(t);if(!ms.length)return"⚠️ 未担当";if(ms.length===1)return`${ms[0].emoji} ${ms[0].name}`;return`👥 ${ms.map(m=>m.name).join("・")}`}
function today(t){return t.active&&t.days?.includes(new Date().getDay())}
function td(){return state.tasks.filter(today)}
function done(id){return !!(completions[dateKey()]?.[id])}
function setDone(id,v){const k=dateKey();completions[k]||={};completions[k][id]=v;saveC();render()}
function sum(a,f){return a.reduce((n,x)=>n+(f?f(x):x),0)}
function weekly(t,base=false){return (base?(+t.baselineMinutes||+t.minutes||0):(+t.minutes||0))*(t.days?.length||0)}
function burden(t){return weekly(t)*Math.max(1,+t.burden||1)}
function candidates(){return state.tasks.filter(t=>t.active&&!['stop','automate'].includes(t.redesign)&&(t.redesign==='none'||t.burden>=4||burden(t)>=120)).sort((a,b)=>burden(b)-burden(a))}
function childLoad(id){return sum(td().filter(t=>hasOwner(t,id)),t=>+t.minutes||0)}
function toast(s){ui.toast=s;render();setTimeout(()=>{ui.toast=null;render()},1500)}
function title(){return ({home:"ホーム",tasks:"タスク一覧",redesign:"見直し",analytics:"分析",settings:"設定"})[ui.page]}
function fmtMin(min){min=Math.round(min);if(min<60)return`${min}分`;const h=Math.floor(min/60),m=min%60;return m?`${h}h${m}m`:`${h}h`}
function kanaSort(a,b){return a.name.localeCompare(b.name,"ja",{sensitivity:"base",numeric:true})}

function render(){
  applyFont();
  document.getElementById('app').innerHTML=`<div class="app-shell">${top()}<main class="content">${page()}</main>${ui.page!=="settings"?`<button class="fab" data-action="new-task">＋</button>`:""}${nav()}${ui.modal?modal():""}${ui.toast?`<div class="toast">${esc(ui.toast)}</div>`:""}</div>`;
  bind();
}
function top(){return `<header class="topbar"><div class="brand"><div class="brand-mark">⌂</div><div class="brand-text"><div class="brand-title">家事リデザイン</div><div class="brand-sub">${title()} · 表は今日を回す／裏で家庭を軽くする</div></div></div><div class="header-actions">${ui.page==='home'?`<button class="icon-btn" data-page="settings">⚙️</button>`:""}</div></header>`}
function page(){return ui.page==='home'?home():ui.page==='tasks'?tasks():ui.page==='redesign'?redesign():ui.page==='analytics'?analytics():settings()}

function home(){
  const d=new Date(),list=td(),ua=list.filter(t=>ownersOf(t).length===0),cand=candidates(),dc=list.filter(t=>done(t.id)).length;
  return `<div class="date-row"><div><div class="date-main">${d.getMonth()+1}月${d.getDate()}日（${DOW[d.getDay()]}）</div><div class="date-sub">今日 ${dc}/${list.length}件 完了</div></div><button class="ghost-btn" data-action="complete-reset">完了をリセット</button></div>
  ${ua.length?`<div class="alert"><div class="alert-head"><span>⚠️ 今日、担当が決まっていない仕事 ${ua.length}件</span><button class="soft-btn" data-action="show-unassigned">担当を決める</button></div><ul class="alert-list">${ua.map(t=>`<li>${esc(t.name)}</li>`).join('')}</ul></div>`:""}
  <div class="segmented"><button class="${ui.homeMode==='person'?'active':''}" data-home-mode="person">人ごと</button><button class="${ui.homeMode==='time'?'active':''}" data-home-mode="time">時間ごと</button></div>
  ${ui.homeMode==='person'?byPerson(list):byTime(list)}
  <div class="improve-strip"><div><strong>💡 見直せそうな家事 ${cand.length}件</strong><span>毎日の運用を邪魔せず、裏側で改善候補をためます。</span></div><button class="soft-btn" data-page="redesign">見る</button></div>`;
}
function byPerson(list){
  const order=[...state.members,{id:"",name:"未担当",role:"none",emoji:"⚠️",color:"#b26a00",soft:"#fff4d9"}];
  return order.map(m=>{
    const a=m.id?list.filter(t=>hasOwner(t,m.id)):list.filter(t=>ownersOf(t).length===0);
    if(!a.length)return'';
    const mins=sum(a,t=>+t.minutes||0),warn=m.role==='child'&&mins>state.settings.childDailyMinutes;
    return `<section class="card person-card" style="--person-color:${m.color};--person-soft:${m.soft}"><div class="person-head"><div class="person-name"><span class="avatar">${m.emoji}</span>${esc(m.name)} ${warn?`<span class="badge warn">負担注意</span>`:""}</div><div class="person-summary">${a.length}件${mins?` / 約${mins}分`:''}</div></div>
    ${Object.keys(TIMES).map(k=>{const x=a.filter(t=>t.time===k);return x.length?`<div class="time-label">${TIC[k]} ${TIMES[k]}</div>${x.map(todayRow).join('')}`:''}).join('')}
    ${warn?`<div class="callout warn">学習・休息を優先する目安（${state.settings.childDailyMinutes}分/日）を超えています。分割や大人への戻しを検討できます。</div>`:''}</section>`;
  }).join('');
}
function byTime(list){
  return Object.keys(TIMES).map(k=>{
    const a=list.filter(t=>t.time===k);if(!a.length)return'';
    return `<section class="card"><div class="card-title-row"><div><h3 class="card-title">${TIC[k]} ${TIMES[k]}</h3><div class="card-sub">${a.length}件</div></div></div>${a.map(t=>`<div class="task-row"><button class="check ${done(t.id)?'done':''}" data-toggle-task="${t.id}">${done(t.id)?'✓':''}</button><div><div class="task-name ${done(t.id)?'done':''}">${esc(t.name)}</div><div class="task-meta">${esc(ownerSummary(t))} · 約${t.minutes}分${ownersOf(t).length>1?' · 共同':''}</div></div><button class="mini-btn" data-edit-task="${t.id}">編集</button></div>`).join('')}</section>`;
  }).join('');
}
function todayRow(t){
  const d=done(t.id),shared=ownersOf(t).length>1;
  return `<div class="task-row"><button class="check ${d?'done':''}" data-toggle-task="${t.id}">${d?'✓':''}</button><div><div class="task-name ${d?'done':''}">${esc(t.name)}${shared?' <span class="badge purple">共同</span>':''}</div><div class="task-meta">約${t.minutes}分 · ${CATS[t.category]||t.category}${t.level?` · 自立Lv.${t.level}`:''}</div></div><button class="mini-btn" data-edit-task="${t.id}">${ownersOf(t).length?'編集':'担当'}</button></div>`;
}

function tasks(){
  let a=[...state.tasks];
  if(ui.taskFilter!=='all'){
    if(ui.taskFilter==='unassigned')a=a.filter(t=>ownersOf(t).length===0);
    else if(ui.taskFilter==='child')a=a.filter(t=>ownerMembers(t).some(m=>m.role==='child')||['child','school'].includes(t.category));
    else a=a.filter(t=>t.category===ui.taskFilter);
  }
  if(ui.search.trim()){
    const q=ui.search.trim().toLowerCase();
    a=a.filter(t=>t.name.toLowerCase().includes(q)||(CATS[t.category]||'').includes(q));
  }
  if(state.settings.taskSort==='kana')a.sort(kanaSort);
  return `<h1 class="page-title">家庭タスク</h1><p class="page-lead">タスクを実際に分担できる単位へ分解。共同作業は複数人を担当にできます。</p>
  <div class="search"><span>⌕</span><input id="task-search" value="${esc(ui.search)}" placeholder="タスクを検索"></div>
  <div class="filter-row">${[['all','すべて'],['unassigned','未担当'],['child','子ども関連'],['home','家'],['management','管理'],['cleaning','掃除'],['cooking','料理']].map(([k,l])=>`<button class="chip ${ui.taskFilter===k?'active':''}" data-task-filter="${k}">${l}</button>`).join('')}</div>
  <div class="card"><div class="card-title-row"><div><h3 class="card-title">${a.length}件</h3><div class="card-sub">${state.settings.taskSort==='kana'?'五十音順':'登録順'}で表示</div></div><div class="header-actions"><button class="ghost-btn" data-action="toggle-sort">${state.settings.taskSort==='kana'?'↩ 登録順':'あ→ん 五十音順'}</button><button class="primary-btn" data-action="new-task">＋ 追加</button></div></div>${a.length?a.map(masterRow).join(''):`<div class="empty">該当するタスクはありません。</div>`}</div>`;
}
function masterRow(t){
  const os=ownerMembers(t),shared=os.length>1;
  return `<div class="task-master-row"><div><div class="task-name">${esc(t.name)}</div><div class="badges"><span class="badge">${CATS[t.category]||esc(t.category)}</span><span class="badge ${os.length?'blue':'warn'}">${esc(ownerSummary(t))}</span>${shared?`<span class="badge purple">共同</span>`:''}<span class="badge">${t.days?.length===7?'毎日':`${t.days?.map(d=>DOW[d]).join('・')}曜`}</span><span class="badge">${TIMES[t.time]||t.time}</span>${t.redesign!=='none'?`<span class="badge green">${REDESIGN[t.redesign]}</span>`:''}${t.level?`<span class="badge purple">自立Lv.${t.level}</span>`:''}</div></div><div class="task-actions"><button class="mini-btn" data-redesign-task="${t.id}">見直し</button><button class="mini-btn" data-edit-task="${t.id}">編集</button></div></div>`;
}

function redesign(){
  const c=candidates(),sel=ui.redesignTaskId?state.tasks.find(t=>t.id===ui.redesignTaskId):c[0];
  return `<h1 class="page-title">裏側のリデザイン</h1><p class="page-lead">今日の実行盤とは分離。日々の仕事を止めず、少しずつ家庭を軽くします。</p><div class="card flat"><div class="card-title-row"><div><h3 class="card-title">見直し候補</h3><div class="card-sub">負担・頻度・未検討から抽出</div></div><span class="badge green">${c.length}件</span></div><div class="filter-row">${c.slice(0,12).map(t=>`<button class="chip ${sel?.id===t.id?'active':''}" data-redesign-select="${t.id}">${esc(t.name)}</button>`).join('')}</div></div>${sel?redesignEditor(sel):`<div class="empty">今すぐ見直す候補はありません。</div>`}`;
}
function redesignEditor(t){
  const opts=[['stop','🗑 やめる'],['automate','⚡ 自動化'],['simplify','✨ 簡略化'],['share','👥 大人で分担'],['self','🌱 本人へ返す'],['keep','⏸ 今は維持']];
  return `<div class="redesign-card"><div class="card-title-row"><div><h3 class="card-title">${esc(t.name)}</h3><div class="card-sub">${esc(ownerSummary(t))} · ${t.days.length}日/週 · 1回${t.minutes}分 · 面倒度${t.burden}/5</div></div><span class="badge ${t.redesign==='none'?'warn':'green'}">${REDESIGN[t.redesign]}</span></div><div class="suggest-box"><strong>先に減らせないかを確認：</strong><br>やめる → 自動化 → 簡略化 → それでも残るなら担当を分散。本人自身の生活タスクなら「本人へ返す」を検討します。</div><div class="redesign-options">${opts.map(([k,l])=>`<button class="redesign-option ${t.redesign===k?'selected':''}" data-set-redesign="${t.id}:${k}">${l}</button>`).join('')}</div>${t.redesign==='self'?independence(t):''}<div class="section-label">負担のヒント</div>${suggestion(t)}</div>`;
}
function suggestion(t){
  if(['child','school','personal'].includes(t.category)){
    if(t.minutes<=5)return`<div class="callout green">本人自身の生活に関する短時間タスクなら、自立移管の候補です。いきなり完全自立にせず段階を1つずつ進めます。</div>`;
    if(t.minutes>15)return`<div class="callout warn">子どもへ移すには長めです。家族全体の仕事なら「自分の分だけ」に分解できないか検討してください。</div>`;
  }
  if(t.burden>=4||weekly(t)>180)return`<div class="callout warn">頻度または負担が大きいタスクです。担当変更より先に、工程削減・まとめ処理・道具変更が効く可能性があります。</div>`;
  return`<div class="callout">現在の負担は極端ではありません。無理に改善せず「維持」も正解です。</div>`;
}
function independence(t){
  const labs=['親がする','一緒にする','声かけだけ','通知だけ','完全自立'],lv=Math.min(5,Math.max(1,t.level||1));
  return `<div class="section-label">自立レベル</div><div class="level-track">${labs.map((l,i)=>`<button class="level-node ${lv===i+1?'active':''}" data-set-level="${t.id}:${i+1}">${i+1}<br>${l}</button>`).join('')}</div><div class="callout green" style="margin-top:10px">現在：レベル${lv}「${labs[lv-1]}」。学習・休息を圧迫しない範囲で、一段階ずつ進めます。</div>`;
}

function analytics(){
  const active=state.tasks.filter(t=>t.active),before=sum(active,t=>weekly(t,true)),after=sum(active,t=>weekly(t,false)),saved=Math.max(0,before-after),selfCount=active.filter(t=>t.redesign==='self'&&t.level>=3).length,people=state.members.filter(m=>m.role!=='auto');
  const load=m=>sum(active.filter(t=>hasOwner(t,m.id)),t=>weekly(t));
  const max=Math.max(1,...people.map(load));
  return `<h1 class="page-title">成果と負担</h1><p class="page-lead">家庭全体の時間はタスクを1回だけ計上。担当者別では共同タスクを各参加者の負担として表示します。</p><div class="metric-grid"><div class="metric"><div class="label">改善前の推定</div><div class="num">${fmtMin(before)}</div></div><div class="metric"><div class="label">現在の推定</div><div class="num">${fmtMin(after)}</div></div><div class="metric"><div class="label">週あたり削減</div><div class="num">${fmtMin(saved)}</div></div><div class="metric"><div class="label">自立が進んだ項目</div><div class="num">${selfCount}件</div></div></div><div class="card"><div class="card-title-row"><div><h3 class="card-title">週あたりの担当時間</h3><div class="card-sub">共同タスクは各参加者に表示</div></div></div>${people.map(m=>{const v=load(m);return`<div class="bar-row"><span>${m.emoji} ${esc(m.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(v/max*100)}%;background:${m.color}"></div></div><b>${fmtMin(v)}</b></div>`}).join('')}</div><div class="card"><h3 class="card-title">子どもの今日の負担</h3><div class="card-sub">生活スキルを育てても、勉強・休息を侵食しない</div>${state.members.filter(m=>m.role==='child').map(m=>{const v=childLoad(m.id),pct=Math.min(100,Math.round(v/state.settings.childDailyMinutes*100));return`<div style="margin-top:13px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span>${m.emoji} ${esc(m.name)}</span><span>${v} / ${state.settings.childDailyMinutes}分</span></div><div class="progress"><i style="width:${pct}%;background:${v>state.settings.childDailyMinutes?'#b26a00':m.color}"></i></div></div>`}).join('')}</div>`;
}

function settings(){
  return `<h1 class="page-title">設定</h1><p class="page-lead">家族・見た目・データはこの端末に保存します。</p>
  <div class="card"><div class="card-title-row"><div><h3 class="card-title">家族</h3><div class="card-sub">1つのタスクに複数人を担当設定できます。</div></div><button class="soft-btn" data-action="new-member">＋ 追加</button></div>${state.members.map(m=>`<div class="member-row"><div class="avatar" style="background:${m.soft};color:${m.color}">${m.emoji}</div><div><strong>${esc(m.name)}</strong><div class="card-sub">${m.role==='adult'?'大人':m.role==='child'?'子ども':'自動・機械'}</div></div><button class="mini-btn" data-edit-member="${m.id}">編集</button></div>`).join('')}</div>
  <div class="card"><h3 class="card-title">フォント</h3><p class="card-sub">端末に入っているフォントを使うため、追加ダウンロードなし・オフラインでも使えます。</p><div class="field" style="margin-top:10px"><label>表示フォント</label><select id="font-select">${Object.entries(FONT_LABELS).map(([k,l])=>`<option value="${k}" ${state.settings.font===k?'selected':''}>${l}</option>`).join('')}</select></div><div class="font-preview"><strong>家事リデザイン</strong><span>今日、誰が何をするかを一瞥。</span></div></div>
  <div class="card"><h3 class="card-title">子どもの生活タスク時間</h3><p class="card-sub">「家事要員」にしないための目安。超えたらホームに注意を表示します。</p><div class="field" style="margin-top:10px"><label>1日あたりの目安（分）</label><input type="number" id="child-limit" min="5" max="60" value="${state.settings.childDailyMinutes}"></div><button class="soft-btn" style="margin-top:10px" data-action="save-child-limit">保存</button></div>
  <div class="card"><h3 class="card-title">v2 ロードマップ</h3><p class="card-sub">以下は次段階の候補。現在のv1.1にはまだ実装せず、日常運用を見て優先順位を決めます。</p><div class="roadmap-list">${V2_IDEAS.map((x,i)=>`<div class="roadmap-item"><span class="roadmap-num">${i+1}</span><span>${esc(x)}</span><span class="badge warn">v2候補</span></div>`).join('')}</div></div>
  <div class="card"><h3 class="card-title">バックアップ</h3><p class="card-sub">設定画面からJSONを書き出し・復元できます。</p><div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"><button class="soft-btn" data-action="export">JSONを書き出す</button><button class="ghost-btn" data-action="import">JSONを読み込む</button><input id="import-file" type="file" accept="application/json" hidden></div></div>
  <div class="card"><h3 class="card-title">初期化</h3><button class="danger-btn" style="margin-top:10px" data-action="reset-app">サンプルへ戻す</button></div>`;
}

function nav(){const items=[['home','⌂','ホーム'],['tasks','☷','タスク'],['redesign','✦','見直し'],['analytics','▥','分析'],['settings','⚙','設定']];return `<nav class="bottom-nav">${items.map(([p,i,l])=>`<button class="nav-btn ${ui.page===p?'active':''}" data-page="${p}"><span class="nav-icon">${i}</span><span>${l}</span></button>`).join('')}</nav>`}
function modal(){return ui.modal==='task'?taskModal():ui.modal==='member'?memberModal():unassignedModal()}

function ownerPicker(t){
  return `<div class="owner-picker">${state.members.map(m=>`<label class="owner-pick"><input type="checkbox" name="owners" value="${m.id}" ${ownersOf(t).includes(m.id)?'checked':''}><span style="--pick-color:${m.color};--pick-soft:${m.soft}">${m.emoji} ${esc(m.name)}</span></label>`).join('')}</div><div class="card-sub">複数選択すると「共同タスク」になります。誰も選ばなければ未担当です。</div>`;
}
function taskModal(){
  const ex=ui.editTaskId?state.tasks.find(t=>t.id===ui.editTaskId):null,t=ex||{name:"",category:"home",forWhom:"family",owners:[],days:[1,2,3,4,5],time:"evening",minutes:5,burden:2};
  return `<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">${ex?'タスクを編集':'タスクを追加'}</div><button class="modal-close" data-action="close-modal">×</button></div><form id="task-form"><div class="form-grid"><div class="field full"><label>タスク名</label><input name="name" required value="${esc(t.name)}" placeholder="例：水筒を準備する"></div><div class="field"><label>分類</label><select name="category">${Object.entries(CATS).map(([k,l])=>`<option value="${k}" ${t.category===k?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label>誰のため？</label><select name="forWhom"><option value="family" ${t.forWhom==='family'?'selected':''}>家族全体</option><option value="children" ${t.forWhom==='children'?'selected':''}>子どもたち</option>${state.members.filter(m=>m.role!=='auto').map(m=>`<option value="${m.id}" ${t.forWhom===m.id?'selected':''}>${m.emoji} ${esc(m.name)}</option>`).join('')}</select></div><div class="field full"><label>担当（複数選択可）</label>${ownerPicker(t)}</div><div class="field"><label>時間帯</label><select name="time">${Object.entries(TIMES).map(([k,l])=>`<option value="${k}" ${t.time===k?'selected':''}>${l}</option>`).join('')}</select></div><div class="field"><label>1回の所要時間（分）</label><input name="minutes" type="number" min="0" max="300" value="${+t.minutes||0}"></div><div class="field"><label>面倒度 1〜5</label><input name="burden" type="number" min="1" max="5" value="${Math.max(1,+t.burden||1)}"></div><div class="field full"><label>実施する曜日</label><div class="weekdays">${DOW.map((l,i)=>`<button type="button" class="day-btn ${t.days.includes(i)?'active':''}" data-day="${i}">${l}</button>`).join('')}</div><input type="hidden" name="days" value="${t.days.join(',')}"></div></div><div class="modal-actions">${ex?`<button type="button" class="danger-btn" data-delete-task="${t.id}">削除</button>`:''}<button type="button" class="ghost-btn" data-action="close-modal">キャンセル</button><button class="primary-btn" type="submit">保存</button></div></form></div></div>`;
}
function memberModal(){const ex=ui.editMemberId?mem(ui.editMemberId):null,m=ex||{name:"",role:"adult",emoji:"🙂"};return `<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">${ex?'家族を編集':'家族を追加'}</div><button class="modal-close" data-action="close-modal">×</button></div><form id="member-form"><div class="form-grid"><div class="field full"><label>表示名</label><input name="name" required value="${esc(m.name)}"></div><div class="field"><label>絵文字</label><input name="emoji" value="${esc(m.emoji||'🙂')}" maxlength="4"></div><div class="field"><label>役割</label><select name="role"><option value="adult" ${m.role==='adult'?'selected':''}>大人</option><option value="child" ${m.role==='child'?'selected':''}>子ども</option><option value="auto" ${m.role==='auto'?'selected':''}>自動・機械</option></select></div></div><div class="modal-actions">${ex&&!['me','dad','yui','so','auto'].includes(ex.id)?`<button type="button" class="danger-btn" data-delete-member="${ex.id}">削除</button>`:''}<button type="button" class="ghost-btn" data-action="close-modal">キャンセル</button><button class="primary-btn" type="submit">保存</button></div></form></div></div>`}
function unassignedModal(){const a=td().filter(t=>ownersOf(t).length===0);return `<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">今日の未担当</div><button class="modal-close" data-action="close-modal">×</button></div>${a.map(t=>`<div class="task-master-row"><div><strong>${esc(t.name)}</strong><div class="card-sub">${TIMES[t.time]} · 約${t.minutes}分</div></div><button class="soft-btn" data-edit-task="${t.id}">担当を選ぶ</button></div>`).join('')||`<div class="empty">未担当はありません。</div>`}</div></div>`}

function bind(){
  document.querySelectorAll('[data-page]').forEach(e=>e.onclick=()=>{ui.page=e.dataset.page;ui.modal=null;render()});
  document.querySelectorAll('[data-home-mode]').forEach(e=>e.onclick=()=>{ui.homeMode=e.dataset.homeMode;render()});
  document.querySelectorAll('[data-toggle-task]').forEach(e=>e.onclick=()=>setDone(e.dataset.toggleTask,!done(e.dataset.toggleTask)));
  document.querySelectorAll('[data-edit-task]').forEach(e=>e.onclick=()=>{ui.editTaskId=e.dataset.editTask;ui.modal='task';render()});
  document.querySelectorAll('[data-redesign-task]').forEach(e=>e.onclick=()=>{ui.redesignTaskId=e.dataset.redesignTask;ui.page='redesign';render()});
  document.querySelectorAll('[data-task-filter]').forEach(e=>e.onclick=()=>{ui.taskFilter=e.dataset.taskFilter;render()});
  document.querySelectorAll('[data-redesign-select]').forEach(e=>e.onclick=()=>{ui.redesignTaskId=e.dataset.redesignSelect;render()});
  document.querySelectorAll('[data-set-redesign]').forEach(e=>e.onclick=()=>setRedesign(e.dataset.setRedesign));
  document.querySelectorAll('[data-set-level]').forEach(e=>e.onclick=()=>{const [id,v]=e.dataset.setLevel.split(':');const t=state.tasks.find(x=>x.id===id);if(t){t.level=+v;save();render()}});
  document.querySelectorAll('[data-action]').forEach(e=>e.onclick=()=>action(e.dataset.action));
  document.querySelectorAll('[data-modal-close]').forEach(e=>e.onclick=()=>{ui.modal=null;render()});
  document.querySelectorAll('[data-day]').forEach(e=>e.onclick=()=>{e.classList.toggle('active');document.querySelector('input[name="days"]').value=[...document.querySelectorAll('[data-day].active')].map(x=>x.dataset.day).join(',')});
  document.querySelectorAll('[data-delete-task]').forEach(e=>e.onclick=()=>delTask(e.dataset.deleteTask));
  document.querySelectorAll('[data-edit-member]').forEach(e=>e.onclick=()=>{ui.editMemberId=e.dataset.editMember;ui.modal='member';render()});
  document.querySelectorAll('[data-delete-member]').forEach(e=>e.onclick=()=>delMember(e.dataset.deleteMember));
  const s=document.getElementById('task-search');if(s)s.oninput=x=>{ui.search=x.target.value;render();requestAnimationFrame(()=>{const z=document.getElementById('task-search');if(z){z.focus();z.setSelectionRange(z.value.length,z.value.length)}})};
  const tf=document.getElementById('task-form');if(tf)tf.onsubmit=saveTask;
  const mf=document.getElementById('member-form');if(mf)mf.onsubmit=saveMember;
  const imp=document.getElementById('import-file');if(imp)imp.onchange=importJSON;
  const fs=document.getElementById('font-select');if(fs)fs.onchange=()=>{state.settings.font=fs.value;save();applyFont();render()};
}
function setRedesign(v){const [id,val]=v.split(':'),t=state.tasks.find(x=>x.id===id);if(!t)return;t.redesign=val;if(val==='stop'){t.active=false;t.minutes=0}if(val==='automate'){const auto=state.members.find(m=>m.role==='auto');t.owners=auto?[auto.id]:[];t.minutes=0}if(val==='self'&&!t.level)t.level=1;save();toast(`「${REDESIGN[val]}」に更新しました`)}
function action(a){
  if(a==='new-task'){ui.editTaskId=null;ui.modal='task';render()}
  else if(a==='close-modal'){ui.modal=null;render()}
  else if(a==='show-unassigned'){ui.modal='unassigned';render()}
  else if(a==='complete-reset'){delete completions[dateKey()];saveC();toast('今日の完了状態をリセットしました')}
  else if(a==='new-member'){ui.editMemberId=null;ui.modal='member';render()}
  else if(a==='save-child-limit'){state.settings.childDailyMinutes=Math.max(5,Math.min(60,+document.getElementById('child-limit').value||15));save();toast('目安時間を保存しました')}
  else if(a==='toggle-sort'){state.settings.taskSort=state.settings.taskSort==='kana'?'created':'kana';save();render()}
  else if(a==='export')exportJSON();
  else if(a==='import')document.getElementById('import-file')?.click();
  else if(a==='reset-app'&&confirm('現在の端末データを消して、サンプル状態へ戻しますか？')){state=seed();completions={};save();saveC();render();toast('初期状態へ戻しました')}
}
function saveTask(e){
  e.preventDefault();
  const f=new FormData(e.currentTarget),days=(f.get('days')||'').split(',').filter(Boolean).map(Number),owners=[...new Set(f.getAll('owners').map(String))];
  if(!days.length){alert('実施する曜日を1つ以上選んでください。');return}
  const data={name:String(f.get('name')||'').trim(),category:String(f.get('category')||'home'),owners,forWhom:String(f.get('forWhom')||'family'),time:String(f.get('time')||'evening'),minutes:Math.max(0,+f.get('minutes')||0),burden:Math.max(1,Math.min(5,+f.get('burden')||1)),days};
  if(ui.editTaskId){const t=state.tasks.find(x=>x.id===ui.editTaskId);if(t){const old=t.minutes;Object.assign(t,data);if(t.baselineMinutes==null)t.baselineMinutes=old}}
  else state.tasks.push({id:'t'+Date.now(),...data,redesign:'none',level:0,active:true,baselineMinutes:data.minutes});
  save();ui.modal=null;toast(owners.length>1?'共同タスクとして保存しました':'タスクを保存しました');
}
function delTask(id){const t=state.tasks.find(x=>x.id===id);if(t&&confirm(`「${t.name}」を削除しますか？`)){state.tasks=state.tasks.filter(x=>x.id!==id);save();ui.modal=null;toast('削除しました')}}
function saveMember(e){e.preventDefault();const f=new FormData(e.currentTarget),name=String(f.get('name')||'').trim(),emoji=String(f.get('emoji')||'🙂').trim()||'🙂',role=String(f.get('role')||'adult');if(ui.editMemberId){const m=mem(ui.editMemberId);if(m){m.name=name;m.emoji=emoji;m.role=role}}else{const [color,soft]=COLORS[state.members.length%COLORS.length];state.members.push({id:'m'+Date.now(),name,emoji,role,color,soft})}save();ui.modal=null;toast('家族設定を保存しました')}
function delMember(id){const m=mem(id);if(m&&confirm(`「${m.name}」を削除しますか？ 担当タスクからこの人だけ外します。`)){state.tasks.forEach(t=>{t.owners=ownersOf(t).filter(x=>x!==id);if(t.forWhom===id)t.forWhom='family'});state.members=state.members.filter(x=>x.id!==id);save();ui.modal=null;toast('家族を削除しました')}}
function exportJSON(){const b=new Blob([JSON.stringify({app:'家事リデザイン',version:'1.1',exportedAt:new Date().toISOString(),state,completions},null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download=`kaji-redesign-backup-${dateKey()}.json`;a.click();URL.revokeObjectURL(u);toast('バックアップを書き出しました')}
function importJSON(e){const file=e.target.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const p=JSON.parse(r.result),s=normalize(p.state||p);state=s;completions=p.completions||{};save();saveC();render();toast('バックアップを読み込みました')}catch{alert('読み込める家事リデザインのJSONではありません。')}};r.readAsText(file)}

save();applyFont();
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
})();