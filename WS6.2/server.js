const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { response } = require('express');
const jsonParser = bodyParser.json();
const MongoClient = require('mongodb').MongoClient;
const DATABASE_NAME = 'web-arch';
const url = `mongodb://localhost:27017/${DATABASE_NAME}`;

let db  = null;
let collection = null;

MongoClient.connect(url, function(err, client){
    console.log("Connected successfully");
    db = client.db(DATABASE_NAME);
    collection = db.collection('figure');
})

app.use(express.static('TD5'));

app.get('/', function (req, res){
    res.send('Main page');
});

async function insertFigure(req, res){
    const fig = req.body;
    const doc = {
        fig: fig
    };
    const result = await collection.insertOne(doc);
    console.log(`Document id: ${result.insertedId}`);
}

app.post('/writefigure', jsonParser, insertFigure);

app.get('/writefigure', jsonParser, function(req,res){
    res.send(req.body)
});

app.listen(3000, function(){
    console.log('Here we goooo');
});