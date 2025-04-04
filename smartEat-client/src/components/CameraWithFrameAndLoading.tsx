import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import { analyzeFoodImage } from "../utils/mealAnalysisApi";
import { base64ToFile } from "../utils/base64ToFile";
import CameraFeed from "./CameraFeed";
import OverlayWithFrame from "./OverlayWithFrame";
import CaptureButton from "./CaptureButton";
import MediaUploadIcon from "./MediaUploadIcon";
import { cropImageToSquare } from "../utils/cropImageToSquare";

const CameraWithFrameAndLoading = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  // Disable scrolling on mobile devices
  React.useEffect(() => {
    document.documentElement.style.overflow = "hidden"; // Disable vertical scrolling
    document.body.style.overflow = "hidden"; // Disable horizontal scrolling

    return () => {
      document.documentElement.style.overflow = ""; // Re-enable scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);

  // Function to capture the image
  const capture = async () => {
    if (!webcamRef.current) {
      alert("Camera not ready. Please try again.");
      return;
    }
    setIsIdentifying(true);
    try {
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) throw new Error("Failed to capture image.");

      // Crop the image to the dimensions of the white square
      const croppedImage = await cropImageToSquare(imageSrc);

      // Compress the cropped image before sending
      const imageFile = await base64ToFile(
        croppedImage,
        "cropped-image.jpg",
        "image/jpeg",
        1024,
        1024,
        0.7
      );

      // Analyze the image
      const results = await analyzeFoodImage(imageFile);
      navigate("/results", { state: results });
    } catch (error) {
      console.error("Error during capture:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsIdentifying(false);
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (file: File) => {
    console.log(file);
    if (!file) {
      alert("No file selected.");
      return;
    }
    try {
      setIsIdentifying(true);

      // Log the selected file for debugging
      console.log("Selected File:", file);

      // Process the uploaded file
      const results = await analyzeFoodImage(file);

      // Log the analysis results for debugging
      console.log("Analysis Results:", results);

      // Navigate to the results page
      navigate("/results", { state: results });
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsIdentifying(false);
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
        background: "transparent",
        touchAction: "none",
      }}
    >
      {/* Camera Feed */}
      <CameraFeed ref={webcamRef} />

      {/* Overlay with Frame */}
      <OverlayWithFrame isFullScreen={isFullScreen} />

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: 0,
          width: "100%",
          height: "100px",
          background: "transparent",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 5,
        }}
      >
        {/* Capture Button */}
        <CaptureButton onClick={capture} />

        {/* Media Upload Icon */}
        <MediaUploadIcon onUpload={handleFileUpload} />
      </div>
    </div>
  );
};

export default CameraWithFrameAndLoading;
