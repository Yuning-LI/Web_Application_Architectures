console.log('in server.js1111111')

const express = require('express')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

const app = express()
const port = 80

const DATABASE_NAME = 'FiguresDB'
const MONGO_URL = `mongodb://mongows:27017/${DATABASE_NAME}`

let client = new mongodb.MongoClient(MONGO_URL)

client.connect().then(client => {
  db = client.db(DATABASE_NAME)
}).catch(err => {
  console.log(err)
})

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.post('/get_figures', (req, res) => {
  user = req.body.user
  console.log(user)
  db.collection('figures').find({user: user}).toArray(function (err, result){
    if(err) throw err
    res.send(result)
  })
})

app.post('/submit_figure', (req, res) => {
    //Add to mongo db
  db.collection('figures').insertOne(req.body, function(err, res){
    if(err) throw err
    console.log('1 Document inserted')
  })
  res.status(200).json({
    message: 'OK'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

