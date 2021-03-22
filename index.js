import dotenv from 'dotenv';
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import mongoose from 'mongoose';
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/finger-chips';

mongoose.connect(dbURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

mongoose.connection.on('error', console.error.bind(console, 'Mongoose Connection Erorr, '));
mongoose.connection.once('open', () => {
	console.log('Connection to the Database Established');
});

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import favicon from 'serve-favicon';
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

import flash from 'connect-flash';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import passport from './configs/passport.js';
import HandledError from './utils/HandledError.js';

app.set('view engine', 'ejs');
app.set('static', path.join(__dirname, 'public'));
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(flash());

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
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

app.get('/', (req, res) => {
	res.render('home');
});

app.use('/', authRoutes);

app.use('/profile', profileRoutes);

app.all('*', (req, res, next) => {
	next(new HandledError(404, 'resource not found'));
});

app.use((err, req, res, next) => {
	const { status = 500 } = err;
	if (!err.message) err.message = 'something went wrong..';
	res.status(status).render('error', { err });
});

app.listen(PORT, () => {
	console.log(`Server Listening at Port ${PORT}`);
});
