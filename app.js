 const express = require("express");//library access
 const socket = require("socket.io");

 const app = express(); //initialize express and server ready

 
 app.use(express.static("public")); 

 let port = process.env.PORT || 3000;
 let server = app.listen(port, () => {
     console.log("listening to port " + port); 
 })

 let io = socket(server);//yaha pe apne server ka connection ban jayega!

 io.on("connection", (socket) => { //jab bhi io connect hoga toh yeh callback function chalega!
     console.log("socket connection established");
        //received data
     socket.on("beginPath", (data) => {
         //data from frontend
        //now transfer data to all connected clients
        io.sockets.emit("beginPath", data);
     })

     socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
     })

     socket.on("redoUndo", (data) => {
        io.sockets.emit("redoUndo", data);
     })
 })