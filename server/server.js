require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MoodSong = require('./models/MoodSong');

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI;

mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('✅ MongoDB 연결 성공!'))
	.catch((err) => console.error('❌ MongoDB 연결 실패:', err));

app.post('/api/recommend', async (req, res) => {
	try {
		const { emotion } = req.body;

		console.log('emotion:', emotion);

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
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
