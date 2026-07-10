const pool = require("../config/db");

const getAllSongs = async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                id,
                title,
                artist,
                duration,
                file_path AS file,
                cover_path AS cover
            FROM songs
            ORDER BY id
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};



const createSong = async (req, res) => {

    console.log("Body:");
    console.log(req.body);

    console.log("Files:");
    console.log(req.files);

    const { title, artist } = req.body;

    const songFile = req.files.song[0].filename;

    const coverFile = req.files.cover[0].filename;

    console.log(title);
console.log(artist);
console.log(songFile);
console.log(coverFile);

    res.json({
        message: "Create Song API Working!"
    });

};

module.exports = {
    getAllSongs,
    createSong,
};