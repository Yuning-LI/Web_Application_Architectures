const express = require('express')
const app = express()

const port = process.env.PORT || 3000 
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const fs = require('fs')

require('dotenv').config()

//For the mongodb connexion I will use mongo db atlas which is free cloud cluster provided by the mongodb project.
//Of course the connection string include the password so it stored in .env file 
const mongodb = require('mongodb')
const MONGO_URL = process.env.MONGO_DB_CONNECTION_STRING

let client = new mongodb.MongoClient(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })

client.connect().then(client => {
  db = client.db()
}).catch(err => {
  console.log(err)
})

app.use(express.json())
app.use(express.static('public'))

//Socket part

//I listen for socket connection
io.on('connect', (socket) => {
  //Once a user is connected I wait for him to send me figure on the event 'send_figure' or line with the event 'send_line'
  socket.on('send_figure', (figure_specs) => {
    //Here I received the figure specs, all I do is send back the specs to all other client with the event share figure
    socket.broadcast.emit('share_figure', figure_specs)
  })

  socket.on('send_line', (line_specs) => {
    //Here I received the line specs, all I do is send back the specs to all other client with the event share line
    socket.broadcast.emit('share_line', line_specs)
  })
})

//Mongo part

app.post('/save_image', (req, res) => {
  //Save the image on the server
  let savedURI = "public/galerie/images/" + req.body.timestamp + ".png";
  let base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(savedURI, base64Data, 'base64', (err) => {
    if (err) throw err;
  })
  //Tell the static html file where to find the file from root
  req.body.image = "galerie/images/" + req.body.timestamp + ".png";
  //Insert into collection
  db.collection('images').insertOne(req.body, function(err, res){
    if(err) throw err
    console.log('1 Image inserted')
  })
  res.status(200).json({
    message: 'OK'
  })
})

app.post('/get_images', (req, res) => {
  //Find all images sorted by the newest
  db.collection('images').find({}).sort({timestamp: -1}).toArray(function (err, result){
    if(err) throw err
    res.send(result)
  })
})

http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

