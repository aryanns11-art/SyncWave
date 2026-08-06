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

    socket.on("get-room-state", (roomId) => {

        const room = rooms.get(roomId);

        if (!room) {

            socket.emit("room-error", {
                message: "Room not found",
            });

            return;
        }

        socket.emit("room-state", {
            roomId,
            memberCount: room.members.length,
            isHost: room.host === socket.id,
            currentSong: room.currentSong,
            isPlaying: room.isPlaying,
            currentTime: room.currentTime,
        });

    });

    socket.on("create-room", () => {

        let roomId;

        // Generate a unique room ID
        do {

            roomId = Math.random()
                .toString(36)
                .substring(2, 8)
                .toUpperCase();

        } while (rooms.has(roomId));


        // Create room
        rooms.set(roomId, {
            host: socket.id,
            members: [socket.id],
            currentSong: null,
            isPlaying: false,
            currentTime: 0,
        });


        // Join Socket.IO room
        socket.join(roomId);

        // Store room ID on socket
        socket.roomId = roomId;


        // Tell creator
        socket.emit("room-created", {

            roomId,

            memberCount: 1,

            isHost: true,

        });


        console.log("Room created:", roomId);

    });


    socket.on("join-room", (roomId) => {

        const room = rooms.get(roomId);


        // Room doesn't exist
        if (!room) {

            socket.emit("room-error", {

                message: "Room not found",

            });

            return;

        }


        // Prevent duplicate membership
        if (!room.members.includes(socket.id)) {

            room.members.push(socket.id);

        }


        // Join Socket.IO room
        socket.join(roomId);

        // Store room ID on socket
        socket.roomId = roomId;


        // Tell everyone in the room
        io.to(roomId).emit("room-updated", {

            roomId,

            memberCount: room.members.length,

        });


        // Tell the joining user
        socket.emit("room-joined", {

            roomId,

            memberCount: room.members.length,

            isHost: room.host === socket.id,

        });


        console.log(
            "User",
            socket.id,
            "joined room",
            roomId
        );

    });


    socket.on("leave-room", (roomId) => {

        const room = rooms.get(roomId);


        if (!room) {

            return;

        }


        // Remove user from room
        room.members = room.members.filter(
            (memberId) => memberId !== socket.id
        );


        // Leave Socket.IO room
        socket.leave(roomId);

        // Remove room reference
        socket.roomId = null;


        // If host leaves
        if (room.host === socket.id) {

            rooms.delete(roomId);

            // Notify remaining members
            io.to(roomId).emit("room-closed");

            console.log(
                "Room closed because host left:",
                roomId
            );

            return;

        }


        // If no members remain
        if (room.members.length === 0) {

            rooms.delete(roomId);

            console.log(
                "Empty room deleted:",
                roomId
            );

            return;

        }


        // Update remaining members
        io.to(roomId).emit("room-updated", {

            roomId,

            memberCount: room.members.length,

        });


        console.log(
            "User",
            socket.id,
            "left room",
            roomId
        );

    });


    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );


        const roomId = socket.roomId;


        // User wasn't in a room
        if (!roomId) {

            return;

        }


        const room = rooms.get(roomId);


        if (!room) {

            return;

        }


        // Remove user
        room.members = room.members.filter(
            (memberId) => memberId !== socket.id
        );


        // If disconnected user was host
        if (room.host === socket.id) {

            rooms.delete(roomId);

            io.to(roomId).emit("room-closed");

            console.log(
                "Room closed because host disconnected:",
                roomId
            );

            return;

        }

        // If room becomes empty
        if (room.members.length === 0) {

            rooms.delete(roomId);

            console.log(
                "Empty room deleted:",
                roomId
            );

            return;

        }

        // Notify remaining members
        io.to(roomId).emit("room-updated", {

            roomId,

            memberCount: room.members.length,

        });


        console.log(
            "User disconnected from room:",
            roomId
        );

    });

    socket.on("select-song", ({ roomId, song }) => {

        const room = rooms.get(roomId);
        
        if (!room) {
            return;
        }
    
        // Only the host can control the room's song
        if (room.host !== socket.id) {
            socket.emit("room-error", {
                message: "Only the host can change the song."
            });
        
            return;
        }
    
        room.currentSong = song;
        room.currentTime = 0;
        room.isPlaying = false;
    
        socket.to(roomId).emit("room-song-changed", {
            song,
        });
    
    });

    socket.on("toggle-play", ({ roomId, isPlaying }) => {

    const room = rooms.get(roomId);

        if (!room) {
            return;
        }

        // Only host controls playback
        if (room.host !== socket.id) {
            return;
        }

        room.isPlaying = isPlaying;

        socket.to(roomId).emit("room-toggle-play", {
            isPlaying,
        });

    });


    socket.on("next-song", ({ roomId, song }) => {

        const room = rooms.get(roomId);

        if (!room) return;

        if (room.host !== socket.id) return;

        room.currentSong = song;
        room.currentTime = 0;
        room.isPlaying = true;

        socket.to(roomId).emit("room-song-changed", {
            song,
        });

    });


    socket.on("previous-song", ({ roomId, song }) => {

        const room = rooms.get(roomId);

        if (!room) return;

        if (room.host !== socket.id) return;

        room.currentSong = song;
        room.currentTime = 0;
        room.isPlaying = true;

        socket.to(roomId).emit("room-song-changed", {
            song,
        });

    });


});

server.listen(5000, () => {

    console.log("Server running on port 5000");

});