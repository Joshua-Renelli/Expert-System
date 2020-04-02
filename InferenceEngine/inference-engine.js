
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

        //Format the drug name to match the current formatting of data 
        let formattedDrugName = drugName.toLowerCase().replace(' ', '_')

        //Check to ensure that the drug does not already exist
        if(!this._drugs.includes(formattedDrugName)){
            try{
                //Add the drug to the database
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
            //Ensure that 10 or less symptoms have been included as 'array-contians-any' has a max of 10 included elements
            if(symptoms.length > 10){
                throw new Error('Can only query up to 10 symptoms at once!');
            }

            let ranking = []

            try{
                //Retrieve all medications that contain at least ONE of the provided symptoms
                let snapshot = await db.collection('rules').where('symptoms', 'array-contains-any', symptoms).get()
                snapshot.forEach(doc => {
                    let docId = doc.id;
                    let rank = calculateRanking(symptoms, doc.data().symptoms);     //Calculate the ranking of each medication
                    let intersection = arrayIntersection(symptoms, doc.data().symptoms);
                    let difference = arrayDifference(symptoms, doc.data().symptoms);
                    
                    ranking.push({drugName: docId, rank: rank, associatedSymptoms: intersection, nonAssociatedSymptoms: difference});
                })
                //Sort the array of medications based on rank value
                ranking.sort((a, b) => (a.rank > b.rank) ? -1 : (a.rank === b.rank) ? ((a.size > b.size) ? 1 : -1) : 1 )
                //Limit total returned medicaitons if there are more than 6 results
                if(ranking.length > 6)
                    ranking = ranking.slice(0,6)

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
    const intersection = arrayIntersection(providedSymptoms,totalSymptoms);
    const ranking = intersection.length / providedSymptoms.length;
    return ranking;
}

function arrayIntersection(providedSymptoms,totalSymptoms){
    return providedSymptoms.filter(symptom => totalSymptoms.includes(symptom));
}

//Returns whats in the Total but NOT in the Provided
function arrayDifference(providedSymptoms, totalSymptoms){
    return totalSymptoms.filter(symptom => !providedSymptoms.includes(symptom));
}