import "./SongCard.css";

function SongCard({ song, onSelect }) {
  
  return (
    <div
    className="song-card"
    onClick={() => onSelect(song)}
    >
      <div className="song-cover">
        🎵
      </div>

      <div className="song-info">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>

      <button className="play-btn">
        ▶
      </button>
    </div>
  );
}

export default SongCard;