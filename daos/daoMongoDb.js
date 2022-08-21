import contenedorMongoDb from "../public/contenedores/contenedorMongoDb.js";

class DaoMongoDb extends contenedorMongoDb {

    constructor() {
        super('usuariosRegistrados', {
            nombre: { type: String, required: true },
            contraseña: { type: String, required: true },
            cantidad: { type: Array, required: true},
            telefono: { type: Number, required: true}
        })
    }
}

export default DaoMongoDb;