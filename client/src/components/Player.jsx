import "./Player.css";

function Player({ currentSong, isPlaying, onToggle })
{
    return  (
        <div className="player">

            <div className="player-info">

                <h2>
                    {currentSong ? currentSong.title : "No Song Selected"}
                </h2>

                <p>
                    {currentSong ? currentSong.artist : ""}
                </p>

            </div>

            <div className="player-controls">

                <button>⏮</button>

                <button onClick={onToggle}>
                    {isPlaying ? "⏸" : "▶"}
                </button>

                <button>⏭</button>

            </div>

        </div>
    );
}

export default Player;