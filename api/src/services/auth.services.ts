import User, { IUser } from '../modules/users/user.model';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

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
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
    secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
    try {
        // Identify user by ID
        const user = await User.findById(payload._id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
})

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
