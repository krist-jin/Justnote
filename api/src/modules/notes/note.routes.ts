import { Router } from 'express';

import * as noteController from './note.controllers';
import { authJwt } from '../../services/auth.services';

const routes = Router();

routes.post('/', authJwt, noteController.createNote);
routes.get('/', authJwt, noteController.listNotes);
routes.get('/:id', authJwt, noteController.getNoteById);
routes.patch('/:id', authJwt, noteController.updateNoteById);
routes.delete('/:id', authJwt, noteController.deleteNoteById);

export default routes;
