import Joi from 'joi';

export const userSchema = Joi.object({
	username: Joi
      .string()
      .alphanum()
      .min(5)
      .max(30)
      .required(),
      
   email: Joi
      .string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),

	password: Joi
      .string()
      .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')),

	repeat_password: Joi
      .ref('password'),
});
