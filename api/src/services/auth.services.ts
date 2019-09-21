import { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../modules/users/user.model';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import HTTPStatus from 'http-status';

export interface JwtPayload {
    _id: string;
    expires: number;
}

const localStrategy = new LocalStrategy({
    usernameField: 'username'
}, async (username, password, done) => {
    try {
        const user: IUser = await User.findOne({ username }) as IUser;
        if (!user) {
            return done(null, false);
        } else if (!user.authenticateUser(password)) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

const jwtStrategy = new JWTStrategy({
    jwtFromRequest: req => req.cookies && req.cookies.jwt,
    secretOrKey: process.env.JWT_SECRET
}, (jwtPayload: JwtPayload, done) => {
    try {
        if (!jwtPayload || !jwtPayload._id) {
            return done('Failed to get jwt token or id from cookies', false);
        }
        if (Date.now() > jwtPayload.expires) {
            return done('Json Web Token expired', false);
        }
        return done(null, jwtPayload);
    } catch (e) {
        return done('Failed to get jwt token from cookies', false);
    }
})

passport.use(localStrategy);
passport.use(jwtStrategy);

export function creatJwtToken(jwtPayload: JwtPayload) {
    return jwt.sign(
        jwtPayload,
        process.env.JWT_SECRET as string
    );
}

export const authLocal = passport.authenticate('local', { session: false });
export function authJwt(req: Request, res: Response, next: NextFunction) {
    passport.authenticate(
        'jwt',
        { session: false },
        (err, jwtPayload: JwtPayload) => {
            if (err || !jwtPayload || !jwtPayload._id) {
                return res.status(HTTPStatus.BAD_REQUEST).json({ err: err ? err : 'jwt token not valid' });
            }
            
            const newJwtPayload: JwtPayload = {
                ...jwtPayload,
                expires: Date.now() + parseInt(process.env.JWT_EXPIRATION_MS as string),  // refresh the JwtPayload
            };

            req.login(newJwtPayload, { session: false }, (error) => {
                if (error) {
                    res.status(HTTPStatus.BAD_REQUEST).send({ error });
                }
                const newJwtToken: string = creatJwtToken(newJwtPayload);
                res.cookie('jwt', newJwtToken, { httpOnly: true, secure: true });  // set the new jwt token to the cookie
            });

            return next();
        }
    )(req, res, next);
};
