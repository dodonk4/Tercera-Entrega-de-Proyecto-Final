import express from 'express';

import http from 'http';

import { Server as serverIO} from 'socket.io';

import Contenedor from '../public/contenedores/productos.js'

import Mensajeria from '../public/contenedores/mensajes.js'

import bodyParser from 'body-parser';

import { engine } from 'express-handlebars';

import flash from 'connect-flash';

import routerUsuariosRegistrados from '../routers/usuariosRegistradosRouter.js';

import mainRouter from '../routers/routerGeneral.js';

import dotenv from 'dotenv';

import {puerto} from '../minimist/minimist.js'

import {setupWorker} from '@socket.io/sticky';

import { createAdapter } from '@socket.io/cluster-adapter';

import log4js from 'log4js';

import autocannon from 'autocannon';

import { PassThrough } from 'stream';

import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';

import Handlebars from 'handlebars';

// const run = (url)=>{
//     const buf = [];
//     const outputStream= new PassThrough();
//     const inst = autocannon({
//         url,
//         connections: 100,
//         duration: 20
//     })
//     autocannon.track(inst, { outputStream })

//     outputStream.on('data', data => buf.push(data))
//     inst.on('done', ()=>{
//         process.stdout.write(Buffer.concat(buf))
//     })
// }

//Eliminar en entrega lo de autocanon




dotenv.config({
    path: './.env'
      
  })


const caja = new Contenedor();
const mensajeriaANormalizar = new Mensajeria('./public/texto/mensajesANormalizar.txt');

const app = express()

app.engine('handlebars', engine({defaultLayout: "index", handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'handlebars');
app.set("views", "./public/views");
app.use(express.json())
app.use(express.static('public'))
app.use(express.urlencoded())
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(routerUsuariosRegistrados);
app.use(mainRouter);
const httpServer = new http.Server(app);
const io = new serverIO(httpServer);

function crearServidor(port) {
    httpServer.listen((process.env.PORT || puerto), () => {
            console.log(`escuchando en puerto ${puerto}`);
        })

        io.on('connection', async (socket)=>{
    
            console.log('Usuario conectado: ' + socket.id);
        
        
            socket.on('prod', async(data)=>{
                caja.insertarProductosIndividuales(data);
                console.log('llego al servidor el socket PRODUCTOS');
                io.sockets.emit('prod', data)
            })
        
            socket.on('mensaje', async(data)=>{
                mensajeriaANormalizar.insertarMensajesIndividuales(data.cosa2);
                console.log('llego al servidor el socket MENSAJES')
                io.sockets.emit('mensaje', data);
        
            })
        
        })
}

function crearServidorCluster(port) {
    console.log(`Worker ${process.pid} started`)
    io.adapter(createAdapter());
    setupWorker(io);

    io.on('connection', async (socket)=>{
    
        console.log('Usuario conectado: ' + socket.id);
    
    
        socket.on('prod', async(data)=>{
            caja.insertarProductosIndividuales(data);
            console.log('llego al servidor el socket PRODUCTOS');
            io.sockets.emit('prod', data)
        })
    
        socket.on('mensaje', async(data)=>{
            mensajeriaANormalizar.insertarMensajesIndividuales(data.cosa2);
            console.log('llego al servidor el socket MENSAJES')
            io.sockets.emit('mensaje', data);
    
        })
    
    })
}



export {crearServidor, crearServidorCluster};