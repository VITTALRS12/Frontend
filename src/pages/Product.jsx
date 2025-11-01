import React, { useState, useEffect } from 'react';
import './Product.css';

export default function Product() {
  const [showSplash, setShowSplash] = useState(true);
  const [showProducts, setShowProducts] = useState(false);

  useEffect(() => {
    // Play sound
    const audio = new Audio("https://www.soundjay.com/human/sounds/applause-8.mp3");
    audio.play();

    // Create confetti
    const splash = document.querySelector(".splash-screen");
    if (splash) {
      for (let i = 0; i < 30; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");
        confetti.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = `${Math.random() * 100}%`;
        confetti.style.animationDelay = `${Math.random()}s`;
        splash.appendChild(confetti);
      }

      // Create stickers
      const stickers = ["✨", "🎉", "🎈"];
      stickers.forEach((emoji, idx) => {
        const sticker = document.createElement("div");
        sticker.className = "sticker";
        sticker.textContent = emoji;
        sticker.style.left = `${30 + idx * 15}%`;
        sticker.style.top = "60%";
        splash.appendChild(sticker);
      });
    }

    // Timers for hiding splash and showing products
    const splashTimeout = setTimeout(() => {
      setShowSplash(false);
    }, 3500);

    const productsTimeout = setTimeout(() => {
      setShowProducts(true);
    }, 4000);

    return () => {
      clearTimeout(splashTimeout);
      clearTimeout(productsTimeout);
    };
  }, []);

  return (
    <div className="product-page">
      {showSplash && (
        <div className="splash-screen">
          <div className="circle">
            <h1 className="splash-text">Zoocart</h1>
          </div>
        </div>
      )}

      {showProducts && (
        <div className="product-list fade-in">
          <h2>Explore Our Products</h2>
          <ul>
            <li>Exciting Product A</li>
            <li>Amazing Product B</li>
            <li>Exclusive Product C</li>
          </ul>
        </div>
      )}
    </div>
  );
}
