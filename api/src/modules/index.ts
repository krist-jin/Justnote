import userRoutes from './users/user.routes';
import noteRoutes from './notes/note.routes';
import { Application } from 'express';
import { authJwt } from '../services/auth.services';

export default (app: Application) => {
    app.use('/api/v1/users', userRoutes);
    app.use('/api/v1/notes', noteRoutes);

    // test JWT
    app.get('/hello', authJwt, (req, res) => {
        res.send('This is a private route!!!!');
    });
};
