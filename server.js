const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;
const InferenceEngine = require("./InferenceEngine/inference-engine");
const IE = new InferenceEngine();   //Create instance of the inference engine 

app.use(express.json());    //express.json middleware required to send json data in requests
app.use(cors());    //cors middleware required as the API server is on a different port than the react application

//Returns all symptoms as an array 
app.get('/symptoms', (req,res) => {
  res.json(IE.getSymptoms());
});

//Take in a symptom name, add the system to the DB using the inference engine
app.post('/symptoms', (req,res) => {
  if(req.body["symptomName"] != null)
    IE.addSymptom(req.body["symptomName"]);
  else
    res.status(400);
});

//Takes in a drugName (string) and and array of symptoms (string[])
//Adds a new drug to the DB using the inference engine
app.post('/learn', (req,res) => {
    if(req.body["drugName"] != null && req.body["symptoms"] != null)    //Ensures that values are present in the request body
        IE.learn(req.body["drugName"], req.body["symptoms"])
        .then(result => res.send("Success"))
        .catch(error => res.status(500).send(error.message));
    else
        res.status(400);
});

//Takes in an array of symptoms (string[])
//Infers the data using the inference engine and returns an array of objects representing the resultant medication and ranks
app.post('/infer', (req,res) => {
    if(req.body.length > 0){    //Ensures the symptoms array is not empty
        IE.infer(req.body).then(result => {
            res.json(result);   //Returns the resultant medications as a json object
        }).catch(error => {
            res.status(500).send(error.message);
        })
    }
    else{
        res.status(400);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
