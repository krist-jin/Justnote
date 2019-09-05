import { Router } from 'express';
import * as userController from './user.controllers';
import { authLocal } from '../../services/auth.services';
import { authJwt } from '../../services/auth.services';

const routes = Router();

routes.post('/signup', userController.signup);
routes.post('/login', authLocal, userController.login);
routes.get('/self', authJwt, userController.getUserProfile);

export default routes;