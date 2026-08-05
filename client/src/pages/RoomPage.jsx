import Player from "../components/Player";
import usePlayer from "../hooks/usePlayer";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import socket from "../socket";
import SongCard from "../components/SongCard";

function RoomPage() {

    const { roomId } = useParams();

    const navigate = useNavigate();

    const [memberCount, setMemberCount] = useState(0);

    const [isHost, setIsHost] = useState(false);

    const [songs, setSongs] = useState([]);

    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const {

        audioRef,
        setIsPlaying,

        currentSong,

        handleSongSelect,

        isPlaying,
        togglePlayPause,

        currentTime,
        duration,

        handleSeek,

        handleNext,
        playPreviousSong,

        volume,
        handleVolumeChange,

    } = usePlayer(songs);

    // Fetch songs
    const fetchSongs = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/songs"
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Failed to fetch songs"
                );

            }

            setSongs(data);

        }

        catch (error) {

            console.error(error);

            setError("Failed to load songs.");

        }

    };

    // Load songs once
    useEffect(() => {

        fetchSongs();

    }, []);

    // Socket listeners
    useEffect(() => {

        if (songs.length === 0) {
            return;
        }

        const handleRoomState = ({
            roomId: stateRoomId,
            memberCount,
            isHost,
            currentSong,
        }) => {

            if (stateRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);

            setIsHost(isHost);

            if (currentSong) {

                const index = songs.findIndex(
                    (song) => song.id === currentSong.id
                );

                if (index !== -1) {

                    handleSongSelect(currentSong, index);

                }

            }

        };

        const handleRoomUpdated = ({
            roomId: updatedRoomId,
            memberCount,
        }) => {

            if (updatedRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);

        };

        const handleRoomSongChanged = ({ song }) => {

            // Host already started playback locally
            if (isHost) return;

            const index = songs.findIndex(
                    (s) => s.id === song.id
                );
            
                if (index !== -1) {
                    handleSongSelect(song, index);
                }
            
        };

        const handleRoomTogglePlay = async ({ isPlaying }) => {

            if (isHost) return;

            if (isPlaying) 
            {
                try 
                {
                    await audioRef.current.play();
                    setIsPlaying(true);
                } 
                catch (error) 
                {
                    console.error(error);
                }
            } 
            else {
            
                audioRef.current.pause();
                setIsPlaying(false);
            }
        };

        const handleRoomError = ({ message }) => {

            setError(message);

        };

        const handleRoomClosed = () => {

            alert("The host closed the room.");

            navigate("/rooms");

        };

        socket.on("room-state", handleRoomState);

        socket.on("room-updated", handleRoomUpdated);

        socket.on("room-song-changed", handleRoomSongChanged);

        socket.on("room-error", handleRoomError);

        socket.on("room-closed", handleRoomClosed);

        socket.on("room-toggle-play", handleRoomTogglePlay);

        socket.emit("get-room-state", roomId);

        return () => {

            socket.off("room-state", handleRoomState);

            socket.off("room-updated", handleRoomUpdated);

            socket.off("room-song-changed", handleRoomSongChanged);

            socket.off("room-error", handleRoomError);

            socket.off("room-closed", handleRoomClosed);

            socket.off("room-toggle-play", handleRoomTogglePlay);   

        };

    }, [ songs, roomId, navigate, handleSongSelect, isHost, audioRef, setIsPlaying,]);

    const selectRoomSong = (song, index) => {

        setError("");

        // Play immediately for host
        handleSongSelect(song, index);

        // Tell everyone else
        socket.emit("select-song", {

            roomId,

            song,

        });

    };

    const leaveRoom = () => {

        socket.emit("leave-room", roomId);

        navigate("/rooms");

    };

return (

    <div className="room-page">

        <h1>SyncWave Room</h1>

        <h2>Room Code: {roomId}</h2>

        {error && (

            <p>{error}</p>

        )}

        <p>
            Members: {memberCount}
        </p>

        {isHost && (

            <p>
                You are the host 👑
            </p>

        )}

        <hr />

        {/* Host Controls */}

        {isHost && (

            <div>

                <h3>Host Controls</h3>

                <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                {songs
                    .filter((song) =>

                        song.title
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||

                        song.artist
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())

                    )
                    .map((song, index) => (

                        <SongCard
                            key={song.id}
                            song={song}
                            onSelect={() =>
                                selectRoomSong(song, index)
                            }
                            isCurrent={
                                currentSong?.id === song.id
                            }
                        />

                    ))}

            </div>

        )}

        <hr />

        <hr />

        <Player
            currentSong={currentSong}
            isPlaying={isPlaying}

            onToggle={() => {
                const nextState = !isPlaying;   
                togglePlayPause();
                if (isHost) {
                    socket.emit("toggle-play", {
                        roomId,
                        isPlaying: nextState,
                    });
                }
            }}

            currentTime={currentTime}
            duration={duration}
            onSeek={handleSeek}
            onNext={handleNext}
            onPrevious={playPreviousSong}
            volume={volume}
            onVolumeChange={handleVolumeChange}
        />  

        <hr />

        <hr />

        <button onClick={leaveRoom}>
            Leave Room
        </button>

    </div>

);

}

export default RoomPage;