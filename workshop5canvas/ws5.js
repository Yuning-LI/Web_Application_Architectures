var shapePicker = document.getElementById('shapePicker');
var bgcolorPicker = document.getElementById('bgcolorPicker');
var bordercolorPicker = document.getElementById('bordercolorPicker');
var borderthicknessPicker = document.getElementById('borderthicknessPicker');
var figuresizePicker = document.getElementById('figuresizePicker');
var displayButton = document.getElementById('displayButton');
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function drawSquare(startX, startY, width){
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+100, startY);
    ctx.lineTo(startX+100,startY+100);
    ctx.lineTo(startX,startY+100);
    ctx.lineTo(startX,startY);
    ctx.stroke();
}

function drawCircle(startX, startY, radius){
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, 2*Math.PI);
    ctx.stroke();
}

function drawTriangle(startX, startY, width){
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX+width/2, startY+width*Math.sqrt(3)/2);
    ctx.lineTo(startX-width/2, startY+width*Math.sqrt(3)/2);
    ctx.lineTo(startX,startY);
    ctx.stroke();
}

displayButton.addEventListener('click', function(){
    var randomX = Math.floor(Math.random()*100);
    var randomY = Math.floor(Math.random()*100);
    var drawinginfo = {};
    drawinginfo.shape = shapePicker.value;
    drawinginfo.bgcolor = bgcolorPicker.value;
    drawinginfo.bordercolor = bordercolorPicker.value;
    drawinginfo.borderthickness = borderthicknessPicker.value;
    drawinginfo.figuresize = figuresizePicker.value;

    //console.log(drawinginfo, ctx);
    if (drawinginfo.shape == 'square') {
        var squareWidth = 100;
        drawSquare(randomX, randomY, squareWidth); 
    } else if (drawinginfo.shape == 'triangle') {
        var triangleWidth = 100;
        drawTriangle(randomX, randomY, triangleWidth);
    } else if (drawinginfo.shape == 'circle'){
        var radius = 50;
        drawCircle(randomX, randomY, radius);
    }
    //ctx.fillStyle = drawinginfo.bgcolor;

});


