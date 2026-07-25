require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

require("./config/db");

const songRoutes = require("./routes/songRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/songs", songRoutes);
app.use("/api/auth", authRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});