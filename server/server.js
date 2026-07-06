const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
    res.send("SyncWave Backend Running");
});

app.get("/api/message", (req, res) => {
    res.json({
        message: "Hello from Backend 🚀"
    });
});

app.listen(5000, () => {
    console.log("Server running");
});