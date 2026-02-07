import { useState } from "react";
import "./App.css";

function App() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const [noHoverCount, setNoHoverCount] = useState(0);

  // Array of photo paths - using your actual photos!
  const floatingPhotos = [
    "/IMG_1389.jpg",
    "/IMG_1681.jpg",
    "/IMG_2087.jpg",
    "/IMG_2160.JPG",
    "/IMG_4321.jpg",
    "/IMG_4760.jpg",
    "/IMG_5022.jpg",
    "/IMG_5393.jpg",
    "/IMG_5562.jpg",
    "/IMG_6651.jpg",
    "/IMG_6829.jpg",
    "/IMG_8466.JPG",
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

  const handleNoHover = () => {
    const newX = Math.random() * (window.innerWidth - 150);
    const newY = Math.random() * (window.innerHeight - 80);

    setNoButtonPosition({ x: newX, y: newY });
    setNoHoverCount((prev) => Math.min(prev + 1, noButtonTexts.length - 1));
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
        {/* Floating photos in background */}
        <div className="floating-photos">
          {floatingPhotos.map((photo, index) => (
            <div
              key={index}
              className={`floating-photo photo-${index + 1}`}
              style={{
                animationDelay: `${index * 0.5}s`,
              }}
            >
              <img src={photo} alt={`Memory ${index + 1}`} />
            </div>
          ))}
        </div>

        <div className="success-message">
          <h1 className="celebration">🎉 YAY! 🎉</h1>
          <p className="message">
            We're going to have an amazing Valentine's weekend! 🥰
          </p>
          <p className="message">I love you 💕</p>
          <div className="heart-beat">❤️</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Floating photos in background */}
      <div className="floating-photos">
        {floatingPhotos.map((photo, index) => (
          <div
            key={index}
            className={`floating-photo photo-${index + 1}`}
            style={{
              animationDelay: `${index * 0.5}s`,
            }}
          >
            <img src={photo} alt={`Memory ${index + 1}`} />
          </div>
        ))}
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
            <p className="hint">
              The "No" button is being a lil shy... 😊
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
