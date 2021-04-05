const canvas = document.getElementById('canvas')

// initiating 2D context on it
const c = canvas.getContext('2d')

let storedFigures = []

addEventListener('load', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
    var loadedFigure = JSON.parse(localStorage.getItem('Fig')) || null;
    if(loadedFigure){
        for(let i = 0; i < loadedFigure.length; i++){
            if(loadedFigure[i].forme == 'triangle'){
                drawTriangle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor)
            }
            else if(loadedFigure[i].forme == 'square'){
                drawSquare(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor)
            }
            else if(loadedFigure[i].forme == 'circle'){
                drawCircle(loadedFigure[i].figSize, loadedFigure[i].borderSize, loadedFigure[i].start, loadedFigure[i].borderColor, loadedFigure[i].backgroundColor)
            }
            localStorage.setItem('Fig', JSON.stringify(storedFigures));
        }        
    }
})


addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight
})

function clearStorage(){
    localStorage.setItem('Fig', JSON.stringify([]))
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
    localStorage.setItem('Fig', JSON.stringify(storedFigures));
}

function drawTriangle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value){
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
        forme: 'triangle',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }

    storedFigures.push(triangle)
    sendData(triangle)
}

function drawSquare(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value){
    c.rect(start[0], start[1], figSize, figSize)

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

    let square = {
        forme: 'square',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }
    
    storedFigures.push(square)
    sendData(square)
}

function drawCircle(figSize = parseInt(document.getElementById('figure_size').value), borderSize = parseInt(document.getElementById('border_thickness').value), start = getStartingPoint(figSize, borderSize), border_color = document.getElementById('div_border').value, background_color = document.getElementById('canvas_background').value){
    c.beginPath()
    c.arc(start[0], start[1], figSize/2, 0, Math.PI * 2)
    c.closePath()

    c.lineWidth = borderSize
    c.strokeStyle = border_color
    c.stroke()

    c.fillStyle = background_color
    c.fill()

    let circle = {
        forme: 'circle',
        figSize: figSize,
        borderSize: borderSize,
        start: getStartingPoint(figSize, borderSize),
        borderColor: border_color,
        backgroundColor: background_color
    }

    storedFigures.push(circle)
    sendData(circle)
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