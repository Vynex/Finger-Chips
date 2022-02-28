import User from '../models/user.js';

export function registerForm(req, res) {
	if (req.user) return res.redirect('/');
	res.render('users/register');
}

export async function register(req, res) {
	try {
		const { email, username, password } = req.body;

		const user = new User({ email, username, password });
		await user.save();

		return res.redirect('/login');
	} catch (err) {
		return res.redirect('/register');
	}
}

export function loginForm(req, res) {
	if (req.user) return res.redirect('/');
	res.render('users/login');
}

export function login(req, res) {
	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

export function logout(req, res) {
	req.logout();
	res.redirect('/');
}
