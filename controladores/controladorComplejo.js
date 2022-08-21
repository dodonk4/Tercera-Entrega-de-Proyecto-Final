import http from 'http';
import Mensajeria from '../public/contenedores/mensajes.js';
import { usuariosDao } from '../daos/index.js';
import { productosDao } from '../daos/index.js';
import util from 'util';
import path from 'path';
import os from 'os';
import log4js from 'log4js';
import {configuracion, loggerConsola} from '../log4js/log4.js';
import {puerto} from '../minimist/minimist.js';
import { sender2 } from '../nodemailer/send.mjs';
import {senderWpp, senderWppToClient} from '../twilio/indexWpp.mjs';
configuracion();
import {fileURLToPath} from 'url';
import { abort } from 'process';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let a = 0;


const tenerA = async ()=>{ return a };
const mensajeriaANormalizar = new Mensajeria('./public/texto/mensajesANormalizar.txt');

const controladorComplejo = {
    getInicio: async (req, res)=>{
        loggerConsola.info(`localhost:${puerto}/inicio`)
        loggerConsola.info(`Metodo: GET`);
        if (req.session.passport) {
            let productos = await productosDao.getAll();
            console.log(await productos);
            let mensajes = await mensajeriaANormalizar.obtenerTodos();
            res.render('logueado', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.session.passport.user.nombre});
        } else {
            res.render('redireccion');
        }
    },
    postInicio: async (req, res)=>{
        loggerConsola.info(`localhost:${puerto}/inicio`);
        loggerConsola.info(`Metodo: POST`);
        req.session.user = req.body.nombre;
        req.session.password = req.body.contraseña;
        req.session.cookie.maxAge = 60000;
        let productos = await productosDao.getAll();
        console.log(await productos);
        let mensajes = await mensajeriaANormalizar.obtenerTodos();
        res.render('logueado', { titulo: 'PRODUCTO', titulo2: 'PRECIO', titulo3: 'THUMBNAIL', productos, mensajes, nombre: req.session.passport.user.nombre});
    
    },
    getInfo: async (req, res)=>{
            loggerConsola.info(`localhost:${puerto}/info`)
            loggerConsola.info(`Metodo: GET`);
            function print(objeto) {
                return util.inspect(objeto, true, 0, false);
              }
            let cosa = Object.entries(process.memoryUsage());
            let cosa2 = JSON.stringify(cosa[0]);
            let newCosa = cosa2.replace('"rss",', '').replace('[', '').replace(']', '');
            res.send(`Path de ejecución: ${path.join(__dirname, '/server.js')}<br>
            Carpeta del proyecto: ${process.cwd()}<br>
            Process ID: ${process.pid}<br>
            Version de Node.js: ${process.version}<br>
            Título del proceso: ${process.title}<br>
            Sistema operativo: ${process.platform}<br>
            Memoria reservada: ${newCosa}<br>
            Argumentos de Entrada: ${process.argv.slice(2)}<br>
            Numero de procesadores: ${os.cpus().length}`);
            
        },
    postCarrito: async (req, res)=>{
            if (req.session.passport) {
                a = req.session.passport.user.nombre;        
                console.log(req.session.passport);
                let arrayCantidad = req.body.cantidad;
                await usuariosDao.changeCantidad(arrayCantidad, a)
                console.log(arrayCantidad);
                res.render('carrito', { layout: 'otro', nombre: req.session.passport.user.nombre, cantidad0: arrayCantidad[0], cantidad1: arrayCantidad[1], cantidad2: arrayCantidad[2], cantidad3: arrayCantidad[3], cantidad4: arrayCantidad[4],  cantidad5: arrayCantidad[5], maximum0: req.body.stock[0], maximum1: req.body.stock[1], maximum2: req.body.stock[2], maximum3: req.body.stock[3], maximum4: req.body.stock[4], maximum5: req.body.stock[5]});
            } else {
                res.render('redireccion');
            }
        },
    postCarritoDone: async (req, res)=>{
            let arrayCantidad = req.body.cantidad;
            await usuariosDao.changeCantidad(arrayCantidad, a)
            console.log(req.session.passport);
            console.log(a);
            await sender2(a);
            await senderWpp(a);
            await senderWppToClient(a);
            res.render('carritoDone');
        },
    getCarritoDone: async (req, res)=>{
            console.log(a);
            if (a != 0){
                res.render('carritoDone');
            }else{
                res.render('redireccion');
            }
        },
    getCarrito: async (req, res) => {
            if(a != 0){
                let cantidades = await usuariosDao.getCantidad(a);
                let productos = await productosDao.getAll();
                res.render('carrito', { layout: 'otro', nombre: a, cantidad0: cantidades[0], cantidad1: cantidades[1], cantidad2: cantidades[2], cantidad3: cantidades[3], cantidad4: cantidades[4],  cantidad5: cantidades[5], maximum0: productos[0].stock, maximum1: productos[1].stock, maximum2: productos[2].stock, maximum3: productos[3].stock, maximum4: productos[4].stock, maximum5: productos[5].stock});//Y ACÁ SE LE PONDRÍAN LAS CANTIDADES EN EL RENDER CON UN getCantidad() EN EL contenedorMongoDB
            }else{
                res.render('registrado');
            }
        },
    getAll: async (req, res) => {
            res.json(await usuariosDao.getAll());
        },
    getLogout: async (req,res)=>{
            a = 0;
            loggerConsola.info(`localhost:${puerto}/logout`);
            loggerConsola.info(`Metodo: GET`);
                req.session.destroy(err => {
                    if (err) {
                    res.json({ status: 'Logout ERROR', body: err })
                    } else {
                    res.render('logout')
                    }
                })
            }
    }
    


export default controladorComplejo;