import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete, duration = 3000, fadeDuration = 1000 }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Aguarda o tempo do loading antes de começar o fade
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  useEffect(() => {
      if (!fadeOut) return;

      const fadeTimer = setTimeout(onComplete, fadeDuration);
      return () => clearTimeout(fadeTimer);
  }, [fadeOut]);

  return (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-1000 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}
  >
    <div className="simple-loader-content flex flex-col items-center">
      <img
        src="/logo/logo.png"
        alt="Logo"

      />
      <div className="simple-loader-logo">
        <br/>
      </div>
      <div className="simple-loader-spinner mt-4" />
      <p className="simple-loader-text text-white mt-2">Loading...</p>
    </div>
      <style>{`
        .simple-loader-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          opacity: 1;
          transition: opacity ${fadeDuration}ms ease;
        }

        .simple-loader-overlay.fade-out {
          opacity: 0;
        }

        .simple-loader-content {
          text-align: center;
          color: white;
        }

        .simple-loader-logo h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 2rem;
          background: linear-gradient(45deg, #ff00ff, #00ffff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .simple-loader-spinner {
        position: relative;
        width: 60px;
        height: 60px;
        margin: 0 auto 1rem;
        }

        .simple-loader-spinner::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        padding: 3px;
        background: conic-gradient(
            #00ffff,
            #ff00ff,
            #00ffff
        );
        mask:
            radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%);
        -webkit-mask:
            radial-gradient(farthest-side, transparent calc(100% - 3px), black 100%);
        animation: spin 1s linear infinite;
        }

        @keyframes spin {
        to {
            transform: rotate(360deg);
        }
        }

        .simple-loader-text {
          font-size: 1rem;
          opacity: 0.7;
        }

        @keyframes simple-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
