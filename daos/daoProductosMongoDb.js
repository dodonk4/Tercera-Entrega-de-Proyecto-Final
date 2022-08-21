import contenedorMongoDb from "../public/contenedores/contenedorMongoDb.js";

class DaoProductosMongoDb extends contenedorMongoDb {

    constructor() {
        super('productos', {
            id: { type: String, required: true },
            title: { type: String, required: true },
            foto: { type: String, required: true },
            precio: { type: Number, required: true },
            stock: { type: Number, required: true }
        })
    }
}

export default DaoProductosMongoDb;