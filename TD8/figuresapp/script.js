//const { json } = require("body-parser");
document.getElementById("btn1").disabled = true;
document.getElementById("btn2").disabled = true;

var socket = io();


let figures=[];
var allFigs = localStorage.getItem("figures");
var parsedFigs = JSON.parse(allFigs);
let wholeCanvas = [];
var username = document.getElementById('username').value.toUpperCase();

console.log("allFigs");
console.log(allFigs); //parsedFigs[i].figSize

//FROM LOCAL STORAGE
/*
window.onload = function() {

for(let i = 0; i < parsedFigs.length; i++){
  console.log("RESTOR");
  
  console.log(parsedFigs[i]);
  
  var form = parsedFigs[i][0];
  var borderPx = parsedFigs[i][3];
  var figPx = parsedFigs[i][2];
  var bgCol = parsedFigs[i][1];
  var borderCol = parsedFigs[i][4];

  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = borderPx; // ???pk change la larger des anciennes formes ?
  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Random start
  startY = parsedFigs[i][6];
  startX = parsedFigs[i][5];

  //Drawing
  //Nouvelles formes avec nv paramètre
  ctx.beginPath();

  if (form == "Circle")
  {
    ctx.arc(startX,  startY , 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  if (form == "Square")
  {
    //ctx.moveTo(startX, startY);
    //remplis le fond 
    //ctx.fillRect(startX, startY, figPx, figPx);
    //replis le tour/fait la bordure
    //ctx.strokeRect(startX, startX, figPx, figPx);

    ctx.moveTo(startX+20, startY);
    ctx.lineTo(startX, startY+20);
    ctx.lineTo(startX-20, startY);
    ctx.lineTo(startX, startY-20);
    ctx.lineTo(startX+20, startY);
    ctx.fill();
    ctx.stroke();
  }

  if (form == "Triangle")
  {

    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+20, startY);
    ctx.lineTo(startX-10, startY+20);
    ctx.lineTo(startX, startY);
    ctx.stroke();
    ctx.fill();
  }
  
  wholeCanvas.push([form, bgCol,figPx,borderPx,borderCol,startX,startY]); // figure])
  //console.log(figures);
  console.log(wholeCanvas);
  localStorage.setItem("figures", JSON.stringify(wholeCanvas));


}

}
*/



//DRAW FORM

