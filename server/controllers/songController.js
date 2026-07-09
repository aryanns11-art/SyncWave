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

module.exports = {
    getAllSongs,
};