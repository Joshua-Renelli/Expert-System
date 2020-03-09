const express = require('express');
const app = express();
const port = 3000;
const InferenceEngine = require("./InferenceEngine/inference-engine");
const IE = new InferenceEngine(); 

app.use(express.json());

app.get('/drugs', (req,res) => {
    res.send(IE.getDrugs());
});

app.get('/symptoms', (req,res) => {
  res.send(IE.getSymptoms());
});

app.post('/symptoms', (req,res) => {
  console.log(req.body);
  if(req.body["symptomName"] != null)
    IE.addSymptom(req.body["symptomName"]);
  else
    res.status(400);
});

app.post('/learn', (req,res) => {
    if(req.body["drugName"] != null && req.body["symptoms"] != null)
        IE.learn(req.body["drugName"], req.body["symptoms"]).catch(error => res.status(500).send(error.message));
    else
        res.status(400);
});

app.get('/infer', (req,res) => {
    if(req.body["symptoms"] != null){
        IE.infer(req.body["symptoms"]).then(result => {
            res.send(result);
        }).catch(error => {
            res.status(500).send(error.message);
        })
    }
    else{
        res.status(400);

    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))






