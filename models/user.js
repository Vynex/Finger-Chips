import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Result from './result.js';

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		results: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Result',
			},
		],
	},
	{ timestamps: true }
);

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.post('findOneAndDelete', async function (user) {
	if (user) {
		await Result.deleteMany({
			_id: {
				$in: user.results,
			},
		});
	}
});

export default mongoose.model('User', userSchema);
