import "./Player.css";

function Player({ currentSong, isPlaying, onToggle, currentTime, duration , onSeek , onNext, onPrevious, volume, onVolumeChange,controlsDisabled = false, })
{
    const formatTime = (time) => {

    if (isNaN(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

        return (
        <div className="player">

            <div className="player-left">

                {currentSong && (
                    <img
                        src={currentSong.cover}
                        alt={currentSong.title}
                        className="player-cover"
                    />
                )}

                <div className="song-details">

                    <h2>
                        {currentSong ? currentSong.title : "No Song Selected"}
                    </h2>

                    <p>
                        {currentSong ? currentSong.artist : ""}
                    </p>

                </div>

            </div>
            

            <div className="player-center">

                <div className="player-controls">

                    <button onClick={onPrevious} disabled={controlsDisabled}>⏮</button>

                    <button onClick={onToggle} disabled={controlsDisabled}>
                        {isPlaying ? "⏸" : "▶"}
                    </button>

                    <button onClick={onNext} disabled={controlsDisabled}>⏭</button>

                </div>

                <div className="progress-container">

                    <span>{formatTime(currentTime)}</span>

                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime}
                        onChange={onSeek}
                        disabled={controlsDisabled}
                    />

                    <span>{formatTime(duration)}</span>

                </div>

            </div>

            <div className="player-right">

                <span>🔉</span>

                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={onVolumeChange}
                    disabled={controlsDisabled}
                />

                <span>🔊</span>

            </div>

        </div>
    );

}

export default Player;