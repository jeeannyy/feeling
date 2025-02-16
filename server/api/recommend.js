import mongoose from 'mongoose';
import MoodSong from '../models/MoodSong';

export default async function handler(req, res) {
	if (req.method !== 'POST') {
		return res.status(405).json({ message: 'Method Not Allowed' });
	}

	if (!mongoose.connections[0].readyState) {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	}

	try {
		const { emotion } = req.body;
		console.log('Received emotion:', emotion);

		const result = await MoodSong.aggregate([
			{ $match: { emotion: emotion } },
			{ $unwind: '$songs' },
			{ $sample: { size: 1 } },
		]);

		if (result.length > 0) {
			res.json({ song: result[0].songs });
		} else {
			res.status(404).json({ message: 'No songs found for this mood.' });
		}
	} catch (error) {
		console.error('Error fetching song:', error);
		res.status(500).json({ message: 'Internal server error' });
	}
}
