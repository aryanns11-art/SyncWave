import { useEffect, useState } from "react";

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
        <div>

            <h1>🎵 SyncWave</h1>

            {
                songs.map((song) => (

                    <div key={song.id}>

                        <h2>{song.title}</h2>

                        <p>{song.artist}</p>

                    </div>

                ))
            }

        </div>
    );
}

export default App;