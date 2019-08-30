import userRoutes from './users/user.routes';
import { Application } from 'express';

export default (app: Application) => {
    app.use('/api/v1/users', userRoutes);
};
