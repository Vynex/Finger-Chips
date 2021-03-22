import express, { Router } from 'express';
const router = Router();

import catchAsync from '../utils/CatchAsync.js';
import passport from '../configs/passport.js';
import { registerForm, register, loginForm, login, logout } from '../controllers/users.js';
import { validateRegistration } from '../middleware.js';

router.route('/register')
	.get(registerForm)
	.post(express.urlencoded({ extended: true }), validateRegistration, catchAsync(register));

router.route('/login')
	.get(loginForm)
	.post(express.urlencoded({ extended: true }), passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login);

router.get('/logout', logout);

export default router;
