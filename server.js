const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;
const InferenceEngine = require("./InferenceEngine/inference-engine");
const IE = new InferenceEngine(); 

app.use(express.json());
app.use(cors());

app.get('/drugs', (req,res) => {
    res.json(IE.getDrugs());
});

app.get('/symptoms', (req,res) => {
  res.json(IE.getSymptoms());
});

app.post('/symptoms', (req,res) => {
  console.log(req.body);
  if(req.body["symptomName"] != null)
    IE.addSymptom(req.body["symptomName"]);
  else
    res.status(400);
});

app.post('/learn', (req,res) => {
    console.log(req.body);
    if(req.body["drugName"] != null && req.body["symptoms"] != null)
        IE.learn(req.body["drugName"], req.body["symptoms"]).catch(error => res.status(500).send(error.message));
    else
        res.status(400);
});

app.post('/infer', (req,res) => {
    if(req.body.length > 0){
        IE.infer(req.body).then(result => {
            res.json(result);
        }).catch(error => {
            res.status(500).send(error.message);
        })
    }
    else{
        res.status(400);
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
