import express from "express";
import  {createServer} from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";

import cors from "cors";

import { connectToSocket } from "./controllers/socketManagers.js";

const app = express();

const server = createServer(app); 
//This line creates an HTTP server and attaches the Express app to it.
//Express alone can handle HTTP requests, but WebSockets require a lower-level HTTP server.

const io = connectToSocket(server); 
//This line initializes a new Socket.io server instance and attaches it to the HTTP server.


app.set("port", (process.env.PORT || 8000));


app.get("/home",(req,res)=>{
    res.json({"hello" : "world"});
})

const start = async ()=>{
    const connectionDB = await mongoose.connect("mongodb+srv://varunProject:h1f4fr223@varunprojectcluster.8hjoo.mongodb.net/");
    console.log(`connection done to ${connectionDB.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("server started");
    })
}
start();