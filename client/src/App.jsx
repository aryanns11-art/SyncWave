import "./App.css";
import { useState, useEffect, useRef } from "react";
import SongCard from "./components/SongCard";
import Player from "./components/Player";
import UploadSong from "./components/UploadSong";   

function App() {

    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);

    const audioRef = useRef(new Audio());

    useEffect(() => {
        fetch("http://localhost:5000/api/songs")
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
            });
    }, []);

    const togglePlayPause = () => {

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }

    };

        const handleVolumeChange = (event) => {

        const newVolume = Number(event.target.value);

        setVolume(newVolume);

        audioRef.current.volume = newVolume;

    };

    const handleSongSelect = (selectedSong, index) => {

        setCurrentSong(selectedSong);
        setCurrentIndex(index);

        setCurrentTime(0);
        setDuration(0);

        setIsPlaying(true);

        audioRef.current.pause();

        audioRef.current.src = selectedSong.file;

        audioRef.current.load();

        audioRef.current.play();

        audioRef.current.onloadedmetadata = () => {
            setDuration(audioRef.current.duration);
        };

        audioRef.current.ontimeupdate = () => {
            setCurrentTime(audioRef.current.currentTime);
        };

        audioRef.current.onended = () => {
            playNextSong(index);
        };

    };

    const playNextSong = (index) => {

        const nextIndex = index + 1;

        if (nextIndex < songs.length) {

            handleSongSelect(songs[nextIndex], nextIndex);

        } else {

            setIsPlaying(false);

            setCurrentSong(null);

            setCurrentIndex(-1);

            setCurrentTime(0);

        }

    };

    const handleNext = () => {

    const nextIndex = currentIndex + 1;

    if (nextIndex < songs.length) {

        handleSongSelect(songs[nextIndex], nextIndex);

    }

};

        const playPreviousSong = () => {

        const previousIndex = currentIndex - 1;

        if (previousIndex >= 0) {
            handleSongSelect(songs[previousIndex], previousIndex);
        }

    };

    const handleSeek = (event) => {

        const seekTime = Number(event.target.value);

        audioRef.current.currentTime = seekTime;

        setCurrentTime(seekTime);

    };

    const formatTime = (time) => {

        if (isNaN(time)) return "0:00";

        const minutes = Math.floor(time / 60);

        const seconds = Math.floor(time % 60);

        return `${minutes}:${seconds.toString().padStart(2, "0")}`;

    };

    return (
        <div className="App">

            <div className="app-header">
                <img src="/logo.jpeg" alt="SyncWave Logo" className="app-logo" />
                <h1>SyncWave</h1>
            </div>

            <UploadSong />

            {songs.map((song, index) => (
                <SongCard
                    key={song.id}
                    song={song}
                    onSelect={() => handleSongSelect(song, index)}
                    isCurrent={currentSong?.id === song.id}
                />
            ))}

            <Player
                currentSong={currentSong}
                isPlaying={isPlaying}
                onToggle={togglePlayPause}
                currentTime={currentTime}
                duration={duration}
                onSeek={handleSeek}
                onNext={handleNext}
                onPrevious={playPreviousSong}
                volume={volume}
                onVolumeChange={handleVolumeChange}
            />

        </div>
    );

}

export default App;