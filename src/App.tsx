import { useState, useEffect } from 'react';
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
	const [isLoading, setIsLoading] = useState(false);
	const [isPreloaded, setIsPreloaded] = useState(false);

	const API_URL = import.meta.env.VITE_API_URL;

	const currentYear = new Date().getFullYear();

	useEffect(() => {
		setIsPreloaded(true);
	}, []);

	const handleDrop = async (emotion: string) => {
		setIsLoading(true);
		try {
			const response = await axios.post<{ song: Song }>(
				`${API_URL}/api/recommend`,
				{ emotion: emotion },
			);
			setRecommendedSong(response.data.song);
			setCurrentEmotion(emotion);
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				const status = error.response?.status;

				if (status === 404) {
					alert('😢 No song found for this emotion.');
				} else {
					alert('⚠️ Something went wrong. Please try again later.');
				}
			} else {
				alert('⚠️ An unexpected error occurred.');
			}

			console.error('Error fetching song:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const extractYouTubeId = (url: string): string | undefined => {
		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[7].length === 11 ? match[7] : undefined;
	};

	const fakeYoutubeOptions = {
		height: '0',
		width: '0',
		playerVars: {
			autoplay: 0,
		},
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
			{isPreloaded && (
				<YouTube
					videoId='dQw4w9WgXcQ'
					opts={fakeYoutubeOptions}
					className='fake-Youtube'
				/>
			)}

			<div className='bubbles-container'>
				{emotions.map((emotion) => (
					<div
						key={emotion.name}
						className='bubble'
						draggable
						onDragStart={(e) =>
							e.dataTransfer.setData('text/plain', emotion.name)
						}
					>
						{emotion.name}
					</div>
				))}
			</div>

			{isLoading && <h3 className='loading-text'>🎵 Finding your jam...</h3>}

			<div
				className='vinyl'
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					const emotion = e.dataTransfer.getData('text/plain');
					handleDrop(emotion);
				}}
			>
				<div className='vinyl-border'></div>
				<div className='center-label'></div>
				<div className='middle-circle'></div>
				{recommendedSong && <div className='sound-wave'></div>}
				{!currentEmotion && <p>Drag and drop your emotion here</p>}
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
