import { Heart } from "./Icons";

function PhotoCard({ photo }) {
  return (
    <article className="photo-card">
      <div className="photo-image">
        <img src={photo.image} alt={photo.title} />
        <button
          className="photo-heart"
          aria-label={`Favorite ${photo.title}`}
        >
          <Heart size={17} />
        </button>
      </div>
      <div className="photo-info">
        <h4>{photo.title}</h4>
        <p>{photo.date}</p>
      </div>
    </article>
  );
}

export default PhotoCard;