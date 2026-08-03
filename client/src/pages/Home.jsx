import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

import usePlayer from "../hooks/usePlayer";

import "./Home.css";

import socket from "../socket";

import SongCard from "../components/SongCard";
import Player from "../components/Player";

function Home() {

    const [songs, setSongs] = useState([]);

    const { token } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState("");


    const {
        currentSong,
        setCurrentSong,

        currentIndex,
        setCurrentIndex,

        isPlaying,
        setIsPlaying,

        currentTime,
        setCurrentTime,

        duration,
        setDuration,

        volume,
        setVolume,

        audioRef,

        togglePlayPause,
        handleVolumeChange,
        handleSeek,

        formatTime,
        playNextSong,
        handleSongSelect,

        handleNext,
        playPreviousSong,

    } = usePlayer(songs);



    const fetchSongs = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/songs"
            );

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
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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

    // Fetch songs when Home loads
    // Stop audio when Home unmounts
    useEffect(() => {

        fetchSongs();

        return () => {

            audioRef.current.pause();

            audioRef.current.currentTime = 0;

        };

    }, []);

    // Socket.IO connection
    useEffect(() => {

        const handleConnect = () => {

            console.log(
                "Connected to SyncWave server:",
                socket.id
            );

        };

        socket.on("connect", handleConnect);

        return () => {

            socket.off("connect", handleConnect);

        };

    }, []);



    const filteredSongs = songs.filter((song) => {

        return (

            song.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||

            song.artist
                .toLowerCase()
                .includes(searchTerm.toLowerCase())

        );

    });

    return (

        <div className="App">

            <div className="search-container">

                <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="search-input"
                />

            </div>

            {filteredSongs.length > 0 ? (

                filteredSongs.map((song, index) => (

                    <SongCard
                        key={song.id}
                        song={song}
                        onSelect={() =>
                            handleSongSelect(song, index)
                        }
                        onDelete={() =>
                            handleDeleteSong(song.id)
                        }
                        isCurrent={
                            currentSong?.id === song.id
                        }
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