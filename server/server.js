const path = require("path");

const express = require("express");
const cors = require("cors");

require("./config/db");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const songRoutes = require("./routes/songRoutes");

app.use("/api/songs", songRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});