import React, { useState, useRef } from "react";
import Webcam from "react-webcam";

function CameraWithFrameAndLoading() {
  const webcamRef = useRef(null);
  const [isIdentifying, setIsIdentifying] = useState(false);

  const capture = async () => {
    setIsIdentifying(true); // Start identifying

    if (webcamRef.current) {
      const imageSrc = (webcamRef.current as any).getScreenshot();
      console.log(imageSrc); // Simulate image recognition
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing time
      setIsIdentifying(false); // Stop identifying
    }
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      {/* Camera Feed */}
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{
          facingMode: "environment", // Use the rear camera
        }}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          border: "2px solid red", // Add a border for debugging
        }}
      />

      {/* Framing Overlay */}
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
