require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MoodSong = require('./models/MoodSong');

const app = express();
app.use(cors());
app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI)
	.then(() => console.log('✅ MongoDB connected'))
	.catch((err) => console.error('❌ MongoDB connection error:', err));

app.post('/api/recommend', async (req, res) => {
	try {
		const { emotion } = req.body;

		const result = await MoodSong.aggregate([
			{ $match: { emotion } },
			{ $unwind: '$songs' },
			{ $sample: { size: 1 } },
		]);

		if (result.length === 0) {
			return res
				.status(404)
				.json({ message: 'No song found for this emotion' });
		}

		res.json({ song: result[0].songs });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Failed to fetch song' });
	}
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
