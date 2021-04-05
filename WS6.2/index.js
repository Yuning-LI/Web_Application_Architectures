const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 80

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/submit_figure', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

