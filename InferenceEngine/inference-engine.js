
const admin = require('firebase-admin');
const serviceAccount = require('/Users/joshuarenelli/Desktop/repos/expert-system/Expert-System/expert-system-50e65-firebase-adminsdk-ot0ba-8e9b063ac7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expert-system-50e65.firebaseio.com"
});

const db = admin.firestore();

module.exports = class InferenceEngine{
    constructor(){
        this._symptoms = this.retrieveSymptoms();
        this._drugs = this.retrieveDrugs();
    }

    retrieveSymptoms(){
      let symptoms = [];
      db.collection('facts').get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
            symptoms.push(doc.id);
        });
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });
      return symptoms;
    }

    retrieveDrugs(){
        let drugs = [];
        db.collection('rules').get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                drugs.push(doc.data());
            });
        })
        .catch((err) => {
            console.log('Error getting documents', err);
        });
        return drugs;
    }

    addSymptom(symptomName){
        if(!this._symptoms.includes(symptomName)){
            db.collection('facts').doc(symptomName.toLowerCase().replace(' ', '_')).set({})
            .then(() => this._symptoms.push(symptomName))
            .catch(err => console.log("Error adding new symptom: " + err))
        }
    }

    learn(drugName, symptoms){
        //Check for symptoms that do not currently exist
        const invalid = symptoms.filter(symptom => !this._symptoms.includes(symptom))
        if(invalid.length > 0){
            console.log(`The following symptoms do not exist! ${invalid}`);
            return;
        }

        if(!this._drugs.includes(drugName)){
            db.collection('rules').doc(drugName.toLowerCase().replace(' ', '_')).set({
                symptoms: symptoms
            })
            .then(() => this._drugs.push(drugName))
            .catch(err => console.log("Error adding new drug: " + err))
        }
    }

    infer(symptoms){
        //Check for symptoms that do not currently exist
        const invalid = symptoms.filter(symptom => !this._symptoms.includes(symptom))
        if(invalid.length > 0){
            console.log(`The following symptoms do not exist! ${invalid}`);
            return;
        }
        if(symptoms.length > 10){
            console.log('Can only query up to 10 symptoms at once!');
            return;
        }

        let ranking = []

        db.collection('rules').where('symptoms', 'array-contains-any', symptoms).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                let docId = doc.id;
                ranking.push({drugName: docId,
                              rank: calculateRanking(symptoms, doc.data().symptoms)});
            })
            ranking.sort((a, b) => (a.rank > b.rank) ? -1 : (a.rank === b.rank) ? ((a.size > b.size) ? 1 : -1) : 1 )
            console.log(ranking);
        })
    }

    getSymptoms(){
        return this._symptoms;
    }

    getDrugs(){
        return this._drugs;
    }
}

function calculateRanking(providedSymptoms, totalSymptoms){
    const intersection = providedSymptoms.filter(symptom => totalSymptoms.includes(symptom))
    const ranking = intersection.length / totalSymptoms.length;
    return ranking;
}
