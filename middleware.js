import Result from './models/result.js';
import { userSchema } from './schemas.js';
import HandledError from './utils/HandledError.js';

export function isLoggedIn(req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'log in to view profile');
		return res.redirect('/login');
	}
	next();
}

export async function validateRegistration(req, res, next) {
	const {error} = userSchema.validate(req.body);
	if (error) {
		const message = error.details.map((el) => el.message).join(',');
		throw new HandledError(400, message);
	} else {
		next();
	}
}

export async function ownsResult(req, res, next) {
	const { rid } = req.params;
	const result = await Result.findById(rid);

	if (!result.owner.equals(req.user._id)) {
		res.status(401).end();
	}

	next();
}
