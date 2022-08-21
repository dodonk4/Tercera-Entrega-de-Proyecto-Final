import express from 'express';
import { Router } from 'express';

import passport from 'passport';


import controladorUserMongoDb from '../controladores/controladorUserMongoDb.js';
import controladorGeneral from '../controladores/controladorGeneral.js';
import controladorComplejo from '../controladores/controladorComplejo.js';

const routerUsuariosRegistrados = new Router();

routerUsuariosRegistrados.use(express.json());
routerUsuariosRegistrados.use(express.urlencoded({ extended: true }));

routerUsuariosRegistrados.get('/register/', controladorComplejo.getAll);
routerUsuariosRegistrados.post('/register/', passport.authenticate('local', { failureRedirect: '/fail-registro', failureFlash: true}), controladorUserMongoDb.create);



export default routerUsuariosRegistrados;