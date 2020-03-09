const express = require('express');
const app = express();
const port = 3000;
const InferenceEngine = require("./InferenceEngine/inference-engine");
const IE = new InferenceEngine(); 

app.use(express.json());

app.get('/drugs', (req,res) => {
    console.log(IE.getSymptoms());
});

app.get('/symptoms', (req,res) => {
  console.log(IE.getSymptoms());
});

app.post('/symptoms', (req,res) => {
  console.log(req.body);
  if(req.body["symptomName"] != null)
    IE.addSymptom(req.body["symptomName"]);
  else
    res.status(400);
});

app.post('/drugs', (req,res) => {
    
});

app.post('/learn', (req,res) => {
    if(req.body["drugName"] != null && req.body["symptoms"] != null)
        IE.learn(req.body["drugName"], req.body["symptoms"]);
    else
        res.status(400);
});

app.get('/infer', (req,res) => {
    if(req.body["symptoms"] != null)
        IE.infer(req.body["symptoms"]);
    else
        res.status(400);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))






