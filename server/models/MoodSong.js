const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
	title: String,
	artist: String,
	album: String,
	release: String,
	url: String,
});

const moodSchema = new mongoose.Schema({
	_id: String,
	emotion: String,
	songs: [songSchema],
});

const MoodSong = mongoose.model('MoodSong', moodSchema, 'songs');

module.exports = MoodSong;
