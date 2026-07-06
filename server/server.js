const songs = require("./data/songs");

const express = require("express");
const cors = require("cors");

const songRoutes = require("./routes/songRoutes");
const app = express();

app.use(cors());    

app.use("/api/songs", songRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});