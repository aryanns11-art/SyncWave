const path = require("path");

const songs = require("./data/songs");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const songRoutes = require("./routes/songRoutes");


app.use(cors());    

app.use("/api/songs", songRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});