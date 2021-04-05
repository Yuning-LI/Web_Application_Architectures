const canvas = document.getElementById('canvas')

// initiating 2D context on it
const c = canvas.getContext('2d')

let storedFigures = []
let username = ''

function registerUser(){
    c.clearRect(0, 0, canvas.width, canvas.height)
    let input = document.getElementById('username_field')
    let draw_btn = document.getElementById('draw')
    let user_message = document.getElementById('user_message')
    if(input.value.length >= 6){
        
        //Unlock draw button
        if(draw_btn.disabled == true){ draw_btn.disabled = false}
        username = input.value
        user_message.innerHTML = `You are now logged in as : <b>${username}</b>`
        redraw()
    }
    else{
        if(draw_btn.disabled == false){ draw_btn.disabled = true }
        username = input.value
        user_message.innerHTML = `You are no longer registered. Register to be able to see your drawings`
        redraw()
    }
}

addEventListener('load', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    let input = document.getElementById('username_field')
    input.value = ''
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    redraw()
})

function redraw(){
    getData().then((loadedFigure) => {
        console.log(loadedFigure)
        if(loadedFigure){
            for(let i = 0; i < loadedFigure.length; i++){
                if(loadedFigure[i].forme == 'triangle'){
                    drawTriangle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
                else if(loadedFigure[i].forme == 'square'){
                    drawSquare(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
                else if(loadedFigure[i].forme == 'circle'){
                    drawCircle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor, false)
                }
            }        
        }        
    })
}

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
    //localStorage.setItem('Fig', JSON.stringify(storedFigures));
}

function drawTriangle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, new_fig = true){
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
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(triangle)
    }
}

function drawSquare(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, new_fig = true){
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
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(square)        
    }
}

function drawCircle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value, new_fig = true){
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
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    if(new_fig){
        sendData(circle)        
    }
    
}

function getStartingPoint(figSize, borderSize){
    let x = (Math.random()*(innerWidth - figSize - borderSize)) + borderSize
    let y = (Math.random()*(innerHeight - figSize - borderSize)) + borderSize
    return [x,y]
}

function sendData(data){
    fetch('http://localhost:80/submit_figure', 
    {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(data)
    })
}

function getData(){
    return new Promise((resolve, reject) => {
        fetch('http://localhost:80/get_figures',
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({user: username})
        }).then(res => {
            return res.json()
        }).then(data => {
            resolve(data)
        }).catch(err => {
            reject(err)
        })     
    })
}