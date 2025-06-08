const mongoose = require('mongoose');

const dbConnect = async () => {
	if (mongoose.connections[0].readyState) return;

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('✅ MongoDB connected');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
		throw error;
	}
};

module.exports = dbConnect;
