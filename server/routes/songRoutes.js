const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const { getAllSongs, createSong } = require("../controllers/songController");
router.get("/", getAllSongs);

router.post(
    "/",
    upload.fields([                             
        { name: "song", maxCount: 1 },
        { name: "cover", maxCount: 1 },
    ]),
    createSong
);  

module.exports = router;