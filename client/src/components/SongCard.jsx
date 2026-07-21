import "./SongCard.css";

function SongCard({ song, onSelect, onDelete, isCurrent }) {
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

      <div className="song-actions">

            <button className="play-btn">
              ▶
            </button>

            <button
              className="delete-btn"
              onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
              }}
          >
              🗑
          </button>

      </div>
      
    </div>
  );
}

export default SongCard;