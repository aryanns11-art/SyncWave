const multer = require("multer");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

    if (file.mimetype.startsWith("audio")) {

        cb(null, "public/songs");

    } else {

        cb(null, "public/covers");

    }

},

    filename: function (req, file, cb) {

    cb(null, Date.now() + "-" + file.originalname);

},

});

{/*Create a Multer middleware that uses the storage rules we just defined. */}
const upload = multer({
    storage: storage,
});

module.exports = upload;