// const firebaseConfig = {
//   apiKey: "AIzaSyB5xxMyA-otxSbBLUECdInr_7yuHllZmW4",
//   authDomain: "expert-system-50e65.firebaseapp.com",
//   databaseURL: "https://expert-system-50e65.firebaseio.com",
//   projectId: "expert-system-50e65",
//   storageBucket: "expert-system-50e65.appspot.com",
//   messagingSenderId: "543539378428",
//   appId: "1:543539378428:web:f8a5789c24d516b69b3f79",
//   measurementId: "G-J03THG6JKH"
// };

// firebase.initalizeApp(firebaseConfig);

const db = firebase.firestore();

let factRef = db.collection('facts')

factRef.add({
  'name' : 'owchie',
  'symptomId' : 4
});

db.collection('facts').get().then(symptoms => {
    symptoms.forEach(symptom => {
        console.log(`${symptom.id} => ${JSON.stringify(symptom.data())}`);
    })
}).catch(err => {
    console.log(err);
})
