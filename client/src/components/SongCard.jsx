import "./SongCard.css";

function SongCard({ song, onSelect ,isCurrent }) {
  return (
    <div
    className={`song-card ${isCurrent ? "active" : ""}`}
    onClick={() => onSelect(song)}
    >
      <div className="song-cover">
        <img src={song.cover} alt={song.title} />
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