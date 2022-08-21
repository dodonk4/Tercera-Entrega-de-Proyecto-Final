import twilio from 'twilio';
import { usuariosDao } from '../daos/index.js';
const accountSid = 'ACac54c864b295554403732ac986dfdc27';
const authToken = '0e220bd8ebff6d10e9b5ada070b2dc8f';
const client = twilio(accountSid, authToken);

const senderWpp = async (nombre)=>{
    try {
        const cantidad = await usuariosDao.getCantidad(nombre);
        
        const message = await client.messages.create({
            body: `Pedido de ${nombre}: \nColchon: ${cantidad[0]} \nManta: ${cantidad[1]} \nComputadora: ${cantidad[2]} \nAuriculares: ${cantidad[3]} \nParlantes: ${cantidad[4]} \nChromecast: ${cantidad[5]}`,
            from: 'whatsapp:+14155238886',
            to: 'whatsapp:+5492235198563'
        })
        console.log(message)
    } catch (error) {
        console.log(error)
    }

}

const senderWppToClient = async (nombre)=>{
    try {
        const phone = await usuariosDao.getPhone(nombre);
        const message = await client.messages.create({
            body: `Pedido confirmado ${nombre}`,
            from: 'whatsapp:+14155238886',
            to: `whatsapp:+57${phone}`
        })
        console.log(message)
    } catch (error) {
        console.log(error)
    }

}

export {senderWpp, senderWppToClient};