
import { useEffect, useRef, useState } from "react";

import {
  ArrowRight,
  Images,
  ImagePlus,
  Share2,
  Plus,
  Heart,
  Pencil,
  Trash2,
  ArrowLeft,
} from "./assets/components/Icons";

import Sidebar from "./assets/components/Sidebar";
import Topbar from "./assets/components/Topbar";
import AlbumCard from "./assets/components/AlbumCard";
import PhotoCard from "./assets/components/PhotoCard";

import "./App.css";

// ALBUM DATA
const initialAlbums = [
  {
    id: 1,
    title: "Travel Memories",
    date: "Summer 2026",
    count: 24,
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700",
  },
  {
    id: 2,
    title: "Beautiful Moments",
    date: "January – March 2026",
    count: 18,
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=700",
  },
  {
    id: 3,
    title: "Nature & Life",
    date: "December 2025",
    count: 32,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700",
  },
];

// PHOTO DATA
const photos = [
  {
    id: 1,
    title: "Golden Sunset",
    date: "November 12, 2026",
    image:
      "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=700",
  },
  {
    id: 2,
    title: "Mountain Escape",
    date: "November 10, 2026",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700",
  },
  {
    id: 3,
    title: "Peaceful Morning",
    date: "November 8, 2026",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=700",
  },
  {
    id: 4,
    title: "Little Adventures",
    date: "November 5, 2026",
    image:
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=700",
  },
];

