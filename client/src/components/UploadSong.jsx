import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UploadSong.css";

function UploadSong() {

    const [title, setTitle] = useState("");

    const [artist, setArtist] = useState("");

    const [song, setSong] = useState(null);

    const [cover, setCover] = useState(null);

    const navigate = useNavigate();

    const handleUpload = async () => {

    const formData = new FormData();

    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("song", song);
    formData.append("cover", cover);

    try {

        const response = await fetch("http://localhost:5000/api/songs", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        alert(data.message);
        navigate("/");

    } 
    catch (error) {

        console.error(error);

        alert("Upload Failed!");

    }
};

    return (
        <div className="upload-container">

            <h2>Upload New Song</h2>

            <input
                type="text"
                placeholder="Song Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <br /><br />

            <input
                type="text"
                placeholder="Artist"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
            />

            <br /><br />

            <label>Cover Image</label>

            <br />

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])}
            />

            <br /><br />

            <label>Song File</label>

            <br />

            <input
                type="file"
                accept=".mp3"
                onChange={(e) => setSong(e.target.files[0])}
            />

            <br /><br />

        <button className="upload-btn" onClick={handleUpload}>
          Upload Song
        </button>

        </div>
    );

}

export default UploadSong;