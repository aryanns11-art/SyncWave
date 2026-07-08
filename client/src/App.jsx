import { useState, useEffect, useRef } from "react";
import SongCard from "./components/SongCard";
import Player from "./components/Player";

function App() {

    const [songs, setSongs] = useState([]);

    const [currentSong, setCurrentSong] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const [currentTime, setCurrentTime] = useState(0);

    const [duration, setDuration] = useState(0);    

    const audioRef = useRef(new Audio());

    const togglePlayPause = () => {

    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    } else {
        audioRef.current.play();
        setIsPlaying(true);
    }

};

    const handleSongSelect = (selectedSong) => {
        setCurrentSong(selectedSong);
        setIsPlaying(true);
        audioRef.current.src = selectedSong.file;
        
        audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
        };
        audioRef.current.play();

        audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
        };
    };

    useEffect(() => {

        fetch("http://localhost:5000/api/songs")
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
            });

    }, []);

    const formatTime = (time) => {

    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);

    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

    return (
        <div className="App">

        <h1>🎵 SyncWave</h1>

        <p>Current Time: {formatTime(currentTime)}</p>
        <p>Duration: {formatTime(duration)}</p>

        {songs.map((song) => (
    <SongCard
        key={song.id}
        song={song}
        onSelect={handleSongSelect}
        isCurrent={currentSong?.id === song.id}
    />
))}
        <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onToggle={togglePlayPause}  
        currentTime={currentTime}
        duration={duration}
        />


    </div>
);

}

export default App;