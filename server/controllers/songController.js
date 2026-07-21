const fs = require("fs");
const path = require("path");

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

    try {

        console.log("Body:");
        console.log(req.body);

        console.log("Files:");
        console.log(req.files);

        const { title, artist } = req.body;
        const songFile = req.files.song[0].filename;
        const coverFile = req.files.cover[0].filename;
        const file = `http://localhost:5000/songs/${songFile}`;
        const cover = `http://localhost:5000/covers/${coverFile}`;
        const duration = "0:00";

        await pool.query(
            `INSERT INTO songs
            (title, artist, duration, file_path, cover_path)
            VALUES ($1, $2, $3, $4, $5)`,
            [title, artist, duration, file, cover]
        );

        console.log(title);
        console.log(artist);
        console.log(songFile);
        console.log(coverFile);

        res.status(201).json({
            message: "Song uploaded successfully!"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });

    }

};


const deleteSong = async (req, res) => {

    try {

        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM songs WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {

            return res.status(404).json({
                message: "Song not found"
            });

        }

        const song = result.rows[0];

        console.log(song);

        const songPath = path.join(
            __dirname,
            "..",
            "public",
            "songs",
            path.basename(song.file_path)
        );

        const coverPath = path.join(
            __dirname,
            "..",
            "public",
            "covers",
            path.basename(song.cover_path)
        );

        console.log("Song Path:", songPath);
        console.log("Cover Path:", coverPath);

        if (fs.existsSync(songPath)) 
        {
            fs.unlinkSync(songPath);
        }

        if (fs.existsSync(coverPath)) 
        {
            fs.unlinkSync(coverPath);
        }

        console.log("Files deleted successfully!");

        await pool.query("DELETE FROM songs WHERE id = $1",[id]);

        console.log("Song deleted from database!");

        res.json({message: "Song deleted successfully!"});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: "Database Error"
        });
    }
};


module.exports = {
    getAllSongs,
    createSong,
    deleteSong,
};