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

try{
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
    }
    catch (err) {
            console.error(err);

            res.status(500).json({
                message: "Database Error"
            });
        }
};


module.exports = {
    getAllSongs,
    createSong,
};