// MAIN APPLICATION
function App() {
  // ALBUM STATES
  const [albums, setAlbums] = useState(initialAlbums);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [albumTitle, setAlbumTitle] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [selectedAlbumId, setSelectedAlbumId] = useState(null);
  const [albumToRename, setAlbumToRename] = useState(null);
  const [renameTitle, setRenameTitle] = useState("");
  const [albumToDelete, setAlbumToDelete] = useState(null);
  const [albumError, setAlbumError] = useState("");
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const photoInputRef = useRef(null);
  const photoUrlsRef = useRef([]);

  const selectedAlbum = albums.find(
    (album) => album.id === selectedAlbumId
  );
  const selectedAlbumPhotos = uploadedPhotos.filter(
    (photo) => photo.albumId === selectedAlbumId
  );

  useEffect(
    () => () => {
      photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    []
  );

  // CREATE ALBUM FUNCTION
  function handleCreateAlbum(event) {
    event.preventDefault();

    if (!albumTitle.trim()) {
      setAlbumError("Please enter an album name.");
      return;
    }

    const newAlbum = {
      id: Date.now(),
      title: albumTitle.trim(),
      date: new Date().toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
      count: 0,
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=700",
      description: albumDescription.trim(),
    };

    setAlbums((currentAlbums) => [
      ...currentAlbums,
      newAlbum,
    ]);

    // RESET FORM
    setAlbumTitle("");
    setAlbumDescription("");
    setAlbumError("");
    setShowCreateForm(false);
  }

  function handleOpenAlbum(album) {
    setSelectedAlbumId(album.id);
  }

  function handleStartRename(album) {
    setAlbumToRename(album);
    setRenameTitle(album.title);
  }

  function handleRenameAlbum(event) {
    event.preventDefault();

    const nextTitle = renameTitle.trim();
    if (!nextTitle) {
      return;
    }

    setAlbums((currentAlbums) =>
      currentAlbums.map((album) =>
        album.id === albumToRename.id
          ? { ...album, title: nextTitle }
          : album
      )
    );
    setAlbumToRename(null);
    setRenameTitle("");
  }

  function handleDeleteAlbum() {
    const deletedAlbumPhotos = uploadedPhotos.filter(
      (photo) => photo.albumId === albumToDelete.id
    );
    deletedAlbumPhotos.forEach((photo) => URL.revokeObjectURL(photo.image));
    photoUrlsRef.current = photoUrlsRef.current.filter(
      (url) => !deletedAlbumPhotos.some((photo) => photo.image === url)
    );
    setUploadedPhotos((currentPhotos) =>
      currentPhotos.filter((photo) => photo.albumId !== albumToDelete.id)
    );
    setAlbums((currentAlbums) =>
      currentAlbums.filter((album) => album.id !== albumToDelete.id)
    );

    if (selectedAlbumId === albumToDelete.id) {
      setSelectedAlbumId(null);
    }

    setAlbumToDelete(null);
  }

  function handlePhotoSelection(event) {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 10 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setUploadError("Only image files up to 10 MB can be added.");
    } else {
      setUploadError("");
    }

    if (!validFiles.length || !selectedAlbum) {
      event.target.value = "";
      return;
    }

    const newPhotos = validFiles.map((file, index) => {
      const image = URL.createObjectURL(file);
      photoUrlsRef.current.push(image);
      return {
        id: `${Date.now()}-${index}`,
        albumId: selectedAlbum.id,
        title: file.name.replace(/\.[^/.]+$/, ""),
        date: new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
        image,
      };
    });

    setUploadedPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);
    setAlbums((currentAlbums) =>
      currentAlbums.map((album) =>
        album.id === selectedAlbum.id
          ? {
              ...album,
              count: album.count + newPhotos.length,
              image: album.count === 0 ? newPhotos[0].image : album.image,
            }
          : album
      )
    );
    event.target.value = "";
  }

  return (
    <div className="app-container" id="home">

      {/* SIDEBAR */}
      <Sidebar />

      <main className="main-content">

        {/* TOPBAR */}
        <Topbar />

        {selectedAlbum ? (
          <section className="album-view">
            <button
              type="button"
              className="back-button"
              onClick={() => setSelectedAlbumId(null)}
            >
              <ArrowLeft size={16} />
              Back to albums
            </button>

            <div className="album-view-header">
              <div>
                <p className="eyebrow">{selectedAlbum.date}</p>
                <h1>{selectedAlbum.title}</h1>
                <p className="welcome-description">
                  {selectedAlbum.description ||
                    "A collection of moments worth remembering."}
                </p>
              </div>
              <div className="album-view-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <ImagePlus size={15} />
                  Add Photos
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleStartRename(selectedAlbum)}
                >
                  <Pencil size={15} />
                  Rename Album
                </button>
              </div>
            </div>

            <input
              ref={photoInputRef}
              className="visually-hidden"
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoSelection}
            />

            {uploadError && (
              <p className="upload-error" role="alert">
                {uploadError}
              </p>
            )}

            {selectedAlbum.count === 0 ? (
              <div className="empty-album">
                <div className="empty-album-icon">
                  <ImagePlus size={28} />
                </div>
                <h2>This album is ready for memories</h2>
                <p>Add your first photo to begin this collection.</p>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => photoInputRef.current?.click()}
                >
                  <ImagePlus size={16} />
                  Add Photos
                </button>
              </div>
            ) : (
              <div className="album-view-grid">
                {(selectedAlbumPhotos.length
                  ? selectedAlbumPhotos
                  : photos.slice(0, selectedAlbum.count)
                ).map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
        {/* WELCOME SECTION */}
        <section className="welcome-section">
          <div>
            <p className="eyebrow">
              YOUR PERSONAL COLLECTION
            </p>

            <h1>Every picture tells a story.</h1>

            <p className="welcome-description">
              A little space for all the moments worth remembering.
            </p>
          </div>

          <a href="#albums" className="primary-button">
            Explore Albums
            <ArrowRight size={17} />
          </a>
        </section>

        {/* STATISTICS */}
        <section className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">
              <Images size={21} />
            </div>

            <div>
              <span>Total Albums</span>
              <h2>
                {albums.length.toString().padStart(2, "0")}
              </h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <ImagePlus size={21} />
            </div>

            <div>
              <span>Total Photos</span>
              <h2>74</h2>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Share2 size={21} />
            </div>

            <div>
              <span>Shared Albums</span>
              <h2>02</h2>
            </div>
          </div>

        </section>

        {/* MY ALBUMS */}
        <section className="content-section" id="albums">

          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>

              <h2>My Albums</h2>

              <p className="section-description">
                Collections of moments you never want to forget.
              </p>
            </div>

            <a href="#photos" className="text-link">
              View all
              <ArrowRight size={16} />
            </a>
          </div>

          {/* ALBUM GRID */}
          <div className="album-grid">

            {albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onOpen={handleOpenAlbum}
                onRename={handleStartRename}
                onDelete={setAlbumToDelete}
              />
            ))}

            {/* CREATE ALBUM BUTTON */}
            <button
              type="button"
              className="create-album-card"
              onClick={() => setShowCreateForm(true)}
            >
              <div className="create-icon">
                <Plus size={26} />
              </div>

              <h3>Create New Album</h3>

              <p>Start collecting new memories</p>
            </button>

          </div>

          {/* CREATE ALBUM MODAL */}
          {showCreateForm && (
            <div className="modal-overlay">

              <div className="modal-content">

                <h2>Create New Album</h2>

                <p>
                  Start collecting your favorite memories.
                </p>

                <form onSubmit={handleCreateAlbum}>

                  <label>Album Name</label>

                  <input
                    type="text"
                    placeholder="Enter album name"
                    value={albumTitle}
                    onChange={(event) => {
                      setAlbumTitle(event.target.value);
                      if (albumError) setAlbumError("");
                    }}
                    required
                  />
                  {albumError && (
                    <p className="form-error" role="alert">
                      {albumError}
                    </p>
                  )}

                  <label>Description</label>

                  <textarea
                    placeholder="Write a short description..."
                    value={albumDescription}
                    onChange={(event) =>
                      setAlbumDescription(event.target.value)
                    }
                  />

                  <div className="modal-actions">

                    <button
                      type="button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setAlbumTitle("");
                        setAlbumDescription("");
                        setAlbumError("");
                      }}
                    >
                      Cancel
                    </button>

                    <button type="submit">
                      Create Album
                    </button>

                  </div>

                </form>

              </div>

            </div>
          )}

        </section>

        {/* RECENT PHOTOS */}
        <section
          className="content-section recent-section"
          id="photos"
        >

          <div className="section-heading">
            <div>
              <p className="eyebrow">RECENTLY ADDED</p>

              <h2>Recent Photos</h2>

              <p className="section-description">
                Take another look at your favorite moments.
              </p>
            </div>

            <a href="#photos" className="text-link">
              See all
              <ArrowRight size={16} />
            </a>
          </div>

          <div className="photo-grid">

            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
              />
            ))}

          </div>

        </section>
          </>
        )}

        {albumToRename && (
          <div className="modal-overlay">
            <div className="modal-content" role="dialog" aria-modal="true">
              <h2>Rename Album</h2>
              <p>Give this collection a new name.</p>
              <form onSubmit={handleRenameAlbum}>
                <label htmlFor="rename-album-title">Album Name</label>
                <input
                  id="rename-album-title"
                  type="text"
                  value={renameTitle}
                  onChange={(event) => setRenameTitle(event.target.value)}
                  required
                  autoFocus
                />
                <div className="modal-actions">
                  <button
                    type="button"
                    onClick={() => setAlbumToRename(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit">Save Name</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {albumToDelete && (
          <div className="modal-overlay">
            <div
              className="modal-content confirmation-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-album-title"
            >
              <div className="confirmation-icon">
                <Trash2 size={22} />
              </div>
              <h2 id="delete-album-title">Delete album?</h2>
              <p>
                “{albumToDelete.title}” will be removed from your collection.
                This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setAlbumToDelete(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="danger-button"
                  onClick={handleDeleteAlbum}
                >
                  Delete Album
                </button>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="footer">
          Made with care for the memories that matter.
          <Heart size={14} />
        </footer>

      </main>
    </div>
  );
}

export default App;
