require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");


require("./config/db");

const songRoutes = require("./routes/songRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    },
});

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);

const rooms = new Map();

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Create a room
    socket.on("create-room", () => {

        const roomId = Math.random()
            .toString(36)
            .substring(2, 8)
            .toUpperCase();

        rooms.set(roomId, {
            host: socket.id,
            members: [socket.id],
        });

        socket.join(roomId);

        socket.roomId = roomId;

        socket.emit("room-created", {
            roomId,
        });

        console.log("Room created:", roomId);

    });

    // Join a room
    socket.on("join-room", (roomId) => {

        const room = rooms.get(roomId);

        if (!room) {

            socket.emit("room-error", {
                message: "Room not found",
            });

            return;

        }

        room.members.push(socket.id);

        socket.join(roomId);

        socket.roomId = roomId;

        io.to(roomId).emit("room-updated", {
            roomId,
            memberCount: room.members.length,
        });

        socket.emit("room-joined", {
            roomId,
        });

        console.log(
            "User",
            socket.id,
            "joined room",
            roomId
        );

    });

    // Disconnect
    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

        const roomId = socket.roomId;

        if (!roomId) {
            return;
        }

        const room = rooms.get(roomId);

        if (!room) {
            return;
        }

        room.members = room.members.filter(
            (memberId) => memberId !== socket.id
        );

        // If host leaves, remove the room for now
        if (room.host === socket.id) {

            rooms.delete(roomId);

            io.to(roomId).emit("room-closed");

            return;

        }

        // If no members remain, remove room
        if (room.members.length === 0) {

            rooms.delete(roomId);

            return;

        }

        io.to(roomId).emit("room-updated", {
            roomId,
            memberCount: room.members.length,
        });

    });

});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});