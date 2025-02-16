import { useState } from 'react';
import axios from 'axios';
import './App.css';
import YouTube from 'react-youtube';

interface Emotion {
	name: string;
}

interface Song {
	title: string;
	artist: string;
	url: string;
	album?: string;
	release?: string;
}

const emotions: Emotion[] = [
	{ name: 'Happy' },
	{ name: 'Surprised' },
	{ name: 'Sad' },
	{ name: 'Angry' },
	{ name: 'Fearful' },
	{ name: 'Disgusted' },
];

const App = () => {
	const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
	const [recommendedSong, setRecommendedSong] = useState<Song | null>(null);
	const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
	const currentYear = new Date().getFullYear();

	const API_URL = import.meta.env.VITE_API_URL;

	const handleDrop = async (emotion: string) => {
		try {
			const response = await axios.post<{ song: Song }>(
				`${API_URL}/api/recommend`,
				{
					emotion: emotion,
				},
			);
			console.log('response', response);

			setRecommendedSong(response.data.song);
			setCurrentEmotion(emotion);
		} catch (error) {
			console.error('Error fetching song:', error);
		}

		setIsDraggingOver(false);
	};

	const extractYouTubeId = (url: string): string | undefined => {
		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[7].length === 11 ? match[7] : undefined;
	};

	const youtubeOptions = {
		height: '0',
		width: '0',
		playerVars: {
			autoplay: 1,
			controls: 0,
			modestbranding: 1,
		},
	};

	return (
		<div className='App'>
			<div className='bubbles-container'>
				{emotions.map((emotion) => (
					<div
						key={emotion.name}
						className='bubble'
						style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
						draggable
						onDragStart={(e) =>
							e.dataTransfer.setData('text/plain', emotion.name)
						}
					>
						{emotion.name}
					</div>
				))}
			</div>
			<div
				className='vinyl'
				onDragOver={(e) => {
					e.preventDefault();
					setIsDraggingOver(true);
				}}
				onDragLeave={() => setIsDraggingOver(false)}
				onDrop={(e) => {
					const emotion = e.dataTransfer.getData('text/plain');
					handleDrop(emotion);
				}}
			>
				<div className='vinyl-border'></div>
				<div className='center-label'></div>
				<div className='middle-circle'></div>
				{recommendedSong && <div className='sound-wave'></div>}
				{currentEmotion ? <p></p> : <p>Drag and drop your emotion here</p>}
			</div>

			{recommendedSong && (
				<div className='playlist-info'>
					<YouTube
						videoId={extractYouTubeId(recommendedSong.url)}
						opts={youtubeOptions}
					/>

					<b>{recommendedSong.title}</b>

					<p>
						{recommendedSong.artist} • {recommendedSong.album} •{' '}
						{recommendedSong.release}
					</p>
				</div>
			)}

			<p className='ending-credits'>
				Copyright © {currentYear} Jeeann 🦕. All rights reserved.
			</p>
		</div>
	);
};

export default App;
