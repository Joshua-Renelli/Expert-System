
const admin = require('firebase-admin');
const serviceAccount = require('../expert-system-50e65-firebase-adminsdk-ot0ba-8e9b063ac7.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://expert-system-50e65.firebaseio.com"
});

const db = admin.firestore();

module.exports = class InferenceEngine{
    constructor(){
        this._symptoms = retrieveSymptoms();
        this._drugs = retrieveDrugs();
    }

    addSymptom(symptomName){
        if(!this._symptoms.includes(symptomName)){
            db.collection('facts').doc(symptomName.toLowerCase().replace(' ', '_')).set({})
            .then(() => this._symptoms.push(symptomName))
            .catch(err => console.log("Error adding new symptom: " + err))
        }
    }

    async learn(drugName, symptoms){
        //Check for symptoms that do not currently exist
        const invalid = symptoms.filter(symptom => !this._symptoms.includes(symptom))
        if(invalid.length > 0){
            console.log(`The following symptoms do not exist! ${invalid}`);
            return;
        }

        let formattedDrugName = drugName.toLowerCase().replace(' ', '_')

        if(!this._drugs.includes(formattedDrugName)){
            try{
                await db.collection('rules').doc(formattedDrugName).set({
                    symptoms: symptoms
                })
                this._drugs.push(formattedDrugName)
            }catch(error){
                throw new Error(`Error adding new drug: ${error}`);
            }
        }
        else{
            throw new Error(`New drug already exists: ${formattedDrugName}`);
        }
    }

    async infer(symptoms){
            //Check for symptoms that do not currently exist
            const invalid = symptoms.filter(symptom => !this._symptoms.includes(symptom))
            if(invalid.length > 0){
                throw new Error(`The following symptoms do not exist: ${invalid}`);
            }
            if(symptoms.length > 10){
                throw new Error('Can only query up to 10 symptoms at once!');
            }

            let ranking = []

            try{
                let snapshot = await db.collection('rules').where('symptoms', 'array-contains-any', symptoms).get()
                snapshot.forEach(doc => {
                    let docId = doc.id;
                    let rank = calculateRanking(symptoms, doc.data().symptoms);
                    let intersection = arrayIntersection(symptoms, doc.data().symptoms);
                    let difference = arrayDifference(symptoms, doc.data().symptoms);
                    
                    if(rank > 0)
                        ranking.push({drugName: docId, rank: rank, associatedSymptoms: intersection, nonAssociatedSymptoms: difference});
                })
                ranking.sort((a, b) => (a.rank > b.rank) ? -1 : (a.rank === b.rank) ? ((a.size > b.size) ? 1 : -1) : 1 )
                return ranking;
                
            }catch(error){
                throw new Error("Failed to query DB");
            }
            
    }

    getSymptoms(){
        return this._symptoms;
    }

    getDrugs(){
        return this._drugs;
    }
}

function retrieveSymptoms(){
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

function retrieveDrugs(){
    let drugs = [];
    db.collection('rules').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            drugs.push(doc.id);
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
    return drugs;
}

function calculateRanking(providedSymptoms, totalSymptoms){
    const intersection = arrayIntersection(providedSymptoms,totalSymptoms)
    //const difference = arrayDifference(providedSymptoms,totalSymptoms)
    //const ranking = (intersection.length - difference.length) / totalSymptoms.length;
    const ranking = intersection.length / totalSymptoms.length;
    return ranking;
}

function arrayIntersection(providedSymptoms,totalSymptoms){
    return providedSymptoms.filter(symptom => totalSymptoms.includes(symptom));
}

//Returns whats in the Total but NOT in the Provided
function arrayDifference(providedSymptoms, totalSymptoms){
    return totalSymptoms.filter(symptom => !providedSymptoms.includes(symptom));
}