import User, { IUser } from './user.model';
import { Request, Response, NextFunction } from 'express';
import HTTPStatus from 'http-status';

export async function signup(req: Request, res: Response) {
    try {
        console.log('got a signup request')
        const user = await User.create(req.body);
        return res.status(HTTPStatus.CREATED).json(user);
    } catch (e) {
        console.log(e);
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export function login(req: Request, res: Response, next: NextFunction) {
    const user: IUser = req.user as IUser;
    res.status(HTTPStatus.OK).json(user.toAuthJSON());
    return next();
}

export async function getUserProfile(req: Request, res: Response) {
    try {
        const user: IUser = req.user as IUser;
        return res.status(HTTPStatus.OK).json(user);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}