import pkg from 'mongoose';
const { model } = pkg;
import mongoose from 'mongoose';
import config from '../../config.js';
import {configuracion, loggerError} from '../../log4js/log4.js';
configuracion();
await mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)



class contenedorProductosMongoDb{
    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async getAll(){
        try{
                let productos = await this.coleccion.find({}).lean();             
                return productos;
        }
        catch(err){
            loggerError.error(`Error de lectura: ${err}`);
        }
    }

}

export default contenedorProductosMongoDb;