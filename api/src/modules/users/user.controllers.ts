import User, { IUser } from './user.model';
import { Request, Response, NextFunction } from 'express';
import HTTPStatus from 'http-status';
import { JwtPayload } from '../../services/auth.services';

export async function signup(req: Request, res: Response) {
    try {
        // console.log('got a signup request')
        const user = await User.create(req.body);
        return res.status(HTTPStatus.CREATED).json(user);
    } catch (e) {
        // console.log(e);
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}

export function login(req: Request, res: Response, next: NextFunction) {
    const user: IUser = req.user as IUser;
    const rememberMe = req.body.remember_me === 'true';
    const jwtPayload: JwtPayload = user.creatUserJwtToken(rememberMe);
    const cookieOptions = {
        httpOnly: true,
        secure: true,
        ...(rememberMe ? { maxAge: parseInt(process.env.JWT_LONG_EXPIRATION_MS as string) } : {})
    }
    res.cookie('jwt', jwtPayload, cookieOptions);  // set the jwt in the cookie
    res.status(HTTPStatus.OK).json(user.toAuthJSON());
    return next();
}

export async function getUserProfile(req: Request, res: Response) {
    try {
        const jwtPayload: JwtPayload = req.user as JwtPayload;
        const user: IUser = await User.findById(jwtPayload._id) as IUser;
        return res.status(HTTPStatus.OK).json(user);
    } catch (e) {
        return res.status(HTTPStatus.BAD_REQUEST).json(e);
    }
}