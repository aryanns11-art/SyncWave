import { useEffect, useState } from "react";
import SongCard from "./components/SongCard";

function App() {

    const [songs, setSongs] = useState([]);

    useEffect(() => {

        fetch("http://localhost:5000/api/songs")
            .then((response) => response.json())
            .then((data) => {
                setSongs(data);
            });

    }, []);

    return (
        <div className="App">

        <h1>🎵 SyncWave</h1>

        {songs.map((song)=>(
            <SongCard

                key={song.id}

                song={song}
            />
        ))}

    </div>
);

}

export default App;