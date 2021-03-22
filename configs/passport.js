import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { compare } from 'bcrypt';
import User from '../models/user.js';

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// Local Strategy
passport.use(
	new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {
		User.findOne({ username })
			.then((user) => {
				compare(password, user.password, (err, isMatch) => {
					if (err) throw err;

					if (isMatch) {
						return done(null, user);
					} else {
						return done(null, false, { message: 'Incorrect Username or Password' });
					}
				});
			})
			.catch((err) => {
				return done(null, false, { message: 'Incorrect Username or Password' });
			});
	})
);

export default passport;
