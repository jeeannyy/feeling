const mongoose = require('mongoose');

let isConnected = false;

const dbConnect = async () => {
	if (isConnected) return;

	try {
		await mongoose.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		isConnected = true;
		console.log('✅ MongoDB connected');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		throw error;
	}
};

module.exports = dbConnect;
