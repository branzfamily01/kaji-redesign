const CACHE="kaji-redesign-v2.1.1";
const ASSETS=["./","./index.html","./style.css","./v21.css","./app.js","./firebase-config.js","./cloud-bridge.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp}).catch(()=>caches.match("./index.html"))))});

try{
  importScripts("./firebase-config.js");
  const c=self.KAJI_FIREBASE_CONFIG;
  if(c?.enabled&&c.firebase?.apiKey&&c.firebase?.projectId){
    importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-app-compat.js");
    importScripts("https://www.gstatic.com/firebasejs/12.16.0/firebase-messaging-compat.js");
    firebase.initializeApp(c.firebase);
    const messaging=firebase.messaging();
    messaging.onBackgroundMessage(payload=>{
      if(payload.notification)return;
      const d=payload.data||{};
      self.registration.showNotification(d.title||"家事リデザイン",{body:d.body||"家庭タスクに更新があります",icon:"./icon.svg",badge:"./icon.svg",data:d});
    });
  }
}catch(err){console.warn("FCM not configured",err)}

self.addEventListener("notificationclick",e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(list=>{
    const existing=list.find(c=>"focus" in c);if(existing)return existing.focus();
    return clients.openWindow("./");
  }));
});
