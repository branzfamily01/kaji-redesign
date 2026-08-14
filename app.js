(() => {
"use strict";

const APP_KEY="kaji-redesign-v1";
const COMP_KEY="kaji-redesign-completions-v1";
const REDESIGN={none:"未検討",keep:"維持",stop:"やめる",automate:"自動化",simplify:"簡略化",share:"分担",self:"本人へ返す"};
const TIMES={morning:"朝",daytime:"日中",afterschool:"帰宅後",evening:"夜",anytime:"いつでも"};
const TIC={morning:"☀️",daytime:"🌤️",afterschool:"🏠",evening:"🌙",anytime:"🕒"};
const CATS={home:"家そのもの",child:"子ども関連",management:"管理・名もなき家事",personal:"個人の生活",school:"学校",cooking:"料理",cleaning:"掃除",shopping:"買い物",stock:"在庫・補充",other:"その他"};
const DOW=["日","月","火","水","木","金","土"];
const FONT_LABELS={system:"標準ゴシック",rounded:"丸ゴシック",textbook:"教科書風",mincho:"明朝"};
const COLORS=[["#3973b8","#edf5ff"],["#7359a7","#f1edfa"],["#c45b7d","#fff0f5"],["#c97427","#fff4e9"],["#138a72","#e6f5f0"],["#8a6d3b","#f8f0df"]];
const READINGS={"洗濯機を回す":"せんたくきをまわす","学校プリント確認":"がっこうぷりんとかくにん","夕食づくり":"ゆうしょくづくり","明日の予定確認":"あしたのよていかくにん","ゴミをまとめる":"ごみをまとめる","ゴミ出し":"ごみだし","お風呂掃除":"おふろそうじ","食器を片づける":"しょっきをかたづける","水筒を出す":"すいとうをだす","明日の学校準備":"あしたのがっこうじゅんび","自分の洗濯物をしまう":"じぶんのせんたくものをしまう","脱いだ服を洗濯カゴへ":"ぬいだふくをせんたくかごへ","学校の準備":"がっこうのじゅんび","朝の起床アラーム":"あさのきしょうあらーむ","ロボット掃除":"ろぼっとそうじ","麦茶を作る":"むぎちゃをつくる","習い事の持ち物確認":"ならいごとのもちものかくにん"};

const TEMPLATES=[
 {id:"laundry",title:"🧺 洗濯を分解",desc:"『洗濯』を実際に分担できる単位へ",tasks:[
  ["洗濯物を集める","せんたくものをあつめる","home","morning",3],
  ["洗濯機を回す","せんたくきをまわす","home","morning",5],
  ["洗濯物を干す","せんたくものをほす","home","morning",12],
  ["洗濯物を取り込む","せんたくものをとりこむ","home","evening",7],
  ["自分の洗濯物をしまう","じぶんのせんたくものをしまう","personal","evening",4]
 ]},
 {id:"morning",title:"☀️ 朝支度",desc:"声かけ・準備も名もなき家事として出す",tasks:[
  ["家族を起こす","かぞくをおこす","child","morning",10],
  ["朝食を用意する","ちょうしょくをよういする","cooking","morning",15],
  ["水筒を準備する","すいとうをじゅんびする","child","morning",3],
  ["出発時刻を声かけする","しゅっぱつじこくをこえかけする","child","morning",2]
 ]},
 {id:"school",title:"🎒 学校・子ども",desc:"親が代行していることを見える化",tasks:[
  ["学校プリント確認","がっこうぷりんとかくにん","management","evening",5],
  ["明日の学校準備","あしたのがっこうじゅんび","school","evening",5],
  ["提出物を確認する","ていしゅつぶつをかくにんする","school","evening",4],
  ["習い事の持ち物確認","ならいごとのもちものかくにん","child","afterschool",5]
 ]},
 {id:"meal",title:"🍳 食事",desc:"献立から片づけまで分解",tasks:[
  ["献立を考える","こんだてをかんがえる","management","anytime",10],
  ["食材を買う","しょくざいをかう","shopping","anytime",30],
  ["夕食づくり","ゆうしょくづくり","cooking","evening",35],
  ["食器を片づける","しょっきをかたづける","home","evening",12]
 ]},
 {id:"trash",title:"🗑 ゴミ",desc:"まとめる・交換・出すを別タスクに",tasks:[
  ["家中のゴミを集める","いえじゅうのごみをあつめる","home","evening",5],
  ["ゴミ袋を交換する","ごみぶくろをこうかんする","home","evening",3],
  ["ゴミをまとめる","ごみをまとめる","home","evening",5],
  ["ゴミ出し","ごみだし","home","morning",5]
 ]},
 {id:"clean",title:"🧹 掃除",desc:"場所ごと・工程ごとに担当可能",tasks:[
  ["お風呂掃除","おふろそうじ","cleaning","evening",10],
  ["洗面台を掃除する","せんめんだいをそうじする","cleaning","morning",5],
  ["床を掃除する","ゆかをそうじする","cleaning","daytime",15],
  ["トイレ掃除","といれそうじ","cleaning","anytime",8]
 ]},
 {id:"stock",title:"📦 補充・在庫",desc:"気づく・買う・補充するを可視化",tasks:[
  ["トイレットペーパーを補充する","といれっとぺーぱーをほじゅうする","stock","anytime",2],
  ["洗剤の残量を確認する","せんざいのざんりょうをかくにんする","stock","anytime",2],
  ["シャンプーを補充する","しゃんぷーをほじゅうする","stock","anytime",2],
  ["麦茶を作る","むぎちゃをつくる","home","evening",5]
 ]}
];

const seed=()=>({
 version:2,
 settings:{childDailyMinutes:15,font:"system",taskSort:"created"},
 members:[
  {id:"me",name:"わたし",role:"adult",emoji:"👩",color:"#3973b8",soft:"#edf5ff"},
  {id:"dad",name:"パパ",role:"adult",emoji:"👨",color:"#7359a7",soft:"#f1edfa"},
  {id:"yui",name:"結衣",role:"child",emoji:"👧",color:"#c45b7d",soft:"#fff0f5"},
  {id:"so",name:"湊",role:"child",emoji:"👦",color:"#c97427",soft:"#fff4e9"},
  {id:"auto",name:"自動・機械",role:"auto",emoji:"🤖",color:"#138a72",soft:"#e6f5f0"}
 ],
 history:[],
 tasks:[
  {id:"t1",name:"洗濯機を回す",reading:"せんたくきをまわす",category:"home",forWhom:"family",owners:["me"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"morning",minutes:8,burden:2,redesign:"keep",level:0,active:true,baselineMinutes:8},
  {id:"t2",name:"学校プリント確認",reading:"がっこうぷりんとかくにん",category:"management",forWhom:"children",owners:["me"],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"evening",minutes:6,burden:3,redesign:"none",level:0,active:true,baselineMinutes:6},
  {id:"t3",name:"夕食づくり",reading:"ゆうしょくづくり",category:"cooking",forWhom:"family",owners:["me"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:35,burden:4,redesign:"simplify",level:0,active:true,baselineMinutes:50},
  {id:"t4",name:"明日の予定確認",reading:"あしたのよていかくにん",category:"management",forWhom:"family",owners:["me"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:5,burden:2,redesign:"none",level:0,active:true,baselineMinutes:5},
  {id:"t5",name:"ゴミをまとめる",reading:"ごみをまとめる",category:"home",forWhom:"family",owners:["me","dad"],schedule:{type:"weekly",days:[1,4]},time:"evening",minutes:5,burden:2,redesign:"share",level:0,active:true,baselineMinutes:5},
  {id:"t6",name:"ゴミ出し",reading:"ごみだし",category:"home",forWhom:"family",owners:["dad"],schedule:{type:"weekly",days:[2,5]},time:"morning",minutes:5,burden:2,redesign:"share",level:0,active:true,baselineMinutes:5},
  {id:"t7",name:"お風呂掃除",reading:"おふろそうじ",category:"cleaning",forWhom:"family",owners:["dad"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:10,burden:3,redesign:"share",level:0,active:true,baselineMinutes:10},
  {id:"t8",name:"食器を片づける",reading:"しょっきをかたづける",category:"home",forWhom:"family",owners:["dad"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:12,burden:3,redesign:"share",level:0,active:true,baselineMinutes:12},
  {id:"t9",name:"水筒を出す",reading:"すいとうをだす",category:"child",forWhom:"yui",owners:["yui"],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"evening",minutes:1,burden:1,redesign:"self",level:4,active:true,baselineMinutes:3},
  {id:"t10",name:"明日の学校準備",reading:"あしたのがっこうじゅんび",category:"school",forWhom:"yui",owners:["yui"],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"evening",minutes:4,burden:2,redesign:"self",level:3,active:true,baselineMinutes:8},
  {id:"t11",name:"自分の洗濯物をしまう",reading:"じぶんのせんたくものをしまう",category:"personal",forWhom:"yui",owners:["yui"],schedule:{type:"weekly",days:[0,2,4,6]},time:"evening",minutes:3,burden:2,redesign:"self",level:2,active:true,baselineMinutes:5},
  {id:"t12",name:"脱いだ服を洗濯カゴへ",reading:"ぬいだふくをせんたくかごへ",category:"personal",forWhom:"so",owners:["so"],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:1,burden:1,redesign:"self",level:4,active:true,baselineMinutes:2},
  {id:"t13",name:"学校の準備",reading:"がっこうのじゅんび",category:"school",forWhom:"so",owners:["so"],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"evening",minutes:3,burden:2,redesign:"self",level:2,active:true,baselineMinutes:7},
  {id:"t14",name:"朝の起床アラーム",reading:"あさのきしょうあらーむ",category:"child",forWhom:"children",owners:["auto"],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"morning",minutes:0,burden:1,redesign:"automate",level:0,active:true,baselineMinutes:10},
  {id:"t15",name:"ロボット掃除",reading:"ろぼっとそうじ",category:"cleaning",forWhom:"family",owners:["auto"],schedule:{type:"weekly",days:[1,3,5]},time:"daytime",minutes:0,burden:1,redesign:"automate",level:0,active:true,baselineMinutes:20},
  {id:"t16",name:"麦茶を作る",reading:"むぎちゃをつくる",category:"home",forWhom:"family",owners:[],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:"evening",minutes:5,burden:2,redesign:"none",level:0,active:true,baselineMinutes:5}
 ]
});

function load(k,f){try{const r=localStorage.getItem(k);return r?JSON.parse(r):f}catch{return f}}
function save(){localStorage.setItem(APP_KEY,JSON.stringify(state))}
function saveComp(){localStorage.setItem(COMP_KEY,JSON.stringify(completions))}
function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]))}
function dk(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`}
function parseDate(s){const [y,m,d]=String(s||"").split("-").map(Number);return y&&m&&d?new Date(y,m-1,d):null}
function mem(id){return state.members.find(m=>m.id===id)}
function owners(t){return Array.isArray(t.owners)?t.owners:[]}
function ownerMembers(t){return owners(t).map(mem).filter(Boolean)}
function ownerSummary(t){const ms=ownerMembers(t);if(!ms.length)return"⚠️ 未担当";return ms.length===1?`${ms[0].emoji} ${ms[0].name}`:`👥 ${ms.map(m=>m.name).join("・")}`}
function normalize(s){
 if(!s||!Array.isArray(s.tasks)||!Array.isArray(s.members))s=seed();
 s.version=2;s.settings=s.settings||{};s.history=Array.isArray(s.history)?s.history:[];
 if(!Number.isFinite(+s.settings.childDailyMinutes))s.settings.childDailyMinutes=15;
 if(!FONT_LABELS[s.settings.font])s.settings.font="system";
 if(!["created","kana"].includes(s.settings.taskSort))s.settings.taskSort="created";
 s.tasks.forEach(t=>{
   if(!Array.isArray(t.owners))t.owners=t.owner?[t.owner]:[];
   delete t.owner;t.owners=[...new Set(t.owners.filter(id=>s.members.some(m=>m.id===id)))];
   if(!t.schedule){
     t.schedule={type:"weekly",days:Array.isArray(t.days)?t.days:[1,2,3,4,5]};
   }
   if(t.schedule.type==="weekly"&&!Array.isArray(t.schedule.days))t.schedule.days=[1,2,3,4,5];
   delete t.days;
   if(t.reading==null)t.reading=READINGS[t.name]||"";
   if(t.baselineMinutes==null)t.baselineMinutes=+t.minutes||0;
   if(t.active==null)t.active=true;if(t.redesign==null)t.redesign="none";if(t.level==null)t.level=0;
 });
 return s;
}

let state=normalize(load(APP_KEY,null));
let completions=load(COMP_KEY,{});
let ui={page:"home",homeMode:"person",taskFilter:"all",search:"",modal:null,editTaskId:null,editMemberId:null,redesignTaskId:null,childId:null,templateId:null,toast:null};
save();

function applyFont(){document.documentElement.dataset.font=state.settings.font||"system"}
function occurs(t,date=new Date()){
 if(!t.active)return false;
 const s=t.schedule||{type:"weekly",days:[]};
 if(s.type==="weekly")return (s.days||[]).includes(date.getDay());
 if(s.type==="monthly")return date.getDate()===Number(s.day);
 if(s.type==="once")return dk(date)===s.date;
 return false;
}
function todayTasks(){return state.tasks.filter(t=>occurs(t))}
function scheduleLabel(t){
 const s=t.schedule||{};
 if(s.type==="weekly"){const ds=s.days||[];return ds.length===7?"毎日":`${ds.map(i=>DOW[i]).join("・")}曜`}
 if(s.type==="monthly")return`毎月${s.day}日`;
 if(s.type==="once")return s.date?`${s.date}のみ`:"日付未設定";
 return"";
}
function occurrencesPerWeek(t){
 const s=t.schedule||{};
 if(s.type==="weekly")return(s.days||[]).length;
 if(s.type==="monthly")return 12/52;
 return 0;
}
function weekly(t,base=false){const m=base?(+t.baselineMinutes||+t.minutes||0):(+t.minutes||0);return m*occurrencesPerWeek(t)}
function burden(t){return weekly(t)*Math.max(1,+t.burden||1)}
function candidates(){return state.tasks.filter(t=>t.active&&!["stop","automate"].includes(t.redesign)&&(t.redesign==="none"||t.burden>=4||burden(t)>=120)).sort((a,b)=>burden(b)-burden(a))}
function sum(a,f){return a.reduce((n,x)=>n+(f?f(x):x),0)}
function kanaSort(a,b){return(a.reading||a.name).localeCompare(b.reading||b.name,"ja",{sensitivity:"base",numeric:true})}
function fmtMin(min){min=Math.round(min);if(min<60)return`${min}分`;const h=Math.floor(min/60),m=min%60;return m?`${h}h${m}m`:`${h}h`}
function toast(msg){ui.toast=msg;render();setTimeout(()=>{ui.toast=null;render()},1600)}
function record(type,data={}){state.history.unshift({id:"h"+Date.now()+Math.random().toString(16).slice(2),type,date:new Date().toISOString(),...data});state.history=state.history.slice(0,300);save()}
function taskComp(id){return completions[dk()]?.[id]}
function ownerDone(t,ownerId){
 const c=taskComp(t.id);
 if(typeof c==="boolean")return c;
 if(!c||typeof c!=="object")return false;
 if(ownerId)return!!c[ownerId];
 return!!c._all;
}
function overallDone(t){
 const os=owners(t);const c=taskComp(t.id);
 if(typeof c==="boolean")return c;
 if(!os.length)return!!c?._all;
 return os.every(id=>!!c?.[id]);
}
function setOwnerDone(t,ownerId,v){
 const key=dk();completions[key]||={};
 let c=completions[key][t.id];
 if(typeof c==="boolean"){
   const obj={};owners(t).forEach(id=>obj[id]=c);obj._all=c;c=obj;
 }
 if(!c||typeof c!=="object")c={};
 if(ownerId)c[ownerId]=v;else c._all=v;
 completions[key][t.id]=c;saveComp();render();
}
function setAllDone(t,v){
 const key=dk();completions[key]||={};const c={_all:v};owners(t).forEach(id=>c[id]=v);completions[key][t.id]=c;saveComp();render();
}
function childLoad(id){return sum(todayTasks().filter(t=>owners(t).includes(id)),t=>+t.minutes||0)}
function title(){return({home:"ホーム",tasks:"タスク一覧",redesign:"見直し",analytics:"分析",settings:"設定",child:"こどもモード"})[ui.page]||""}

function render(){
 applyFont();
 document.getElementById("app").innerHTML=`<div class="app-shell">${top()}<main class="content">${page()}</main>${!["settings","child"].includes(ui.page)?`<button class="fab" data-action="new-task">＋</button>`:""}${nav()}${ui.modal?modal():""}${ui.toast?`<div class="toast">${esc(ui.toast)}</div>`:""}</div>`;
 bind();
}
function top(){
 return`<header class="topbar"><div class="brand"><div class="brand-mark">⌂</div><div><div class="brand-title">家事リデザイン <span class="badge green">v2</span></div><div class="brand-sub">${title()} · 表は今日を回す／裏で家庭を軽くする</div></div></div><div class="head-actions">${ui.page==="home"?`<button class="icon-btn" data-page="child" title="こどもモード">👧</button><button class="icon-btn" data-page="settings">⚙️</button>`:`${ui.page==="child"?`<button class="icon-btn" data-page="home">⌂</button>`:""}`}</div></header>`;
}
function page(){
 if(ui.page==="home")return home();
 if(ui.page==="tasks")return tasksPage();
 if(ui.page==="redesign")return redesignPage();
 if(ui.page==="analytics")return analyticsPage();
 if(ui.page==="child")return childPage();
 return settingsPage();
}
function nav(){
 const items=[["home","⌂","ホーム"],["tasks","☷","タスク"],["redesign","✦","見直し"],["analytics","▥","分析"],["settings","⚙","設定"]];
 return`<nav class="bottom-nav">${items.map(([p,i,l])=>`<button class="nav-btn ${ui.page===p?"active":""}" data-page="${p}"><span class="nav-icon">${i}</span><span>${l}</span></button>`).join("")}</nav>`;
}

function home(){
 const d=new Date(),list=todayTasks(),ua=list.filter(t=>!owners(t).length),dc=list.filter(overallDone).length,cand=candidates(),up=upcomingOnce();
 return`<div class="date-row"><div><div class="date-main">${d.getMonth()+1}月${d.getDate()}日（${DOW[d.getDay()]}）</div><div class="date-sub">今日 ${dc}/${list.length}件 完了</div></div><button class="ghost-btn" data-action="reset-today">完了をリセット</button></div>
 ${ua.length?`<div class="alert"><div class="alert-head"><span>⚠️ 今日、未担当 ${ua.length}件</span><button class="soft-btn" data-action="show-unassigned">担当を決める</button></div><ul class="alert-list">${ua.map(t=>`<li>${esc(t.name)}</li>`).join("")}</ul></div>`:""}
 ${up.length?`<div class="callout" style="margin-bottom:12px"><strong>📅 3日以内の単発タスク</strong><br>${up.map(t=>`${esc(t.name)}（${esc(t.schedule.date)}）`).join(" / ")}</div>`:""}
 <div class="segmented"><button class="${ui.homeMode==="person"?"active":""}" data-home-mode="person">人ごと</button><button class="${ui.homeMode==="time"?"active":""}" data-home-mode="time">時間ごと</button></div>
 ${ui.homeMode==="person"?homeByPerson(list):homeByTime(list)}
 <div class="improve-strip"><div><strong>💡 見直せそうな家事 ${cand.length}件</strong><span>毎日を止めず、裏側で改善。</span></div><button class="soft-btn" data-page="redesign">見る</button></div>`;
}
function upcomingOnce(){
 const now=new Date();now.setHours(0,0,0,0);const end=new Date(now);end.setDate(end.getDate()+3);
 return state.tasks.filter(t=>t.active&&t.schedule?.type==="once").filter(t=>{const x=parseDate(t.schedule.date);return x&&x>=now&&x<=end&&!occurs(t,now)});
}
function homeByPerson(list){
 const order=[...state.members,{id:"",name:"未担当",role:"none",emoji:"⚠️",color:"#a96500",soft:"#fff4d9"}];
 return order.map(m=>{
   const a=m.id?list.filter(t=>owners(t).includes(m.id)):list.filter(t=>!owners(t).length);
   if(!a.length)return"";
   const mins=sum(a,t=>+t.minutes||0),warn=m.role==="child"&&mins>state.settings.childDailyMinutes;
   return`<section class="card person-card" style="--person-color:${m.color};--person-soft:${m.soft}"><div class="person-head"><div class="person-name"><span class="avatar">${m.emoji}</span>${esc(m.name)} ${warn?`<span class="badge warn">負担注意</span>`:""}</div><div class="person-summary">${a.length}件${mins?` / 約${mins}分`:""}</div></div>
   ${Object.keys(TIMES).map(k=>{const x=a.filter(t=>t.time===k);return x.length?`<div class="time-label">${TIC[k]} ${TIMES[k]}</div>${x.map(t=>todayRow(t,m.id)).join("")}`:""}).join("")}
   ${warn?`<div class="callout warn">学習・休息を優先する目安（${state.settings.childDailyMinutes}分/日）を超えています。</div>`:""}</section>`;
 }).join("");
}
function todayRow(t,ownerId){
 const d=ownerId?ownerDone(t,ownerId):overallDone(t),shared=owners(t).length>1;
 return`<div class="task-row"><button class="check ${d?"done":""}" data-toggle-owner="${t.id}:${ownerId||"_all"}">${d?"✓":""}</button><div><div class="task-name ${d?"done":""}">${esc(t.name)}${shared?` <span class="badge purple">共同</span>`:""}</div><div class="task-meta">${scheduleLabel(t)} · 約${t.minutes}分 · ${CATS[t.category]||t.category}${t.level?` · 自立Lv.${t.level}`:""}</div></div><button class="mini-btn" data-edit-task="${t.id}">編集</button></div>`;
}
function homeByTime(list){
 return Object.keys(TIMES).map(k=>{
   const a=list.filter(t=>t.time===k);if(!a.length)return"";
   return`<section class="card"><div class="card-title-row"><div><h3 class="card-title">${TIC[k]} ${TIMES[k]}</h3><div class="card-sub">${a.length}件</div></div></div>${a.map(timeRow).join("")}</section>`;
 }).join("");
}
function timeRow(t){
 const os=ownerMembers(t),all=overallDone(t);
 return`<div class="task-row"><button class="check ${all?"done":""}" data-toggle-all="${t.id}">${all?"✓":""}</button><div><div class="task-name ${all?"done":""}">${esc(t.name)}</div><div class="task-meta">${esc(ownerSummary(t))} · 約${t.minutes}分</div>${os.length>1?`<div class="joint-progress">${os.map(m=>`<button class="joint-chip ${ownerDone(t,m.id)?"done":""}" data-toggle-owner="${t.id}:${m.id}">${m.emoji} ${esc(m.name)} ${ownerDone(t,m.id)?"✓":""}</button>`).join("")}</div>`:""}</div><button class="mini-btn" data-edit-task="${t.id}">編集</button></div>`;
}

function tasksPage(){
 let a=[...state.tasks];
 if(ui.taskFilter!=="all"){
   if(ui.taskFilter==="unassigned")a=a.filter(t=>!owners(t).length);
   else if(ui.taskFilter==="child")a=a.filter(t=>ownerMembers(t).some(m=>m.role==="child")||["child","school","personal"].includes(t.category));
   else a=a.filter(t=>t.category===ui.taskFilter);
 }
 if(ui.search.trim()){const q=ui.search.trim().toLowerCase();a=a.filter(t=>t.name.toLowerCase().includes(q)||(t.reading||"").includes(q)||(CATS[t.category]||"").includes(q))}
 if(state.settings.taskSort==="kana")a.sort(kanaSort);
 return`<h1 class="page-title">家庭タスク</h1><p class="page-lead">分解・共同担当・週次/月次/単発スケジュールに対応。</p>
 <div class="card flat"><div class="card-title-row"><div><h3 class="card-title">棚卸しを速くする</h3><div class="card-sub">テンプレートからまとめて追加できます。</div></div><button class="soft-btn" data-action="templates">テンプレート</button></div></div>
 <div class="search"><span>⌕</span><input id="task-search" value="${esc(ui.search)}" placeholder="タスクを検索"></div>
 <div class="filter-row">${[["all","すべて"],["unassigned","未担当"],["child","子ども関連"],["home","家"],["management","管理"],["cleaning","掃除"],["cooking","料理"]].map(([k,l])=>`<button class="chip ${ui.taskFilter===k?"active":""}" data-task-filter="${k}">${l}</button>`).join("")}</div>
 <div class="card"><div class="card-title-row"><div><h3 class="card-title">${a.length}件</h3><div class="card-sub">${state.settings.taskSort==="kana"?"五十音順":"登録順"}</div></div><div class="head-actions"><button class="ghost-btn" data-action="toggle-sort">${state.settings.taskSort==="kana"?"↩ 登録順":"あ→ん"}</button><button class="primary-btn" data-action="new-task">＋ 追加</button></div></div>${a.length?a.map(masterRow).join(""):`<div class="empty">該当するタスクはありません。</div>`}</div>`;
}
function masterRow(t){
 const os=ownerMembers(t);
 return`<div class="task-master-row"><div><div class="task-name">${esc(t.name)}</div><div class="badges"><span class="badge">${CATS[t.category]||t.category}</span><span class="badge ${os.length?"blue":"warn"}">${esc(ownerSummary(t))}</span>${os.length>1?`<span class="badge purple">共同</span>`:""}<span class="badge">${esc(scheduleLabel(t))}</span><span class="badge">${TIMES[t.time]}</span>${t.redesign!=="none"?`<span class="badge green">${REDESIGN[t.redesign]}</span>`:""}${t.level?`<span class="badge purple">自立Lv.${t.level}</span>`:""}</div></div><div class="task-actions"><button class="mini-btn" data-calendar="${t.id}">予定</button><button class="mini-btn" data-redesign-task="${t.id}">見直し</button><button class="mini-btn" data-edit-task="${t.id}">編集</button></div></div>`;
}

function redesignPage(){
 const c=candidates(),sel=ui.redesignTaskId?state.tasks.find(t=>t.id===ui.redesignTaskId):c[0];
 return`<h1 class="page-title">裏側のリデザイン</h1><p class="page-lead">今日の仕事を止めず、あとでまとめて改善します。</p><div class="card flat"><div class="card-title-row"><div><h3 class="card-title">見直し候補</h3><div class="card-sub">負担・頻度・未検討から抽出</div></div><span class="badge green">${c.length}件</span></div><div class="filter-row">${c.slice(0,15).map(t=>`<button class="chip ${sel?.id===t.id?"active":""}" data-redesign-select="${t.id}">${esc(t.name)}</button>`).join("")}</div></div>${sel?redesignEditor(sel):`<div class="empty">今すぐ見直す候補はありません。</div>`}`;
}
function redesignEditor(t){
 const opts=[["stop","🗑 やめる"],["automate","⚡ 自動化"],["simplify","✨ 簡略化"],["share","👥 分担"],["self","🌱 本人へ返す"],["keep","⏸ 維持"]];
 return`<div class="redesign-card"><div class="card-title-row"><div><h3 class="card-title">${esc(t.name)}</h3><div class="card-sub">${esc(ownerSummary(t))} · ${esc(scheduleLabel(t))} · ${t.minutes}分 · 面倒度${t.burden}/5</div></div><span class="badge ${t.redesign==="none"?"warn":"green"}">${REDESIGN[t.redesign]}</span></div>
 <div class="suggest-box"><strong>順番：</strong>やめる → 自動化 → 簡略化 → 残るなら分担。本人自身のことなら自立移管。</div>
 <div class="redesign-options">${opts.map(([k,l])=>`<button class="redesign-option ${t.redesign===k?"selected":""}" data-set-redesign="${t.id}:${k}">${l}</button>`).join("")}</div>
 ${t.redesign==="self"?independence(t):""}
 <div class="section-label">改善相談</div><div class="callout"><strong>AI API不要</strong><br>このタスクの条件を含む相談文をコピーし、普段使っているChatGPT等へ貼れます。<br><button class="soft-btn" style="margin-top:8px" data-ai-copy="${t.id}">相談文をコピー</button></div>
 <div class="section-label">負担のヒント</div>${suggestion(t)}</div>`;
}
function independence(t){
 const labs=["親がする","一緒にする","声かけだけ","通知だけ","完全自立"],lv=Math.min(5,Math.max(1,t.level||1));
 return`<div class="section-label">自立レベル</div><div class="level-track">${labs.map((l,i)=>`<button class="level-node ${lv===i+1?"active":""}" data-set-level="${t.id}:${i+1}">${i+1}<br>${l}</button>`).join("")}</div><div class="callout green" style="margin-top:8px">現在：レベル${lv}「${labs[lv-1]}」。進む・戻すの両方を記録します。</div>`;
}
function suggestion(t){
 if(["child","school","personal"].includes(t.category)){
  if(t.minutes<=5)return`<div class="callout green">短時間で本人自身の生活に関わるため、自立移管と相性がよい候補です。</div>`;
  if(t.minutes>15)return`<div class="callout warn">子どもには長めです。「自分の分だけ」に分解できないか検討してください。</div>`;
 }
 if(t.burden>=4||weekly(t)>180)return`<div class="callout warn">負担が大きめです。担当変更だけでなく、工程削減・まとめ処理・道具変更も検討。</div>`;
 return`<div class="callout">無理に変えず「維持」も正解です。</div>`;
}

function childPage(){
 const kids=state.members.filter(m=>m.role==="child");
 if(!ui.childId||!kids.some(k=>k.id===ui.childId))ui.childId=kids[0]?.id||null;
 const child=mem(ui.childId),list=child?todayTasks().filter(t=>owners(t).includes(child.id)):[];
 const mins=sum(list,t=>+t.minutes||0),done=list.filter(t=>ownerDone(t,child.id)).length;
 return`<div class="child-hero"><div class="card-title-row"><div><h1 class="page-title" style="margin:0">${child?`${child.emoji} ${esc(child.name)}の今日`:"こどもモード"}</h1><div class="card-sub">家庭全体の管理は見せず、自分のことだけ。</div></div><span class="badge ${mins>state.settings.childDailyMinutes?"warn":"green"}">${mins}分</span></div><div class="child-switch">${kids.map(k=>`<button class="${k.id===ui.childId?"active":""}" data-child="${k.id}">${k.emoji} ${esc(k.name)}</button>`).join("")}</div></div>
 ${child?`<div class="card"><div class="card-title-row"><div><h3 class="card-title">今日やること</h3><div class="card-sub">${done}/${list.length} 完了</div></div></div>${list.length?list.map(t=>todayRow(t,child.id)).join(""):`<div class="empty">今日は自分のタスクはありません。</div>`}</div>
 <div class="callout ${mins>state.settings.childDailyMinutes?"warn":"green"}">${mins>state.settings.childDailyMinutes?`今日の目安${state.settings.childDailyMinutes}分を超えています。大人側で見直してください。`:"勉強・休息を優先。終わったら家庭全体の仕事を追加で背負う必要はありません。"}</div>`:""}`;
}

function analyticsPage(){
 const active=state.tasks.filter(t=>t.active),before=sum(active,t=>weekly(t,true)),after=sum(active,t=>weekly(t,false)),saved=Math.max(0,before-after),people=state.members.filter(m=>m.role!=="auto");
 const load=m=>sum(active.filter(t=>owners(t).includes(m.id)),t=>weekly(t)),max=Math.max(1,...people.map(load));
 const ym=dk().slice(0,7),hist=state.history.filter(h=>h.date?.slice(0,7)===ym),growth=hist.filter(h=>h.type==="independence"&&h.to>h.from),changes=hist.filter(h=>["redesign","task"].includes(h.type));
 return`<h1 class="page-title">成果と成長</h1><p class="page-lead">家庭の負担と、子どもの自立を別々に追います。</p>
 <div class="metric-grid"><div class="metric"><div class="label">改善前 / 週</div><div class="num">${fmtMin(before)}</div></div><div class="metric"><div class="label">現在 / 週</div><div class="num">${fmtMin(after)}</div></div><div class="metric"><div class="label">削減 / 週</div><div class="num">${fmtMin(saved)}</div></div><div class="metric"><div class="label">今月の自立前進</div><div class="num">${growth.length}件</div></div></div>
 <div class="card"><h3 class="card-title">週あたりの担当時間</h3><div class="card-sub">共同タスクは各参加者の負担として表示</div>${people.map(m=>{const v=load(m);return`<div class="bar-row"><span>${m.emoji} ${esc(m.name)}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(v/max*100)}%;background:${m.color}"></div></div><b>${fmtMin(v)}</b></div>`}).join("")}</div>
 <div class="card"><div class="card-title-row"><div><h3 class="card-title">今月の成長記録</h3><div class="card-sub">自立レベルの変化</div></div></div>${hist.filter(h=>h.type==="independence").length?hist.filter(h=>h.type==="independence").slice(0,15).map(historyRow).join(""):`<div class="empty">今月の記録はまだありません。</div>`}</div>
 <div class="card"><div class="card-title-row"><div><h3 class="card-title">今月の家庭改善</h3><div class="card-sub">${changes.length}件の変更</div></div></div>${changes.length?changes.slice(0,15).map(historyRow).join(""):`<div class="empty">今月の変更はまだありません。</div>`}</div>`;
}
function historyRow(h){
 const t=state.tasks.find(x=>x.id===h.taskId),m=mem(h.memberId),date=new Date(h.date);
 let text="";
 if(h.type==="independence")text=`${t?.name||h.taskName||"タスク"}：Lv.${h.from} → Lv.${h.to}${m?`（${m.name}）`:""}`;
 if(h.type==="redesign")text=`${t?.name||h.taskName||"タスク"}：${REDESIGN[h.from]||h.from} → ${REDESIGN[h.to]||h.to}`;
 if(h.type==="task")text=`${h.action==="created"?"追加":"更新"}：${t?.name||h.taskName||"タスク"}`;
 return`<div class="history-item"><div class="history-icon">${h.type==="independence"?"🌱":h.type==="redesign"?"✦":"☷"}</div><div><strong style="font-size:11px">${esc(text)}</strong><div class="history-date">${date.getMonth()+1}/${date.getDate()} ${String(date.getHours()).padStart(2,"0")}:${String(date.getMinutes()).padStart(2,"0")}</div></div><span class="badge ${h.type==="independence"?"green":"blue"}">${h.type==="independence"?"成長":"改善"}</span></div>`;
}

function settingsPage(){
 const v2=[
  ["子ども専用『今日やること』画面","実装"],["家庭タスクの棚卸しテンプレート","実装"],["AI相談文コピー（API不要）","実装"],
  ["週次・月次・単発スケジュール","実装"],["共同タスクの個人別完了","実装"],["自立成長記録・月次表示","実装"],["カレンダー .ics 書き出し","実装"],
  ["家族の複数端末リアルタイム同期","保留"],["アプリを閉じた後の自動通知","保留"],["買い物・在庫を独立機能として拡張","保留"]
 ];
 return`<h1 class="page-title">設定</h1><p class="page-lead">v2でも、家庭OSのように肥大化させず「今日を回す＋家庭を軽くする」を軸にします。</p>
 <div class="card"><div class="card-title-row"><div><h3 class="card-title">家族</h3><div class="card-sub">タスクは複数人で共同担当できます。</div></div><button class="soft-btn" data-action="new-member">＋ 追加</button></div>${state.members.map(m=>`<div class="member-row"><div class="avatar" style="background:${m.soft};color:${m.color}">${m.emoji}</div><div><strong>${esc(m.name)}</strong><div class="card-sub">${m.role==="adult"?"大人":m.role==="child"?"子ども":"自動・機械"}</div></div><button class="mini-btn" data-edit-member="${m.id}">編集</button></div>`).join("")}</div>
 <div class="card"><h3 class="card-title">フォント</h3><div class="field" style="margin-top:9px"><label>表示フォント</label><select id="font-select">${Object.entries(FONT_LABELS).map(([k,l])=>`<option value="${k}" ${state.settings.font===k?"selected":""}>${l}</option>`).join("")}</select></div><div class="font-preview"><strong>家事リデザイン</strong><span>今日、誰が何をするかを一瞥。</span></div></div>
 <div class="card"><h3 class="card-title">子どもの生活タスク時間</h3><div class="field" style="margin-top:9px"><label>1日あたりの目安（分）</label><input id="child-limit" type="number" min="5" max="60" value="${state.settings.childDailyMinutes}"></div><button class="soft-btn" style="margin-top:8px" data-action="save-child-limit">保存</button></div>
 <div class="card"><h3 class="card-title">v2 実装状況</h3><div class="v2-status">${v2.map(([x,s])=>`<div class="v2-row"><span style="font-size:11px">${esc(x)}</span><span class="badge ${s==="実装"?"green":"warn"}">${s}</span></div>`).join("")}</div></div>
 <div class="card"><h3 class="card-title">バックアップ・端末間移行</h3><div class="card-sub">リアルタイム同期はまだ行わず、JSONで安全に移行できます。</div><div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:9px"><button class="soft-btn" data-action="export">JSONを書き出す</button><button class="ghost-btn" data-action="import">JSONを読み込む</button><input type="file" id="import-file" accept="application/json" hidden></div></div>
 <div class="card"><h3 class="card-title">初期化</h3><button class="danger-btn" style="margin-top:8px" data-action="reset-app">サンプルへ戻す</button></div>`;
}

function modal(){
 if(ui.modal==="task")return taskModal();
 if(ui.modal==="member")return memberModal();
 if(ui.modal==="unassigned")return unassignedModal();
 if(ui.modal==="templates")return templateModal();
 if(ui.modal==="template-select")return templateSelectModal();
 return"";
}
function ownerPicker(t){
 return`<div class="owner-picker">${state.members.map(m=>`<label class="owner-pick"><input type="checkbox" name="owners" value="${m.id}" ${owners(t).includes(m.id)?"checked":""}><span style="--pick-color:${m.color};--pick-soft:${m.soft}">${m.emoji} ${esc(m.name)}</span></label>`).join("")}</div><div class="card-sub">複数選択で共同タスク。誰も選ばなければ未担当。</div>`;
}
function taskModal(){
 const ex=ui.editTaskId?state.tasks.find(t=>t.id===ui.editTaskId):null;
 const t=ex||{name:"",reading:"",category:"home",forWhom:"family",owners:[],schedule:{type:"weekly",days:[1,2,3,4,5]},time:"evening",minutes:5,burden:2};
 const s=t.schedule||{type:"weekly",days:[1,2,3,4,5]};
 return`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">${ex?"タスクを編集":"タスクを追加"}</div><button class="modal-close" data-action="close-modal">×</button></div><form id="task-form">
 <div class="form-grid"><div class="field full"><label>タスク名</label><input name="name" required value="${esc(t.name)}"></div><div class="field full"><label>よみがな（五十音順用）</label><input name="reading" value="${esc(t.reading||"")}"></div>
 <div class="field"><label>分類</label><select name="category">${Object.entries(CATS).map(([k,l])=>`<option value="${k}" ${t.category===k?"selected":""}>${l}</option>`).join("")}</select></div>
 <div class="field"><label>誰のため？</label><select name="forWhom"><option value="family" ${t.forWhom==="family"?"selected":""}>家族全体</option><option value="children" ${t.forWhom==="children"?"selected":""}>子どもたち</option>${state.members.filter(m=>m.role!=="auto").map(m=>`<option value="${m.id}" ${t.forWhom===m.id?"selected":""}>${m.emoji} ${esc(m.name)}</option>`).join("")}</select></div>
 <div class="field full"><label>担当（複数選択可）</label>${ownerPicker(t)}</div>
 <div class="field"><label>時間帯</label><select name="time">${Object.entries(TIMES).map(([k,l])=>`<option value="${k}" ${t.time===k?"selected":""}>${l}</option>`).join("")}</select></div>
 <div class="field"><label>所要時間（分）</label><input name="minutes" type="number" min="0" max="300" value="${+t.minutes||0}"></div><div class="field"><label>面倒度 1〜5</label><input name="burden" type="number" min="1" max="5" value="${Math.max(1,+t.burden||1)}"></div>
 <div class="field"><label>スケジュール</label><select name="scheduleType" id="schedule-type"><option value="weekly" ${s.type==="weekly"?"selected":""}>毎週</option><option value="monthly" ${s.type==="monthly"?"selected":""}>毎月</option><option value="once" ${s.type==="once"?"selected":""}>単発</option></select></div>
 <div class="field full schedule-block" data-schedule="weekly"><label>曜日</label><div class="weekdays">${DOW.map((l,i)=>`<button type="button" class="day-btn ${(s.days||[]).includes(i)?"active":""}" data-day="${i}">${l}</button>`).join("")}</div><input type="hidden" name="days" value="${(s.days||[]).join(",")}"></div>
 <div class="field schedule-block" data-schedule="monthly"><label>毎月の日付</label><input name="monthlyDay" type="number" min="1" max="31" value="${s.day||1}"></div>
 <div class="field schedule-block" data-schedule="once"><label>実施日</label><input name="onceDate" type="date" value="${esc(s.date||dk())}"></div>
 </div><div class="modal-actions">${ex?`<button type="button" class="ghost-btn" data-calendar="${t.id}">予定を書き出す</button><button type="button" class="danger-btn" data-delete-task="${t.id}">削除</button>`:""}<button type="button" class="ghost-btn" data-action="close-modal">キャンセル</button><button class="primary-btn" type="submit">保存</button></div></form></div></div>`;
}
function memberModal(){
 const ex=ui.editMemberId?mem(ui.editMemberId):null,m=ex||{name:"",role:"adult",emoji:"🙂"};
 return`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">${ex?"家族を編集":"家族を追加"}</div><button class="modal-close" data-action="close-modal">×</button></div><form id="member-form"><div class="form-grid"><div class="field full"><label>表示名</label><input name="name" required value="${esc(m.name)}"></div><div class="field"><label>絵文字</label><input name="emoji" value="${esc(m.emoji||"🙂")}" maxlength="4"></div><div class="field"><label>役割</label><select name="role"><option value="adult" ${m.role==="adult"?"selected":""}>大人</option><option value="child" ${m.role==="child"?"selected":""}>子ども</option><option value="auto" ${m.role==="auto"?"selected":""}>自動・機械</option></select></div></div><div class="modal-actions">${ex&&!["me","dad","yui","so","auto"].includes(ex.id)?`<button type="button" class="danger-btn" data-delete-member="${ex.id}">削除</button>`:""}<button type="button" class="ghost-btn" data-action="close-modal">キャンセル</button><button class="primary-btn" type="submit">保存</button></div></form></div></div>`;
}
function unassignedModal(){
 const a=todayTasks().filter(t=>!owners(t).length);
 return`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">今日の未担当</div><button class="modal-close" data-action="close-modal">×</button></div>${a.length?a.map(t=>`<div class="task-master-row"><div><strong>${esc(t.name)}</strong><div class="card-sub">${TIMES[t.time]} · ${t.minutes}分</div></div><button class="soft-btn" data-edit-task="${t.id}">担当を選ぶ</button></div>`).join(""):`<div class="empty">未担当はありません。</div>`}</div></div>`;
}
function templateModal(){
 return`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">家庭タスク棚卸し</div><button class="modal-close" data-action="close-modal">×</button></div><div class="callout green" style="margin-bottom:10px">「これもやっている」を思い出すためのテンプレートです。追加後に担当・曜日を編集できます。</div><div class="template-grid">${TEMPLATES.map(x=>`<div class="template-card"><h4>${x.title}</h4><p>${x.desc}</p><button class="soft-btn" data-template="${x.id}">${x.tasks.length}件を見る</button></div>`).join("")}</div></div></div>`;
}
function templateSelectModal(){
 const temp=TEMPLATES.find(x=>x.id===ui.templateId);if(!temp)return"";
 return`<div class="modal-backdrop" data-modal-close><div class="modal" onclick="event.stopPropagation()"><div class="modal-head"><div class="modal-title">${temp.title}</div><button class="modal-close" data-action="close-modal">×</button></div><form id="template-form"><div class="template-checks">${temp.tasks.map((t,i)=>`<label class="template-check"><input type="checkbox" name="tpl" value="${i}" checked><span><strong>${esc(t[0])}</strong><div class="card-sub">${CATS[t[2]]} · 約${t[4]}分</div></span></label>`).join("")}</div><div class="modal-actions"><button type="button" class="ghost-btn" data-action="templates">戻る</button><button class="primary-btn" type="submit">選択したものを追加</button></div></form></div></div>`;
}

function bind(){
 document.querySelectorAll("[data-page]").forEach(e=>e.onclick=()=>{ui.page=e.dataset.page;ui.modal=null;render()});
 document.querySelectorAll("[data-home-mode]").forEach(e=>e.onclick=()=>{ui.homeMode=e.dataset.homeMode;render()});
 document.querySelectorAll("[data-toggle-owner]").forEach(e=>e.onclick=()=>{const [id,oid]=e.dataset.toggleOwner.split(":"),t=state.tasks.find(x=>x.id===id),ownerId=oid==="_all"?null:oid;if(t)setOwnerDone(t,ownerId,!ownerDone(t,ownerId))});
 document.querySelectorAll("[data-toggle-all]").forEach(e=>e.onclick=()=>{const t=state.tasks.find(x=>x.id===e.dataset.toggleAll);if(t)setAllDone(t,!overallDone(t))});
 document.querySelectorAll("[data-edit-task]").forEach(e=>e.onclick=()=>{ui.editTaskId=e.dataset.editTask;ui.modal="task";render()});
 document.querySelectorAll("[data-redesign-task]").forEach(e=>e.onclick=()=>{ui.redesignTaskId=e.dataset.redesignTask;ui.page="redesign";ui.modal=null;render()});
 document.querySelectorAll("[data-redesign-select]").forEach(e=>e.onclick=()=>{ui.redesignTaskId=e.dataset.redesignSelect;render()});
 document.querySelectorAll("[data-set-redesign]").forEach(e=>e.onclick=()=>setRedesign(e.dataset.setRedesign));
 document.querySelectorAll("[data-set-level]").forEach(e=>e.onclick=()=>setLevel(e.dataset.setLevel));
 document.querySelectorAll("[data-ai-copy]").forEach(e=>e.onclick=()=>copyAI(e.dataset.aiCopy));
 document.querySelectorAll("[data-task-filter]").forEach(e=>e.onclick=()=>{ui.taskFilter=e.dataset.taskFilter;render()});
 document.querySelectorAll("[data-calendar]").forEach(e=>e.onclick=ev=>{ev.stopPropagation();exportICS(e.dataset.calendar)});
 document.querySelectorAll("[data-child]").forEach(e=>e.onclick=()=>{ui.childId=e.dataset.child;render()});
 document.querySelectorAll("[data-action]").forEach(e=>e.onclick=()=>action(e.dataset.action));
 document.querySelectorAll("[data-modal-close]").forEach(e=>e.onclick=()=>{ui.modal=null;render()});
 document.querySelectorAll("[data-day]").forEach(e=>e.onclick=()=>{e.classList.toggle("active");const h=document.querySelector('input[name="days"]');if(h)h.value=[...document.querySelectorAll("[data-day].active")].map(x=>x.dataset.day).join(",")});
 document.querySelectorAll("[data-edit-member]").forEach(e=>e.onclick=()=>{ui.editMemberId=e.dataset.editMember;ui.modal="member";render()});
 document.querySelectorAll("[data-delete-task]").forEach(e=>e.onclick=()=>deleteTask(e.dataset.deleteTask));
 document.querySelectorAll("[data-delete-member]").forEach(e=>e.onclick=()=>deleteMember(e.dataset.deleteMember));
 document.querySelectorAll("[data-template]").forEach(e=>e.onclick=()=>{ui.templateId=e.dataset.template;ui.modal="template-select";render()});
 const search=document.getElementById("task-search");if(search)search.oninput=x=>{ui.search=x.target.value;render();requestAnimationFrame(()=>{const z=document.getElementById("task-search");if(z){z.focus();z.setSelectionRange(z.value.length,z.value.length)}})};
 const tf=document.getElementById("task-form");if(tf)tf.onsubmit=saveTask;
 const mf=document.getElementById("member-form");if(mf)mf.onsubmit=saveMember;
 const tpf=document.getElementById("template-form");if(tpf)tpf.onsubmit=addTemplates;
 const st=document.getElementById("schedule-type");if(st){st.onchange=toggleScheduleBlocks;toggleScheduleBlocks()}
 const fs=document.getElementById("font-select");if(fs)fs.onchange=()=>{state.settings.font=fs.value;save();applyFont();render()};
 const imp=document.getElementById("import-file");if(imp)imp.onchange=importJSON;
}
function toggleScheduleBlocks(){
 const type=document.getElementById("schedule-type")?.value;
 document.querySelectorAll(".schedule-block").forEach(x=>x.style.display=x.dataset.schedule===type?"block":"none");
}
function action(a){
 if(a==="new-task"){ui.editTaskId=null;ui.modal="task";render()}
 else if(a==="close-modal"){ui.modal=null;render()}
 else if(a==="show-unassigned"){ui.modal="unassigned";render()}
 else if(a==="templates"){ui.modal="templates";render()}
 else if(a==="toggle-sort"){state.settings.taskSort=state.settings.taskSort==="kana"?"created":"kana";save();render()}
 else if(a==="reset-today"){delete completions[dk()];saveComp();toast("今日の完了状態をリセットしました")}
 else if(a==="new-member"){ui.editMemberId=null;ui.modal="member";render()}
 else if(a==="save-child-limit"){state.settings.childDailyMinutes=Math.max(5,Math.min(60,+document.getElementById("child-limit").value||15));save();toast("目安時間を保存しました")}
 else if(a==="export")exportJSON()
 else if(a==="import")document.getElementById("import-file")?.click()
 else if(a==="reset-app"&&confirm("現在のデータを消してサンプルへ戻しますか？")){state=seed();completions={};save();saveComp();toast("初期状態へ戻しました")}
}
function saveTask(e){
 e.preventDefault();const f=new FormData(e.currentTarget),type=String(f.get("scheduleType")||"weekly");
 let schedule;
 if(type==="weekly"){const days=String(f.get("days")||"").split(",").filter(Boolean).map(Number);if(!days.length){alert("曜日を1つ以上選んでください。");return}schedule={type,days}}
 else if(type==="monthly"){schedule={type,day:Math.max(1,Math.min(31,+f.get("monthlyDay")||1))}}
 else{const date=String(f.get("onceDate")||"");if(!date){alert("実施日を選んでください。");return}schedule={type,date}}
 const data={name:String(f.get("name")||"").trim(),reading:String(f.get("reading")||"").trim(),category:String(f.get("category")||"home"),forWhom:String(f.get("forWhom")||"family"),owners:f.getAll("owners").map(String),schedule,time:String(f.get("time")||"evening"),minutes:Math.max(0,+f.get("minutes")||0),burden:Math.max(1,Math.min(5,+f.get("burden")||1))};
 if(ui.editTaskId){const t=state.tasks.find(x=>x.id===ui.editTaskId);if(t){Object.assign(t,data);record("task",{taskId:t.id,taskName:t.name,action:"updated"})}}
 else{const t={id:"t"+Date.now(),...data,redesign:"none",level:0,active:true,baselineMinutes:data.minutes};state.tasks.push(t);record("task",{taskId:t.id,taskName:t.name,action:"created"})}
 save();ui.modal=null;toast("タスクを保存しました");
}
function saveMember(e){
 e.preventDefault();const f=new FormData(e.currentTarget),name=String(f.get("name")||"").trim(),emoji=String(f.get("emoji")||"🙂").trim()||"🙂",role=String(f.get("role")||"adult");
 if(ui.editMemberId){const m=mem(ui.editMemberId);if(m){m.name=name;m.emoji=emoji;m.role=role}}
 else{const [color,soft]=COLORS[state.members.length%COLORS.length];state.members.push({id:"m"+Date.now(),name,emoji,role,color,soft})}
 save();ui.modal=null;toast("家族設定を保存しました");
}
function deleteTask(id){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;
 if(confirm(`「${t.name}」を削除しますか？`)){state.tasks=state.tasks.filter(x=>x.id!==id);record("task",{taskId:id,taskName:t.name,action:"deleted"});save();ui.modal=null;toast("削除しました")}
}
function deleteMember(id){
 const m=mem(id);if(!m)return;
 if(confirm(`「${m.name}」を削除しますか？ 担当中のタスクは未担当になります。`)){state.tasks.forEach(t=>{t.owners=owners(t).filter(x=>x!==id);if(t.forWhom===id)t.forWhom="family"});state.members=state.members.filter(x=>x.id!==id);save();ui.modal=null;toast("家族を削除しました")}
}
function addTemplates(e){
 e.preventDefault();const temp=TEMPLATES.find(x=>x.id===ui.templateId);if(!temp)return;
 const ids=new FormData(e.currentTarget).getAll("tpl").map(Number);let n=0;
 ids.forEach(i=>{const x=temp.tasks[i];if(!x)return;const t={id:"t"+Date.now()+i,name:x[0],reading:x[1],category:x[2],forWhom:"family",owners:[],schedule:{type:"weekly",days:[0,1,2,3,4,5,6]},time:x[3],minutes:x[4],burden:2,redesign:"none",level:0,active:true,baselineMinutes:x[4]};state.tasks.push(t);record("task",{taskId:t.id,taskName:t.name,action:"created"});n++});
 save();ui.modal=null;ui.page="tasks";toast(`${n}件追加しました。担当・曜日を調整してください`);
}
function setRedesign(v){
 const [id,val]=v.split(":"),t=state.tasks.find(x=>x.id===id);if(!t)return;const from=t.redesign;t.redesign=val;
 if(val==="stop"){t.active=false;t.minutes=0}
 else{
   t.active=true;
   if((from==="stop"||from==="automate")&&t.minutes===0&&t.baselineMinutes>0)t.minutes=t.baselineMinutes;
 }
 if(val==="automate"){const a=state.members.find(m=>m.role==="auto");if(a)t.owners=[a.id];t.minutes=0}
 if(val==="self"&&!t.level)t.level=1;
 record("redesign",{taskId:t.id,taskName:t.name,from,to:val});save();toast(`「${REDESIGN[val]}」に更新しました`);
}
function setLevel(v){
 const [id,s]=v.split(":"),t=state.tasks.find(x=>x.id===id);if(!t)return;const from=+t.level||1,to=+s;t.level=to;
 const childOwner=ownerMembers(t).find(m=>m.role==="child");record("independence",{taskId:t.id,taskName:t.name,memberId:childOwner?.id,from,to});save();render();
}
async function copyAI(id){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;
 const prompt=`あなたは家庭内タスク改善のコンサルタントです。次のタスクを、家族の負担を増やさず改善してください。

タスク：${t.name}
分類：${CATS[t.category]||t.category}
担当：${ownerSummary(t)}
頻度：${scheduleLabel(t)}
時間帯：${TIMES[t.time]}
1回の所要時間：約${t.minutes}分
面倒度：${t.burden}/5
現在の方針：${REDESIGN[t.redesign]}

次の順で検討してください。
1. そもそもやめられるか
2. 自動化できるか
3. 工程・頻度を簡略化できるか
4. 残る仕事を適切に分担できるか
5. 子ども本人の生活タスクなら自立に役立つか。ただし学習・休息を圧迫しないこと
具体策を、費用・手間・削減できる時間の目安とともに3案以内で提案してください。`;
 try{await navigator.clipboard.writeText(prompt);toast("AI相談文をコピーしました")}catch{window.prompt("この文章をコピーしてください",prompt)}
}
function exportICS(id){
 const t=state.tasks.find(x=>x.id===id);if(!t)return;
 const uid=`${t.id}@kaji-redesign`;let dt="",rr="";
 if(t.schedule.type==="once"){dt=`DTSTART;VALUE=DATE:${t.schedule.date.replaceAll("-","")}\n`}
 else{
   const start=new Date(),ds=t.schedule.type==="weekly"?(t.schedule.days||[]):[start.getDay()];
   if(t.schedule.type==="weekly"&&ds.length){let x=new Date(start);while(!ds.includes(x.getDay()))x.setDate(x.getDate()+1);dt=`DTSTART;VALUE=DATE:${dk(x).replaceAll("-","")}\n`;const map=["SU","MO","TU","WE","TH","FR","SA"];rr=`RRULE:FREQ=WEEKLY;BYDAY=${ds.map(d=>map[d]).join(",")}\n`}
   if(t.schedule.type==="monthly"){let x=new Date(start.getFullYear(),start.getMonth(),Math.min(t.schedule.day,28));if(x<start)x=new Date(start.getFullYear(),start.getMonth()+1,Math.min(t.schedule.day,28));dt=`DTSTART;VALUE=DATE:${dk(x).replaceAll("-","")}\n`;rr=`RRULE:FREQ=MONTHLY;BYMONTHDAY=${t.schedule.day}\n`}
 }
 const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kaji Redesign//JP
BEGIN:VEVENT
UID:${uid}
${dt}${rr}SUMMARY:${t.name}
DESCRIPTION:担当 ${ownerSummary(t)} / 約${t.minutes}分
END:VEVENT
END:VCALENDAR`;
 const blob=new Blob([ics],{type:"text/calendar;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`${t.name}.ics`;a.click();URL.revokeObjectURL(url);toast("カレンダー予定を書き出しました");
}
function exportJSON(){
 const blob=new Blob([JSON.stringify({app:"家事リデザイン",version:2,exportedAt:new Date().toISOString(),state,completions},null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=`kaji-redesign-v2-${dk()}.json`;a.click();URL.revokeObjectURL(url);toast("バックアップを書き出しました");
}
function importJSON(e){
 const file=e.target.files?.[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const p=JSON.parse(r.result),s=normalize(p.state||p);state=s;completions=p.completions||{};save();saveComp();toast("バックアップを読み込みました")}catch{alert("家事リデザインのJSONとして読み込めません。")}};r.readAsText(file);
}

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();
})();
