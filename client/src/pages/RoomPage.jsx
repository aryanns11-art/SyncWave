import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import socket from "../socket";

function RoomPage() {

    const { roomId } = useParams();

    const navigate = useNavigate();

    const [memberCount, setMemberCount] = useState(0);
    const [isHost, setIsHost] = useState(false);

    const [currentSong, setCurrentSong] = useState(null);

    const [songs, setSongs] = useState([]);

    const [error, setError] = useState("");

    // Fetch available songs
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

        } catch (error) {

            console.error("Error fetching songs:", error);

            setError("Failed to load songs.");

        }

    };

    useEffect(() => {

        fetchSongs();

        // Receive current room state
        const handleRoomState = ({
            roomId: stateRoomId,
            memberCount,
            isHost,
            currentSong
        }) => {

            if (stateRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);
            setIsHost(isHost);
            setCurrentSong(currentSong);

        };

        // Room member count changed
        const handleRoomUpdated = ({
            roomId: updatedRoomId,
            memberCount
        }) => {

            if (updatedRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);

        };

        // Another event changed the current song
        const handleRoomSongChanged = ({ song }) => {

            setCurrentSong(song);

        };

        // Room error
        const handleRoomError = ({ message }) => {

            setError(message);

        };

        // Host closed room
        const handleRoomClosed = () => {

            alert("The host closed the room.");

            navigate("/rooms");

        };

        socket.on("room-state", handleRoomState);

        socket.on("room-updated", handleRoomUpdated);

        socket.on("room-song-changed", handleRoomSongChanged);

        socket.on("room-error", handleRoomError);

        socket.on("room-closed", handleRoomClosed);

        // Ask server for current room state
        socket.emit("get-room-state", roomId);

        return () => {

            socket.off("room-state", handleRoomState);

            socket.off("room-updated", handleRoomUpdated);

            socket.off(
                "room-song-changed",
                handleRoomSongChanged
            );

            socket.off("room-error", handleRoomError);

            socket.off("room-closed", handleRoomClosed);

        };

    }, [roomId, navigate]);

    const handleSongSelect = (song) => {

        setError("");

        socket.emit("select-song", {
            roomId,
            song
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

                    {songs.length > 0 ? (

                        songs.map((song) => (

                            <button
                                key={song.id}
                                onClick={() =>
                                    handleSongSelect(song)
                                }
                            >
                                {song.title}
                            </button>

                        ))

                    ) : (

                        <p>No songs available.</p>

                    )}

                </div>

            )}

            <hr />

            {/* Current Song */}
            <div>

                <h3>Now Playing</h3>

                {currentSong ? (

                    <div>

                        <h2>
                            {currentSong.title}
                        </h2>

                        <p>
                            {currentSong.artist}
                        </p>

                    </div>

                ) : (

                    <p>
                        No song selected.
                    </p>

                )}

            </div>

            <hr />

            <button onClick={leaveRoom}>
                Leave Room
            </button>

        </div>

    );

}

export default RoomPage;