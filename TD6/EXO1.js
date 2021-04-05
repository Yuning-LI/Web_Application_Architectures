const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
//const fetch = require('node-fetch');
app.use(express.static('TD5'));

app.get('/', function (req, res){
    res.send('Main page');
});

app.post('/getfigure', jsonParser, function (req, res) {
    const body = req.body;
    console.log(body);
});

app.listen(3000,function(){
    console.log('Example app listening on port ..')
})


