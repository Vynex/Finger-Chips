import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema(
	{
		wordCount: {
			type: Number,
			enum: [10, 25, 50, 100, 250],
			required: true,
		},
		wpm: {
			type: Number,
			required: true,
		},
		acc: {
			type: Number,
			required: true,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
		},
	},
	{ timestamps: true }
);

export default mongoose.model('result', resultSchema);
