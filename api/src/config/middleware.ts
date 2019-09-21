import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';
import passport from 'passport';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';

export default (app: any) => {
    if (isProd) {
        app.use(compression());
        app.use(helmet());
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(cookieParser());
    app.use(passport.initialize());  // apply passport
    if (isDev) {
        app.use(morgan('dev'));
    }
};