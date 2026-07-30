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

io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {

        console.log("User disconnected:", socket.id);

    });

});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});