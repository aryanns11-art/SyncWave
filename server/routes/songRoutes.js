const authorizeRole = require("../middlewares/roleMiddleware");
const authenticateToken = require("../middlewares/authMiddleware");

const express = require("express");

const router = express.Router();

const upload = require("../middlewares/upload");

const {getAllSongs,createSong,deleteSong,} = require("../controllers/songController");
router.get("/", getAllSongs);

router.post(
    "/",
    authenticateToken,
    authorizeRole("admin"),
    upload.fields([
        { name: "song", maxCount: 1 },
        { name: "cover", maxCount: 1 }
    ]),
    createSong
);

router.delete(
    "/:id",
    authenticateToken,
    authorizeRole("admin"),
    deleteSong
);
module.exports = router;