(() => {
"use strict";

let repairing=false;

function repairCloudCard(){
  const bridge=globalThis.KajiCloud;
  const state=bridge?.state;
  const card=document.querySelector("#cloud-sync-card");
  if(!state||!card||repairing)return;

  const showingLogin=!!card.querySelector("#cloud-email");
  const showingLoggedIn=!!card.querySelector(".cloud-user");
  const stale=(state.user&&showingLogin)||(!state.user&&showingLoggedIn);

  if(stale){
    repairing=true;
    card.remove();
    setTimeout(()=>{repairing=false},120);
  }
}

new MutationObserver(repairCloudCard).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener("DOMContentLoaded",()=>{
  repairCloudCard();
  setInterval(repairCloudCard,500);
});
})();
