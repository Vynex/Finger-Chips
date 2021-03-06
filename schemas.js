import Joi from 'joi';

export const userSchema = Joi.object({
	username: Joi.string().alphanum().min(5).max(30).required(),

	email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

	// password: Joi.string().pattern(
	// 	new RegExp(
	// 		'^(?:(?=.*?[A-Z])(?:(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[]{},.<>+=])|(?=.*?[a-z])(?:(?=.*?[0-9])|(?=.*?[-!@#$%^&*()_[]{},.<>+=])))|(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-!@#$%^&*()_[]{},.<>+=]))[A-Za-z0-9!@#$%^&*()_[]{},.<>+=-]{6,30}$'
	// 	)
	// ),
	password: Joi.string().min(6).max(30).required(),

	repeat_password: Joi.ref('password'),
});
