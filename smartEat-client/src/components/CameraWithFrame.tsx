import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { analyzeFoodImage } from "../utils/mealAnalysisApi";
import { base64ToFile } from "../utils/base64ToFile";

function CameraWithFrameAndLoading() {
  const webcamRef = useRef<Webcam>(null);
  const [isIdentifying, setIsIdentifying] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false); // State to track full-screen mode
  const navigate = useNavigate();

  const capture = async () => {
    setIsIdentifying(true); // Start identifying
    setIsFullScreen(true); // Enable full-screen mode

    if (webcamRef.current) {
      try {
        const imageSrc = webcamRef.current.getScreenshot(); // Capture image as base64
        if (!imageSrc) {
          throw new Error("Failed to capture image.");
        }

        const imageFile = await base64ToFile(
          imageSrc,
          "image.jpg",
          "image/jpeg"
        );

        // Send the image to the backend
        const results = await analyzeFoodImage(imageFile);

        // Navigate to the results page with the response data
        navigate("/results", { state: results });
      } catch (error) {
        alert(
          error instanceof Error
            ? error.message
            : "An error occurred while processing the image."
        );
      } finally {
        setIsIdentifying(false); // Stop identifying
      }
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "black",
        overflowY: "hidden",
      }}
    >
      {/* Camera Feed */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: "environment" }}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {/* Framing Overlay (conditionally rendered) */}
      {!isFullScreen && (
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: "60%",
            height: "60%",
            border: "4px dashed white",
            pointerEvents: "none",
          }}
        >
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "white",
              textAlign: "center",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Place the food inside of the frame
          </p>
        </div>
      )}

      {/* Capture Button */}
      <button
        onClick={capture}
        disabled={isIdentifying}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          background: "white",
          border: "2px solid black",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        {isIdentifying ? (
          <>
            <span className="material-symbols-outlined">sync</span>
            Identifying...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined">camera</span>
            Capture
          </>
        )}
      </button>
    </div>
  );
}

export default CameraWithFrameAndLoading;
