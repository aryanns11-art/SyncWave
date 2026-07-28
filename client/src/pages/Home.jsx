import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import "./Home.css";

import { useState, useEffect, useRef } from "react";

import SongCard from "../components/SongCard";
import Player from "../components/Player";

function Home() {

    const [songs, setSongs] = useState([]);
    const [currentSong, setCurrentSong] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const { token } = useContext(AuthContext);

    const [isPlaying, setIsPlaying] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [volume, setVolume] = useState(1);

    const audioRef = useRef(new Audio());

    const fetchSongs = async () => {

        try {

            const response = await fetch("http://localhost:5000/api/songs");

            const data = await response.json();

            setSongs(data);

        } catch (error) {

            console.error("Error fetching songs:", error);

        }

    };

    const handleDeleteSong = async (id) => {

    const confirmDelete = window.confirm(
        "Are you sure you want to delete this song?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
       `http://localhost:5000/api/songs/${id}`,
       {
           method: "DELETE",
           headers: {Authorization: `Bearer ${token}`,},
       }
    );

        const data = await response.json();
        
        if (!response.ok) {
            alert(data.message);
            return;
        }
        
        alert(data.message);
        
        fetchSongs();

    } catch (error) {

        console.error(error);

        alert("Failed to delete song.");

    }

};

    useEffect(() => {

        fetchSongs();

        return () => {

            audioRef.current.pause();

            audioRef.current.currentTime = 0;

        };

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

    const filteredSongs = songs.filter((song) => {

    return (

        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||

        song.artist.toLowerCase().includes(searchTerm.toLowerCase())

        );

    });

    return (

        <div className="App">

            <div className="search-container">

    <input
        type="text"
        placeholder="Search songs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
    />

</div>

            {filteredSongs.length > 0 ? (
                filteredSongs.map((song, index) => (
            
                <SongCard
                    key={song.id}
                    song={song}
                    onSelect={() => handleSongSelect(song, index)}
                    onDelete={() => handleDeleteSong(song.id)}
                    isCurrent={currentSong?.id === song.id}
                />
            ))
        ) : (
        
            <p className="no-results">
                No songs found.
            </p>
        )}

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

export default Home;