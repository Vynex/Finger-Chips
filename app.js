import { dbURL } from './configs/config.js';
import { info, error } from './utils/logger.js';
import express from 'express';

import mongoose from 'mongoose';

import path from 'path';
import { fileURLToPath } from 'url';

import favicon from 'serve-favicon';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './configs/passport.js';
import HandledError from './utils/HandledError.js';

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

const app = express();

mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

mongoose.connection.on(
	'error',
	error.bind(console, 'Mongoose Connection Error, ')
);
mongoose.connection.once('open', () => {
	info('Connection to the Database Established');
});

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const secret = process.env.SESSION_SECRET || 'secret';
const sessionConfig = {
	store: MongoStore.create({
		mongoUrl: dbURL,
		touchAfter: 24 * 3600,
	}),
	name: 'session',
	secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure: true,
		expires: Date.now() + 604800000, // 1 Week
		maxAge: 604800000, // 1 Week
	},
};

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.use('/', authRoutes);
app.use('/profile', profileRoutes);

app.all('*', (req, res, next) => {
	next(new HandledError(404, 'Resource not Found'));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'Something Went Wrong';
	res.status(status).render('error', { err });
});

export default app;
