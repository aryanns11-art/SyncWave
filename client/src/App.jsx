import { useState, useEffect, useRef } from "react";
import SongCard from "./components/SongCard";
import Player from "./components/Player";

function App() {

    const [songs, setSongs] = useState([]);

    const [currentSong, setCurrentSong] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);

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
    audioRef.current.play();};

    useEffect(() => {

        fetch("http://localhost:5000/api/songs")
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
            });

    }, []);

    return (
        <div className="App">

        <h1>🎵 SyncWave</h1>

        {songs.map((song) => (
    <SongCard
        key={song.id}
        song={song}
        onSelect={handleSongSelect}
    />
))}
        <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onToggle={togglePlayPause}  
        />


    </div>
);

}

export default App;