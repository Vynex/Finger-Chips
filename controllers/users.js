import User from '../models/user.js';

export function registerForm(req, res) {
	if (req.user) return res.redirect('/');
	res.render('users/register');
}

export async function register(req, res) {
	try {
		const { email, username, password, repeat_password } = req.body;
		const user = new User({ email, username, password, repeat_password });
		await user.save();

		req.flash('success', 'welcome');
		res.redirect('/');
	} catch (err) {
		req.flash('error', err.message);
		res.redirect('/register');
	}
}

export function loginForm(req, res) {
	if (req.user) return res.redirect('/');
	res.render('users/login');
}

export function login(req, res) {
	req.flash('success', `welcome back ${req.user.username}`);

	const redirectUrl = req.session.returnTo || '/';
	delete req.session.returnTo;
	res.redirect(redirectUrl);
}

export function logout(req, res) {
	req.logout();

	req.flash('success', 'signed out');
	res.redirect('/');
}
