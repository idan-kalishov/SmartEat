import React from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: 1000,
      }}
    >
      {/* Full-Screen GIF */}
      <img
        src="/gifs/mascot-running.gif" // Absolute path to your GIF (from public folder)
        alt="Mascot Running"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw", // Full width of the viewport
          height: "100vh", // Full height of the viewport
          objectFit: "cover", // Ensures the GIF covers the entire screen without distortion
        }}
      />

      {/* Loading Message */}
      <div
        className="pulsating-text"
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          color: "white",
          fontSize: "24px",
          fontWeight: "bold",
          textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
          zIndex: 2,
        }}
      >
        {message}
      </div>
    </div>
  );
};

export default LoadingScreen;
