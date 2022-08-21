import dotenv from 'dotenv';
import { usuariosDao } from '../daos/index.js';
import { productosDao } from '../daos/index.js';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import fs from 'fs';


import controladorComplejo from '../controladores/controladorComplejo.js';
dotenv.config({
    path: './.env'
      
  })

const options2 = async (nombre)=> {
    const cantidad = await usuariosDao.getCantidad(nombre);
        const mailOptions2 = {
        from: 'Servidor Node.js',
        to: 'johnathan56@ethereal.email',
        subject: 'Pedido de prueba',
        html: `<h1 style="color: blue;">Pedido de ${nombre}:</h1> <p>Colchon: ${cantidad[0]}<br>Manta: ${cantidad[1]}<br>Computadora: ${cantidad[2]}<br>Auriculares: ${cantidad[3]}<br>Parlantes: ${cantidad[4]}<br>Chromecast: ${cantidad[5]}<br></p>`
    }
    return mailOptions2}

const mailOptions = {
    from: 'Servidor Node.js',
    to: process.env.TEST_MAIL,
    subject: 'Registro de prueba',
    html: '<h1 style="color: blue;">Contenido de registro de prueba <span style="color: green;">Node.js</span></h1>'
}

   export {mailOptions, options2}

