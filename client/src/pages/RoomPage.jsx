import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import socket from "../socket";

function RoomPage() {

    const { roomId } = useParams();

    const navigate = useNavigate();

    const [memberCount, setMemberCount] = useState(0);
    const [isHost, setIsHost] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const handleRoomState = ({
            roomId: stateRoomId,
            memberCount,
            isHost
        }) => {

            if (stateRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);
            setIsHost(isHost);

        };

        const handleRoomUpdated = ({
            roomId: updatedRoomId,
            memberCount
        }) => {

            if (updatedRoomId !== roomId) {
                return;
            }

            setMemberCount(memberCount);

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
        socket.on("room-error", handleRoomError);
        socket.on("room-closed", handleRoomClosed);

        // Ask server for the current room state
        socket.emit("get-room-state", roomId);

        return () => {

            socket.off("room-state", handleRoomState);
            socket.off("room-updated", handleRoomUpdated);
            socket.off("room-error", handleRoomError);
            socket.off("room-closed", handleRoomClosed);

        };

    }, [roomId, navigate]);

    const leaveRoom = () => {

        socket.emit("leave-room", roomId);

        navigate("/rooms");

    };

    return (

        <div className="room-page">

            <h1>SyncWave Room</h1>

            <h2>{roomId}</h2>

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

            <button onClick={leaveRoom}>
                Leave Room
            </button>

        </div>

    );

}

export default RoomPage;