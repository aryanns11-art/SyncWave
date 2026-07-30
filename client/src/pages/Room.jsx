import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import socket from "../socket";

function Room() {

    const [roomId, setRoomId] = useState("");
    const [createdRoom, setCreatedRoom] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const createRoom = () => {

        setError("");

        socket.emit("create-room");
    };

    const joinRoom = () => {

        setError("");

        const formattedRoomId = roomId.trim().toUpperCase();

        if (!formattedRoomId) {
            setError("Enter a room code.");
            return;
        }

        socket.emit("join-room", formattedRoomId);
    };

    useEffect(() => {

        const handleRoomCreated = ({ roomId }) => {

            console.log("Room created:", roomId);

             navigate(`/room/${roomId}`);

        };

        const handleRoomJoined = ({ roomId }) => {

            console.log("Joined room:", roomId);

            navigate(`/room/${roomId}`);

        };

        const handleRoomError = ({ message }) => {

            setError(message);

        };

        socket.on("room-created", handleRoomCreated);
        socket.on("room-joined", handleRoomJoined);
        socket.on("room-error", handleRoomError);

        return () => {

            socket.off("room-created", handleRoomCreated);
            socket.off("room-joined", handleRoomJoined);
            socket.off("room-error", handleRoomError);

        };

    }, [navigate]);

    return (

        <div>

            <h1>SyncWave Rooms</h1>

            <button onClick={createRoom}>
                Create Room
            </button>

            {createdRoom && (

                <div>

                    <h2>Your Room</h2>

                    <p>
                        Room Code: <strong>{createdRoom}</strong>
                    </p>

                    <p>
                        Share this code with your friends.
                    </p>

                </div>

            )}

            <hr />

            <h2>Join a Room</h2>

            <input
                type="text"
                placeholder="Enter room code"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
            />

            <button onClick={joinRoom}>
                Join Room
            </button>

            {error && (
                <p>{error}</p>
            )}

        </div>

    );

}

export default Room;