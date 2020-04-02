const admin = require('firebase-admin');
const serviceAccount = require('../expert-system-50e65-firebase-adminsdk-ot0ba-8e9b063ac7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expert-system-50e65.firebaseio.com"
});

const db = admin.firestore();
let drugs = {}
let symptoms = []
let rulesRef = db.collection('rules')

console.log("Running...")
db.collection('rules').get()
.then((snapshot) => {
    snapshot.forEach((doc) => {
        //Format the symptom information and store in the drugs JSON
        drugs[doc.id] = doc.data().symptoms.map(symptom => symptom.replace(/ /g,"_").toLowerCase());
    });
    
    //For every unique occurence of a symptom, add it to the facts collection
    Object.keys(drugs).forEach((drug) => {
        drugs[drug].forEach((symptom) => {
            if(!symptoms.includes(symptom)){
                symptoms.push(symptom);
                db.collection('facts').doc(symptom).set({})
            }
        })
    })
})
.then(() => {
    //Go through each drug and replace the unformatted symptoms data with the newly formatted data
    let batch = db.batch();
    Object.keys(drugs).forEach((drug) => {
        batch.set(rulesRef.doc(drug), {symptoms: drugs[drug]})
    })
    batch.commit().then((res) => console.log(res));
    console.log("Complete!");
})
.catch((err) => {
    console.log('Error: ', err);
});

