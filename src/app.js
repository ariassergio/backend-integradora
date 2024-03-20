import express from 'express';
import __dirname from './utils.js';
import handlebars from 'express-handlebars'
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const connection = mongoose.connect("mongodb+srv://sergioariaaas:W3tbatNjWzAXr2cx@cluster0.qh2nnui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
 

const app = express();
const PORT = process.env.PORT || 8080

//Middlewares

app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname+'/public'))
app.engine('handlebars', handlebars.engine())

const server = app.listen(PORT, ()=>console.log("Servidor corriendo en puerto", PORT))
const io = new Server (server)
