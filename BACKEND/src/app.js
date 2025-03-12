import express from "express";
import  {createServer} from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";

import cors from "cors";

import { connectToSocket } from "./controllers/socketManagers.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const server = createServer(app); 
//This line creates an HTTP server and attaches the Express app to it.
//Express alone can handle HTTP requests, but WebSockets require a lower-level HTTP server.

const io = connectToSocket(server); 
//This line initializes a new Socket.io server instance and attaches it to the HTTP server.

app.use(cors());
app.use(express.json({limit:"40kb"}));
app.use(express.urlencoded({limit:"40kb",extended:true}));
app.set("port", (process.env.PORT || 8000));


app.get("/home",(req,res)=>{
    res.json({"hello" : "world"});
})

const start = async ()=>{
    const connectionDB = await mongoose.connect(process.env.DB_URI);
    console.log(`connection done to ${connectionDB.connection.host}`);
    server.listen(app.get("port"),()=>{
        console.log("server started");
    })
}
start();