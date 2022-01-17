let canvas =  document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 

let pencilKaColor = document.querySelectorAll(".pencil-color");
let pencilKiWidthKaElement = document.querySelector(".pencil-width");
let eraserKiWidthKaElement = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penKaColor = "red";
let eraserKaColor = "white";
let penKiWidth = pencilKiWidthKaElement.value;
let eraserKiWidth = eraserKiWidthKaElement.value;

let undoRedoTracker = []; // store Data 
let track = 0;// represent which action from tracker array


let mousedown = false;
//API
let tool = canvas.getContext("2d");

tool.strokeStyle = penKaColor;
tool.lineWidth = penKiWidth;
    // tool.beginPath();//new graphic (path)(line)
    // tool.moveTo(10, 10);//start point
    // tool.lineTo(100, 150);//end point
    // tool.stroke();//fill color / or fill graphic 

//mousedown -> start new path,
//mousemove -> path fill (graphic)

canvas.addEventListener("mousedown", (e) => {
    mousedown = true;
    // beginPath({
    //     x: e.clientX,
    //     y: e.clientY
    // })
    let data = {
        x: e.clientX,
        y: e.clientY
    }
    //send data to server
    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove", (e) => {
   if (mousedown) {
       let data = {
        x: e.clientX,
        y: e.clientY,
        color: eraserFlag ? eraserKaColor : penKaColor,//eraserFlag true ha toh eraserKaColor ayega warna penKColor ayega
        width: eraserFlag ? eraserKiWidth : penKiWidth,//eraserFlag true ha toh eraserKiWidth ayeggi warna penKiWidth ayeggi 
       }
       socket.emit("drawStroke", data);
   }
//    drawStroke({
//        x: e.clientX,
//        y: e.clientY,
//        color: eraserFlag ? eraserKaColor : penKaColor,//eraserFlag true ha toh eraserKaColor ayega warna penKColor ayega
//        width: eraserFlag ? eraserKiWidth : penKiWidth,//eraserFlag true ha toh eraserKiWidth ayeggi warna penKiWidth ayeggi
//    })
})
canvas.addEventListener("mouseup", (e) => {
    mousedown = false;

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;
})

undo.addEventListener("click", (e) => {
    if(track > 0) track--;
    //track action
    let data = {
        trackValue: track,
         undoRedoTracker
    } 
    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObject);
})

redo.addEventListener("click", (e) => {
    if(track < undoRedoTracker.length-1) track++;
    //track action
    let data = {
        trackValue: track,
         undoRedoTracker
    }
    socket.emit("redoUndo", data);
    // undoRedoCanvas(trackObject);
})

function undoRedoCanvas(trackObject) {
    track = trackObject.trackValue;
    undoRedoTracker = trackObject.undoRedoTracker;

    let url = undoRedoTracker[track];
    let img = new Image();//new image ki reference create hojayegi!
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

}

function beginPath(strokeKaObject) {
    tool.beginPath();
    tool.moveTo(strokeKaObject.x, strokeKaObject.y);
}

function drawStroke(strokeKaObject) {
    tool.strokeStyle = strokeKaObject.color;
    tool.lineWidth = strokeKaObject.width;
    tool.lineTo(strokeKaObject.x, strokeKaObject.y);
    tool.stroke();
}

pencilKaColor.forEach((colorKaElement) => {
    colorKaElement.addEventListener("click", (e) => {
        let color = colorKaElement.classList[0];
        penKaColor = color;
        tool.strokeStyle = penKaColor;
    })
})

pencilKiWidthKaElement.addEventListener("change", (e) => {
    penKiWidth = pencilKiWidthKaElement.value;
    tool.lineWidth = penKiWidth;
})
eraserKiWidthKaElement.addEventListener("change", (e) => {
    eraserKiWidth = eraserKiWidthKaElement.value;
    tool.lineWidth = eraserKiWidth;
})

eraser.addEventListener("click", (e) => {
    if(eraserFlag){
        tool.strokeStyle = eraserKaColor;
        tool.linewidth = eraserKiWidth; 
    }else{
        tool.strokeStyle = penKaColor;
        tool.linewidth = penKiWidth; 
    }
})

download.addEventListener("click", (e)=>{
    let url = canvas.toDataURL();

    let a = document.createElement("a");
    a.href = url;
    a.download = "TKD_board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    //data from server
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    //data from server
    drawStroke(data);
})

socket.on("redoUndo", (data) => {
    //data from server
    undoRedoCanvas(data);
})