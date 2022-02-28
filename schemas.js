import Joi from 'joi';

export const userSchema = Joi.object({
	username: Joi.string().alphanum().min(5).max(30).required(),

	email: Joi.string()
		.email({
			minDomainSegments: 2,
			tlds: { allow: ['com', 'net'] },
		})
		.required(),

	password: Joi.string()
		.regex(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/)
		.required(),

	repeat_password: Joi.ref('password'),
});
