import pkg from 'mongoose';
const { model } = pkg;
import mongoose from 'mongoose';
import config from '../../config.js';
import {configuracion, loggerError} from '../../log4js/log4.js';
configuracion();
await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)



class contenedorMongoDb{
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema);
    }

    async save(objeto){
            try {
                const user = {nombre: objeto.nombre, contraseña: objeto.contraseña, cantidad: objeto.cantidad, telefono: objeto.telefono};
                const userSaveModel = new this.coleccion(user);
                let userSave = await userSaveModel.save();
                console.log(userSave);
            } catch (error) {
                loggerError.error(`Error de lectura: ${err}`);
            }
        
    }

    async getAll(){
        try{
                let usuarios = await this.coleccion.find({});
                return usuarios;
        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

    async changeCantidad(nuevaCantidad, name){
        try {
            let usuarios = await this.coleccion.find({});
            for (let usuario of usuarios){
                if (usuario.nombre === name){
                    console.log('SE RECONOCIÓ EXITOSAMENTE')
                    await this.coleccion.updateOne({nombre: name}, {$set: {cantidad: nuevaCantidad}});
                }
            }

        } catch (error) {
            loggerError.error(`Error de lectura: ${error}`);
        }
    }
    
    async getCantidad(name){
        try {
            let usuario = await this.coleccion.find({nombre: name});
            return usuario[0].cantidad;

        } catch (error) {
            loggerError.error(`Error de lectura: ${error}`);
        }
    }

    async getPhone(name){
        try {
            let usuario = await this.coleccion.find({nombre: name});
            return usuario[0].telefono;

        } catch (error) {
            loggerError.error(`Error de lectura: ${error}`);
        }
    }

}

export default contenedorMongoDb;