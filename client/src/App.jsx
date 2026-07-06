import { useState, useEffect} from "react";
import SongCard from "./components/SongCard";
import Player from "./components/Player";

function App() {

    const [songs, setSongs] = useState([]);

    const [currentSong, setCurrentSong] = useState(null);

    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    };

    const handleSongSelect = (selectedSong) => {
    setCurrentSong(selectedSong);
    setIsPlaying(true);
    const audio = new Audio();
    audio.src = selectedSong.file;
    audio.play();
    };

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