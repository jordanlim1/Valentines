import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [revealedPhotos, setRevealedPhotos] = useState(new Set([0, 1, 2, 3])); // Track which photos have been revealed
  const [animatingPhoto, setAnimatingPhoto] = useState(null); // Track which photo is currently animating
  const [fullscreenPhoto, setFullscreenPhoto] = useState(null); // Track which photo is in fullscreen
  const audioRef = useRef(null);

  // Array of photo paths - using your actual photos!
  // Using base URL to work with GitHub Pages
  const baseUrl = import.meta.env.BASE_URL;
  const floatingPhotos = [
    `${baseUrl}IMG_1681.jpg`,
    `${baseUrl}IMG_0001.JPG`,
    `${baseUrl}IMG_2087.jpg`,
    `${baseUrl}IMG_2160.JPG`,
    `${baseUrl}IMG_4321.jpg`,
    `${baseUrl}IMG_4760.jpg`,
    `${baseUrl}IMG_5022.jpg`,
    `${baseUrl}IMG_1389.jpg`,
    `${baseUrl}IMG_5393.jpg`,
    `${baseUrl}IMG_5562.jpg`,
    `${baseUrl}IMG_7908.jpg`,
    `${baseUrl}IMG_6651.jpg`,
    `${baseUrl}IMG_6829.jpg`,
    `${baseUrl}IMG_8466.JPG`,
  ];

  const noButtonTexts = [
    "No",
    "Are you sure?",
    "Really sure?",
    "Oy",
    "Last chance",
    "You'll hurt my feelings 🥺",
    "Please? 🙂‍↔️",
    "Chill out big back",
    "Hit that yes rn 🫵",
    "Yo you're done 😡",
  ];

  // Auto-play music on first interaction
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay blocked, user needs to interact first
          });
      }
    };

    // Try to play on any user interaction
    document.addEventListener("click", playAudio, { once: true });
    document.addEventListener("touchstart", playAudio, { once: true });

    return () => {
      document.removeEventListener("click", playAudio);
      document.removeEventListener("touchstart", playAudio);
    };
  }, [isPlaying]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const openFullscreen = (photoUrl) => {
    setFullscreenPhoto(photoUrl);
  };

  const closeFullscreen = () => {
    setFullscreenPhoto(null);
  };

  const handleNoHover = () => {
    let newX, newY;
    let attempts = 0;
    const minDistance = 200; // Minimum distance in pixels from current position
    
    // Keep generating new positions until we find one far enough away
    do {
      newX = Math.random() * (window.innerWidth - 150);
      newY = Math.random() * (window.innerHeight - 80);
      attempts++;
      
      // Calculate distance from current position
      const distance = Math.sqrt(
        Math.pow(newX - noButtonPosition.x, 2) + 
        Math.pow(newY - noButtonPosition.y, 2)
      );
      
      // If far enough away or tried too many times, use this position
      if (distance > minDistance || attempts > 20) {
        break;
      }
    } while (true);

    setNoButtonPosition({ x: newX, y: newY });
    setNoHoverCount((prev) => {
      const newCount = Math.min(prev + 1, noButtonTexts.length - 1);

      // Reveal a new photo if available
      const nextPhotoIndex = 4 + prev; // Start revealing from photo #5 (index 4)
      if (
        nextPhotoIndex < floatingPhotos.length &&
        !revealedPhotos.has(nextPhotoIndex)
      ) {
        setRevealedPhotos(new Set([...revealedPhotos, nextPhotoIndex]));
        setAnimatingPhoto(nextPhotoIndex); // Mark this photo as animating
        
        // Remove animation class after animation completes
        setTimeout(() => {
          setAnimatingPhoto(null);
        }, 500); // Match the animation duration
      }

      return newCount;
    });
  };

  const handleYesClick = () => {
    setYesClicked(true);
    // Create confetti effect
    createConfetti();
  };

  const createConfetti = () => {
    const colors = ["#ff0000", "#ff69b4", "#ff1493", "#ffc0cb", "#ff69b4"];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confetti.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      document.body.appendChild(confetti);

      setTimeout(() => confetti.remove(), 4000);
    }
  };

  if (yesClicked) {
    return (
      <div className="container">
        {/* Audio player */}
        <audio ref={audioRef} loop>
          <source src={`${baseUrl}background-music.mp3`} type="audio/mpeg" />
        </audio>

        {/* Music control button */}
        <button className="music-toggle" onClick={toggleMusic}>
          {isPlaying ? "🔊" : "🔇"}
        </button>

        {/* Fullscreen photo overlay */}
        {fullscreenPhoto && (
          <div className="fullscreen-overlay" onClick={closeFullscreen}>
            <button className="fullscreen-close" onClick={closeFullscreen}>
              ✕
            </button>
            <img
              src={fullscreenPhoto}
              alt="Fullscreen"
              className="fullscreen-image"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Floating photos in background */}
        <div className="floating-photos">
          {floatingPhotos.map((photo, index) => {
            // Show all photos on success page
            return (
              <div
                key={index}
                className={`floating-photo photo-${index + 1} photo-visible photo-clickable`}
                style={{
                  animationDelay: `${index * 0.5}s`,
                }}
                onClick={() => openFullscreen(photo)}
              >
                <img src={photo} alt={`Memory ${index + 1}`} />
              </div>
            );
          })}
        </div>

        <div className="success-message">
          <h1 className="celebration">🎉 YAY! 🎉</h1>
          <p className="message">
            We're going to have an amazing Valentine's weekend! 🥰
          </p>
          <p className="message">I love you todo mucho 💕</p>
          <div className="heart-beat">❤️</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Audio player */}
      <audio ref={audioRef} loop>
        <source src={`${baseUrl}background-music.mp3`} type="audio/mpeg" />
      </audio>

      {/* Music control button */}
      <button className="music-toggle" onClick={toggleMusic}>
        {isPlaying ? "🔊" : "🔇"}
      </button>

      {/* Fullscreen photo overlay */}
      {fullscreenPhoto && (
        <div className="fullscreen-overlay" onClick={closeFullscreen}>
          <button className="fullscreen-close" onClick={closeFullscreen}>
            ✕
          </button>
          <img
            src={fullscreenPhoto}
            alt="Fullscreen"
            className="fullscreen-image"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floating photos in background */}
      <div className="floating-photos">
        {floatingPhotos.map((photo, index) => {
          const isVisible = revealedPhotos.has(index);
          const isAnimating = animatingPhoto === index;
          return (
            <div
              key={index}
              className={`floating-photo photo-${index + 1} ${
                isVisible ? "photo-visible" : "photo-hidden"
              } ${isAnimating ? "photo-popping" : ""} ${
                isVisible ? "photo-clickable" : ""
              }`}
              style={{
                animationDelay: `${index * 0.5}s`,
              }}
              onClick={isVisible ? () => openFullscreen(photo) : undefined}
            >
              <img src={photo} alt={`Memory ${index + 1}`} />
            </div>
          );
        })}
      </div>

      <div className="valentine-card">
        <div className="hearts-decoration">
          <span className="heart">💕</span>
          <span className="heart">💖</span>
          <span className="heart">💗</span>
          <span className="heart">💕</span>
        </div>

        <h1 className="title">Will you be my Valentine? 🌹</h1>

        <div className="cute-image">
          <div className="bear">🧸</div>
        </div>

        <div className="buttons-container">
          <button className="yes-button" onClick={handleYesClick}>
            Yes! 💖
          </button>

          <button
            className="no-button"
            onMouseEnter={handleNoHover}
            onTouchStart={handleNoHover}
            style={{
              position: noHoverCount > 0 ? "fixed" : "relative",
              left: noHoverCount > 0 ? `${noButtonPosition.x}px` : "auto",
              top: noHoverCount > 0 ? `${noButtonPosition.y}px` : "auto",
              transition: "all 0.3s ease",
              zIndex: noHoverCount > 0 ? 9999 : 100,
            }}
          >
            {noButtonTexts[noHoverCount]}
          </button>
        </div>

        <div className="hint-container">
          {noHoverCount > 3 && (
            <p className="hint">The "No" button is being a lil shy... 😊</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
