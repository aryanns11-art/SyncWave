const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const songs = [
    {
        id: 1,
        title: "Believer",
        artist: "Imagine Dragons"
    },
    {
        id: 2,
        title: "Perfect",
        artist: "Ed Sheeran"
    },
    {
        id: 3,
        title: "Faded",
        artist: "Alan Walker"
    }
];

app.get("/api/songs", (req, res) => {
    res.json(songs);
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});