function startDraw(){
  
  //console.log("1");
  
  var form = document.getElementById('form').value;
  var borderPx = document.getElementById('px').value;
  var figPx = document.getElementById('size').value; //A utiliser...
  console.log(figPx);
  var bgCol = document.getElementById('btn2').value;
  var borderCol = document.getElementById('btn3').value;

  console.log("the border px",borderPx);
  
  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  
  if(figPx == "") //if no selected by the user
  {
    figPx=2;
  }
  else{
    figPx = parseInt(figPx);
  }

  if(borderPx == "") //no selected by the user
  {
    borderPx=2;
  }
  else{
    borderPx = parseInt(borderPx);
  }


  ctx.lineWidth = borderPx; 

  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Random start
  startY = getRandomInt(100);
  startX = getRandomInt(200);
    
  //Drawing
  console.log("2");
  
  //Nouvelles formes avec nv paramètre
  ctx.beginPath();
  
  if (form == "Circle")
  {
    ctx.arc(startX,  startY , 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  if (form == "Square")
  {
    //ctx.moveTo(startX, startY);
    //remplis le fond 
    //ctx.fillRect(startX, startY, figPx, figPx);
    //replis le tour/fait la bordure
    //ctx.strokeRect(startX, startX, figPx, figPx);
    
    ctx.moveTo(startX+20, startY);
    ctx.lineTo(startX, startY+20);
    ctx.lineTo(startX-20, startY);
    ctx.lineTo(startX, startY-20);
    ctx.lineTo(startX+20, startY);
    ctx.fill();
    ctx.stroke();
  }

  if (form == "Triangle")
  {
    
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+20, startY);
    ctx.lineTo(startX-10, startY+20);
    ctx.lineTo(startX, startY);
    ctx.stroke();
    ctx.fill();
  }
  

  //SAVING
  wholeCanvas.push([form, bgCol,figPx,borderPx,borderCol,startX,startY]); // figure])
  localStorage.setItem("figures", JSON.stringify(wholeCanvas));
  const data ={"form":form, "bgCol":bgCol,"figPx":figPx,"borderPx":borderPx,
  "borderCol":borderCol,"startX":startX,"startY":startY};
  

  //TD8 

 

  console.log('FIGURE', data);
  console.log('USER', username);

  socket.emit('FIGURE', data);
  socket.emit('USER', username);


  /*
  const mydoc = {data: data, user:username};
  console.log("mydoc",mydoc);

  const fetchOptions = {
    method : 'POST',
    headers : {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    body : JSON.stringify(mydoc)//jsonFigure)
  };
  fetch('/figuresapp3', fetchOptions).then(onResponse).then(onTextReady);

  */
  
  
  //document.getElementById('result').innerHTML = JSON.stringify(jsonFigure); 
}

socket.on('figure', function(msg) {
  console.log("recu",msg);
  drawShape(msg);
});

function drawShape(Fig)
{
  var form = Fig.form;
  var borderPx = Fig.borderPx
  var figPx = Fig.figPx ;
  var bgCol = Fig.bgCol;
  var borderCol = Fig.borderCol;
  startY = Fig.startY;
  startX = Fig.startX;

  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  ctx.lineWidth = borderPx; 
  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Drawing
  //Nouvelles formes avec nv paramètre
  ctx.beginPath();

  if(figPx == "") //if no selected by the user
  {
    figPx=2;
  }
  else{
    figPx = parseInt(figPx);
  }

  if(borderPx == "") //no selected by the user
  {
    borderPx=2;
  }
  else{
    borderPx = parseInt(borderPx);
  }
  ctx.lineWidth = borderPx; 
  ctx.fillStyle = bgCol;
  ctx.strokeStyle = borderCol;

  //Random start
  startY = getRandomInt(100);
  startX = getRandomInt(200);
    
  //Drawing
  console.log("2");
  
  //Nouvelles formes avec nv paramètre
  ctx.beginPath();
  
  if (form == "Circle")
  {
    ctx.arc(startX,  startY , 20, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
  }

  if (form == "Square")
  {
    ctx.moveTo(startX+20, startY);
    ctx.lineTo(startX, startY+20);
    ctx.lineTo(startX-20, startY);
    ctx.lineTo(startX, startY-20);
    ctx.lineTo(startX+20, startY);
    ctx.fill();
    ctx.stroke();
  }

  if (form == "Triangle")
  {
    
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+20, startY);
    ctx.lineTo(startX-10, startY+20);
    ctx.lineTo(startX, startY);
    ctx.stroke();
    ctx.fill();
  }

}  

function onTextReady(json) {
  //var json = JSON.parse(json);
  console.log(json);
}


function onResponse(response) {
  return response.json();
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function login(){

  console.log("log");
  username = document.getElementById('username').value.toUpperCase();
  console.log(username);

  document.getElementById("btn1").disabled = false;
  document.getElementById('user').innerHTML = "<p> Account of : "+username+"</p>";
  //document.getElementById("btn2").disabled = false;
  //username = document.getElementById('user').value;
  //console.log("user: ", username);  

  //RESTOR 
  //const username = "";
  console.log("user: ", username); //name

}

/*
  const queryFigures = async (name) =>{
    const doc = {user:name}
    return fetch(`/figuresapp2`,{body: JSON.stringify(doc) ,method: "POST", headers: {"Content-type": "application/json; charset=UTF-8"}})
    .then(function(result) {
        return result.json();
    }).then(function(json) {
        return(json.data);
    }).catch(err => console.log(err))
    ;
}*/


async function queryFigures(username){

  const myjsonUser = {user:username};

  console.log("myjsonrestore",myjsonUser);
  console.log(JSON.stringify(myjsonUser));

  const fetchOp = {
    body : JSON.stringify(myjsonUser), //jsonFigure)
    method : 'POST',
    headers : {
      'Content-Type':'application/json; charset=UTF-8'
    }    
  };
  console.log(fetchOp);

  return fetch('/figuresapp2', fetchOp).then(function(result) {
            //console.log("resulte",result.json()); //pending
            return result.json();})
           .then(function(json){
            console.log("jsondata",json.data); 
            return(json.data)});


}


function restorShape(){

  console.log("restorShape");
  //username = document.getElementById('username').value.toUpperCase();
  console.log(username);
  //Nos mongo for TD8
  //readData(username);

}

async function readData(username){

  console.log("readata");
  console.log(username);

  const objects = await queryFigures(username);

  //allFigs = localStorage.getItem("figures");
  //parsedFigs = JSON.parse(allFigs);
  //wholeCanvas.push([form, bgCol,figPx,borderPx,borderCol,startX,startY]); // figure])
  //localStorage.setItem("figures", JSON.stringify(wholeCanvas));

  /*
  for(const object of objects){
      wholeCanvas.push(object);
  }
  console.log(objects);
  console.log(wholeCanvas);*/

  console.log("RESTOR object : ",objects);

  for(const Fig of objects){
    console.log("RESTOR ob",Fig);
    drawShape(Fig);
  }

}



/*
  //FROM MONGO
  const fetchOptions = {
    method : 'GET',
    headers : {
      'Accept':'application/json',
      'Content-Type':'application/json'
    },
    username
  };
  fetch('/figuresapp', fetchOptions).then(Response)

  
    console.log("RESTOR MONGO");
    
    var form = result.figure[0].form;
    var borderPx = result.figure[0].borderPx;
    var figPx = result.figure[0].figPx;
    var bgCol = presult.figure[0].bgCol;
    var borderCol = result.figure[0].borderCol;
    var user = result.figure[0].user;
  
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
  
    ctx.lineWidth = borderPx; // ???pk change la larger des anciennes formes ?
    ctx.fillStyle = bgCol;
    ctx.strokeStyle = borderCol;
  
    //Random start
    startY = parsedFigs[i][6];
    startX = parsedFigs[i][5];
  
    //Drawing
    //Nouvelles formes avec nv paramètre
    ctx.beginPath();
  
    if (form == "Circle")
    {
      ctx.arc(startX,  startY , 20, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
    }
  
    if (form == "Square")
    {
      ctx.moveTo(startX+20, startY);
      ctx.lineTo(startX, startY+20);
      ctx.lineTo(startX-20, startY);
      ctx.lineTo(startX, startY-20);
      ctx.lineTo(startX+20, startY);
      ctx.fill();
      ctx.stroke();
    }
  
    if (form == "Triangle")
    {
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX+20, startY);
      ctx.lineTo(startX-10, startY+20);
      ctx.lineTo(startX, startY);
      ctx.stroke();
      ctx.fill();
    } 
  
    */




/*
function database(){

  const fetchOptions = {
    method : 'GET',
    headers : {
      'Accept':'application/json',
      'Content-Type':'application/json'
    }
  };
  fetch('/figuresapp', fetchOptions).then(onResponse).then(onTextReady);


}*/

/*
function Response(response) {
  //return response.json();
  try {
    const c = await collection.find();
    while (await c.hasNext()){
      const result = await c.next(); //await collection.findOne(doc);

      //console.log("re user",result.figure[0].user);
      //console.log("user",username);

      if(result.figure[0].user == username)
      {
        console.log(`Figure user: ${result.figure[0].user}, form:${result.figure[0].form} 
        , bgCol:${result.figure[0].bgCol} 
        , borderCol:${result.figure[0].borderCol} 
        , figPx:${result.figure[0].figPx}
        ,borderPx:${result.figure[0].borderPx}
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
*/

