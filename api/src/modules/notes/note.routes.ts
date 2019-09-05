import { Router } from 'express';

import * as noteController from './note.controllers';
import { authJwt } from '../../services/auth.services';

const routes = Router();

routes.post('/', authJwt, noteController.createNote);
routes.get('/', authJwt, noteController.getAllNotes);
routes.get('/:id', authJwt, noteController.getNoteById);

export default routes;
