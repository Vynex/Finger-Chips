import User from '../models/user.js';
import Result from '../models/result.js';

export async function create(req, res) {
	const { id, wordCount, wpm, acc } = req.body;
	const user = await User.findById(id);

	const result = new Result({ wordCount, wpm, acc });
	result.owner = req.user._id;

	user.results.push(result);

	await result.save();
	await user.save();

	res.status(200).send('submitted');
}

export async function destroy(req, res) {
	const id = req.user._id;
	const { rid } = req.params;

	await User.findByIdAndUpdate(id, { $pull: { results: rid } });
	await Result.findByIdAndDelete(rid);

	res.status(204).send('deleted');
}

export async function showData(req, res) {
	const { _id } = req.user;
	const { wordCount } = req.query;

	const results = await Result.find({ owner: _id, wordCount });

	res.send(results);
}

export function renderProfile(req, res) {
	if (req.user) res.render('profile/graph');
	else res.redirect('/login');
}

export function renderHistory(req, res) {
	res.render('profile/history');
}
