const BASE_URL = 'http://localhost:3000/'

const canvas = document.getElementById('canvas')

// initiating 2D context on it
const c = canvas.getContext('2d')

var socket = io();

let input_ = document.getElementById('username_field')
let username = ''
let isDrawing = false;
let x=0;
let y=0;

//Register function 
function registerUser(){
    c.clearRect(0, 0, canvas.width, canvas.height)
    let input = document.getElementById('username_field')
    let draw_btn = document.getElementById('draw')
    let save_btn = document.getElementById('toimg')
    let user_message = document.getElementById('user_message')
    if(input.value.length >= 3){
        //Unlock draw button
        if(draw_btn.disabled == true){ draw_btn.disabled = false}
        if(save_btn.disabled == true){ save_btn.disabled = false}
        username = input.value
        user_message.innerHTML = `You are now logged in as : <b>${username}</b>`
    }
    else{
        if(draw_btn.disabled == false){ draw_btn.disabled = true }
        if(save_btn.disabled == false){ save_btn.disabled = true }
        username = input.value
        user_message.innerHTML = `You are currently not registered. Register to be able to draw and save your boards<br><span style="color:red;">Should be more than 2 characters</span>`
    }
}

function isUserRegistered(){
    return username != ''
}

//EVENT

//App loader
addEventListener('load', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    let draw_btn = document.getElementById('draw')
    let save_btn = document.getElementById('toimg')
    let input = document.getElementById('username_field')
    input.value = ''
    save_btn.disabled = true
    draw_btn.disabled = true
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

input_.addEventListener('keyup', (e) => {
    if (e.code === "Enter") {
        document.getElementById("submit_username").click();
    }
})

//Mouse drawing events

canvas.addEventListener('mousedown', function(e) {
    if(username != ''){
        const rect = canvas.getBoundingClientRect()
        x = e.clientX - rect.left
        y = e.clientY - rect.top
        console.log("x: " + x + " y: " + y)
        //Modify last drawer message
        let last_drawer = document.getElementById('last_drawer')
        let user_message = document.getElementById('user_message')
        user_message.innerHTML = `You are now logged in as : <b>${username}</b>`
        last_drawer.innerHTML = `The last drawer is <b>YOU</b>`

        isDrawing=true        
    }
    else{
        let user_message = document.getElementById('user_message')
        user_message.innerHTML = `<span style="color:red;">You must be registered to perform this action !</span>`
    }

})

canvas.addEventListener('mousemove', e => {
    if (isDrawing === true) {
      //drawCircleAtCursor(x,y,canvas, e)
      drawLine(x, y, e.offsetX, e.offsetY);
      sendLine({user: username, x: x, y: y, x2: e.offsetX, y2: e.offsetY, pencil_color: document.getElementById('pencil_color').value, pencil_size: parseInt(document.getElementById('pencil_size').value)})
      x = e.offsetX;
      y = e.offsetY;
    }
});

window.addEventListener('mouseup', e => {
    if (isDrawing === true) {
      //drawCircleAtCursor(x,y,canvas, e)
      drawLine(x, y, e.offsetX, e.offsetY);
      x = 0;
      y = 0;
      isDrawing = false;
    }
});

//FIGURE

//Basic endpoint to the draw button and will use controllbar value
function draw(){
    let forme = document.getElementById('form').value
    if(forme == 'triangle'){
        drawTriangle()
    }
    else if(forme == 'square'){
        drawSquare()
    }
    else if(forme == 'circle'){
        drawCircle()
    }
}

//Draw triangle based on control panel or passed input

function drawTriangle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true){
    c.beginPath()
    c.moveTo(start[0], start[1])
    c.lineTo(start[0], start[1]+figSize)
    c.lineTo(start[0]+figSize, start[1]+figSize)
    c.closePath()

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

    let triangle = {
        user: username,
        forme: 'triangle',
        figSize: figSize,
        borderSize: borderSize,
        start: start,
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(own_figure){
        sendData(triangle)
    }
}

//Draw square based on control panel or passed input

function drawSquare(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true){
    c.rect(start[0], start[1], figSize, figSize)

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

    let square = {
        user: username,
        forme: 'square',
        figSize: figSize,
        borderSize: borderSize,
        start: start,
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(own_figure){
        sendData(square)        
    }
}

//Draw circle based on control panel or passed input

function drawCircle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, own_figure = true){
    c.beginPath()
    c.arc(start[0], start[1], figSize/2, 0, Math.PI * 2)
    c.closePath()

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

    let circle = {
        user: username,
        forme: 'circle',
        figSize: figSize,
        borderSize: borderSize,
        start: start,
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(own_figure){
        sendData(circle)        
    }
    
}

//Generate starting point in order to not get in the wall

function getStartingPoint(figSize, borderSize){
    let x = (Math.random()*(innerWidth - figSize - borderSize)) + borderSize
    let y = (Math.random()*(innerHeight - figSize - borderSize)) + borderSize
    return [x,y]
}

//LINE

function drawLine(x1, y1, x2, y2, pencil_color = document.getElementById('pencil_color').value, pencil_size = parseInt(document.getElementById('pencil_size').value)) {
// using a line between actual point and the last one solves the problem
// if you make very fast circles, you will see polygons.
// we could make arcs instead of lines to smooth the angles and solve the problem
  c.beginPath();
  c.strokeStyle = pencil_color;
  c.lineWidth = pencil_size;
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.stroke();
  c.closePath();
}

// IMAGE

function toImg(){
    sendImage(canvas.toDataURL())
    let user_message = document.getElementById('user_message')
    user_message.innerHTML = `<span style="color:green;">Image save to the gallery !</span>`
}

// NETWORK

function sendImage(image){
    let payload = {
        author: username,
        timestamp: Date.now(),
        image: image
    }
    fetch(BASE_URL + 'save_image', 
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(payload)
    })
}

function sendData(data){
    socket.emit('send_figure', data)
}

function sendLine(data){
    socket.emit('send_line', data)
}

socket.on('share_figure', (figure) => {
    if(figure.forme == 'triangle'){
        drawTriangle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
    }
    else if(figure.forme == 'square'){
        drawSquare(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
    }
    else if(figure.forme == 'circle'){
        drawCircle(figure.figSize, figure.borderSize, figure.start, figure.borderColor, figure.backgroundColor, false)
    }
})

socket.on('share_line', (line) => {
    let last_drawer = document.getElementById('last_drawer')
    last_drawer.innerHTML = `The last drawer is <b>${line.user}</b>`
    drawLine(line.x, line.y, line.x2, line.y2, line.pencil_color, line.pencil_size)
})