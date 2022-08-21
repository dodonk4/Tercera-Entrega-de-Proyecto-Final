import config from '../config.js'
let usuariosDao
let productosDao
switch (config.MODO_PERSISTENCIA) {
    case 'mongodb':
        const { default: DaoMongoDb } = await import('./daoMongoDb.js')
        const { default: ProductosDaoMongoDb } = await import('./daoProductosMongoDb.js')
        usuariosDao = new DaoMongoDb()
        productosDao = new ProductosDaoMongoDb()
        break
        
}
export { usuariosDao, productosDao }