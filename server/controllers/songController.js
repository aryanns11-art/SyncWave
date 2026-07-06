const songs = require("../data/songs");

const getAllSongs = (req, res) => {
    res.json(songs);
};

module.exports = {
    getAllSongs,
};