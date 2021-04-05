var express = require('express');
var app = express();

const fetch = require("node-fetch");
var path = require('path');
const assert = require('assert');

//app.use(bodyparser.json());
app.use(express.static('public'));

const bodyParser = require('body-parser');
app.use(bodyParser.json()); 
const jsonParser = bodyParser.json();


const localtunnel = require('localtunnel');

(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  tunnel.url;
  console.log(tunnel.url);

  tunnel.on('close', () => {
    // tunnels are closed
  });
})();

//82.64.121.177


//TD8
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//const WebSocket = require('ws');
//const server = new WebSocket.Server({port:'3000'});
//const socket = new WebSocket('http://localhost:3000/figuresapp')


http.listen(3000, () => {
  console.log('listening on *:3000');
});


io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('FIGURE', (fig) => {
    console.log('figure: ' + fig.form);
    io.emit('figure',fig);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });


});

io.on('connection', (socket) => {
  socket.on('figure', (fig) => {
    console.log('figure: ' + fig);
  });
});

io.on('connection', (socket) => {
  socket.broadcast.emit('hi');
});


/*
const MongoClient = require('mongodb').MongoClient;
//const MONGO_URL = "mongodb://localhost:27017/?readPreference=primary&ssl=false";
//const client = new MongoClient(MONGO_URL);

const DATABASE_NAME = 'mydrawing';
const url = `mongodb://localhost:49153/${DATABASE_NAME}`; // a voir selon port !!!

let db  = null;
let collection = null;

MongoClient.connect(url, function(err, client){
  console.log("Connected successfully");
  db = client.db(DATABASE_NAME);
  collection = db.collection('app');

  
})
*/

//EXO 2.1 : create a static server
app.get('/', function (req, res) {
  res.send('Hello World!');
});

/*
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
*/

//EXO 2.2 et 2.3
app.use(express.static(__dirname + '/figuresapp'));
app.get('/figuresapp', function(req, res) {
    res.sendFile(path.join(__dirname + '/figuresapp/index.html'));
});

//CODE LOG cote server
//INSERT THE SHAPE IN MONGO
app.post('/figuresapp3', jsonParser, function (req, res) {
  //console.log("IN");
  const figure= req.body;
  console.log("Last draw : ");
  console.log(figure);

  //insertFigure(figure.data,figure.user);

});



//TD8 - CHATBOT


//TD7 _ MONGO
//get collection
async function insertFigure(fig,user){

  try {
    console.log("insert :  ");
    //const fig = req.body;
    const doc = {figure: fig, user:user};

    if(doc.figure.form != '' && doc.user != ''){
      const result = await collection.insertOne(doc);
      console.log(`Document id: ${result.insertedId}`);

    }
    else{
      console.log('No shape in here !');
    }
  
  }
  catch(error){
    console.log(error);
  }
  
}

async function queryFigure(username){
  const result = [];

  //const c = await collection.find(); collection.find({user:user}).toArray()
  const userfigures = await collection.find({user:username}).toArray();

  console.log("query userfigures",userfigures );

  for(const line of userfigures){
    console.log("ligne",line);
    result.push(line.figure);
  }

  return result;
}

app.post("/figuresapp2",jsonParser, async function (req, res) {

  console.log("Q");
  console.log("U",req.body); // {user:username} //PK UNDEFINED ??
  console.log("U",req.body.user);
  //printAllUserFigures(req.body[0].user);
  userfigures = await queryFigure(req.body.user);

  console.log("ifg data");
  console.log({data:userfigures});

  res.send({data:userfigures});
})














//TEST GET FIGURE
async function printAllUserFigures(username){
  console.log("PrintAllUserFigures : ");
  try {
    const c = await collection.find(); //{user : "MARIE"}
    while (await c.hasNext()){
      const result = await c.next(); //await collection.findOne(doc);

      //console.log("re user",result.figure[0].user);
      //console.log("user",username);

      if(result.figure[0].user == username)
      {
        console.log(`Figure user: ${result.figure[0].user}, form:${result.figure[0].form} 
        , bgCol:${result.figure[0].bgCol} 
        , borderCol:${result.figure[0].borderCol} 
        , figPx:${result.figure[0].figPx} `);
      }
      else{
        console.log("not our actual user figure ");
      }
        
    }
    
  }
  catch(error){
    console.log(error);
  }
}

//PRINT FIGURES
async function printAllfigures(){
  console.log("PrintALL : ");
  try {
    const c = await collection.find();
    while (await c.hasNext()){
      const result = await c.next(); //await collection.findOne(doc);
      console.log(`Figure user: ${result.figure[0].user}, form:${result.figure[0].form} 
      , bgCol:${result.figure[0].bgCol} 
      , borderCol:${result.figure[0].borderCol} 
      , figPx:${result.figure[0].figPx} `);
    }
  }
  catch(error){
    console.log(error);
  }
}

/*
async function insertFigure(fig,user){

  try {
    console.log("insert :  ");
    //const fig = req.body;
    const doc = {figure: fig, user:user};

    if(fig[0].form != '' && req.body[0].user != ''){
      const result = await collection.insertOne(doc);
      console.log(`Document id: ${result.insertedId}`);

    }
    else{
      console.log('No shape in here !');
    }
  
  }
  catch(error){
    console.log(error);
  }
  
}*/


//COMMENTAIRES / TESTES
/*
async function addFigures(uri, figures) {
  try {
    console.log("add :  ");
    const result = await collection.insertOne(figures);
    console.log(`Document id: ${result.insertedId}`);
  }
  catch(error){
    console.log(error);
  }
}*/


/*
async function startServer(){
  //const db = await MongoClient.connect(url);
  //console.log("db : ",db);

  try {
    await client.connect();


MongoClient.connect(url, function(err, client){
    console.log("Connected successfully");
    db = client.db(DATABASE_NAME);
    collection = db.collection('figure');
})

    //const dbFigures = client.db(DATABASE_NAME);
    //const collection = dbFigures.collection('allfigures');

    //const dbFigures = client.db('mydrawing');
    //const collection = dbFigures.collection('allfigures');
    
    console.log("connection to Mongo successfull ! ");

  }
  catch(error){
    console.log(error);
  }

  //création de ma collection allfigures
  //contiendra plusieurs doc : les docs json
  //collection = db.collection('allFigures');

  //await app.listen(3000);
  //console.log("connection to Mongo successfull on 3000");


}
startServer();*/


// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});*/

//MAXIME
/*const DB_URI = "mongodb://localhost:27017/?readPreference=primary&ssl=false";

const client = new MongoClient(DB_URI);


async function addFigures(uri, figures) {
  try {
    await client.connect();

    const db = client.db('webappdb');
    const coll = db.collection('figures');

    const result = await coll.insertMany(figures);
    console.log(`Inserted ${result.insertedCount} figures.`);
  }
  finally {
    await client.close();
  }
}

*/

///LUCIE
/*
MongoClient.connect(url, function(err, client){
    console.log("Connected successfully");
    db = client.db(DATABASE_NAME);
    collection = db.collection('figure');
})
async function insertFigure(req, res){
  const fig = req.body;
  const doc = {
      fig: fig
  };
  const result = await collection.insertOne(doc);
  console.log(`Document id: ${result.insertedId}`);
}*/

//then(onResponse).then(onTextReady);

