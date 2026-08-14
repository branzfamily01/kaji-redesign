const {onDocumentUpdated} = require("firebase-functions/v2/firestore");
const {setGlobalOptions} = require("firebase-functions/v2");
const admin = require("firebase-admin");

admin.initializeApp();
setGlobalOptions({region: "asia-northeast1", maxInstances: 10});
const db = admin.firestore();

async function tokensForMembers(householdId, memberIds) {
  if (!memberIds?.length) return [];
  const snap = await db.collection("households").doc(householdId).collection("devices")
    .where("enabled", "==", true).get();
  return snap.docs
    .map(d => d.data())
    .filter(d => memberIds.includes(d.memberId) && d.token)
    .map(d => d.token);
}

async function sendAssignment(tokens, taskName, taskId, householdId) {
  const unique=[...new Set(tokens)];
  if(!unique.length) return;
  for(let i=0;i<unique.length;i+=500){
    await admin.messaging().sendEachForMulticast({
      tokens: unique.slice(i,i+500),
      data: {
        type:"assignment",
        title:"家事リデザイン",
        body:`「${taskName||"タスク"}」の担当になりました`,
        taskId,
        householdId
      },
      webpush: {
        notification: {
          title:"家事リデザイン",
          body:`「${taskName||"タスク"}」の担当になりました`,
          icon:"https://branzfamily01.github.io/kaji-redesign/icon.svg"
        },
        fcmOptions:{link:"https://branzfamily01.github.io/kaji-redesign/"}
      }
    });
  }
}

exports.notifyTaskAssignment = onDocumentUpdated("households/{householdId}/tasks/{taskId}", async event => {
  const before=event.data.before.data()||{},after=event.data.after.data()||{};
  const oldOwners=Array.isArray(before.owners)?before.owners:[];
  const newOwners=Array.isArray(after.owners)?after.owners:[];
  const added=newOwners.filter(id=>!oldOwners.includes(id));
  if(!added.length) return;
  const tokens=await tokensForMembers(event.params.householdId,added);
  await sendAssignment(tokens,after.name,event.params.taskId,event.params.householdId);
});
