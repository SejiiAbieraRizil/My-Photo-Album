import { useState } from "react";
import {
  Images,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "./Icons";

function AlbumCard({ album, onOpen, onRename, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <article className="album-card">
      <button
        type="button"
        className="album-image album-open-button"
        onClick={() => onOpen(album)}
        aria-label={`Open ${album.title}`}
      >
        <img src={album.image} alt={album.title} />
        <span className="photo-count">
          <Images size={14} />
          {album.count} Photos
        </span>
      </button>

      <div className="album-info">
        <div>
          <h3>{album.title}</h3>
          <p>{album.date}</p>
        </div>
        <div className="album-menu-wrap">
          <button
            type="button"
            className="icon-button"
            aria-label={`Options for ${album.title}`}
            aria-expanded={showMenu}
            onClick={() => setShowMenu((current) => !current)}
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className="album-menu">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onRename(album);
                }}
              >
                <Pencil size={15} />
                Rename
              </button>
              <button
                type="button"
                className="danger-menu-item"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(album);
                }}
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default AlbumCard;