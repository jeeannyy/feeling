const mongoose = require('mongoose');

const dbConnect = async () => {
	if (mongoose.connection.readyState === 1) return;

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log('✅ MongoDB connected');
	} catch (error) {
		console.error('❌ MongoDB connection error:', error);
	}
};

module.exports = dbConnect;
