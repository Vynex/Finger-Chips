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

// Change to ownsResult
export async function ownsResult(req, res, next) {
	const { id, rid } = req.params;
	const result = await _findById(rid);

	if (!result.owner.equals(req.user._id)) {
		res.status(403).end();
	}
	next();
}
