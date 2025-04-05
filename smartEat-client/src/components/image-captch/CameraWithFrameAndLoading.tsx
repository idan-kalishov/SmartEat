import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import { useNavigate } from "react-router-dom";
import {
  analyzeFoodImage,
  FoodRecognitionResponse,
} from "../../utils/mealAnalysisApi";
import { base64ToFile, fileToBase64 } from "../../utils/base64ToFile";
import CameraFeed from "./CameraFeed";
import OverlayWithFrame from "./OverlayWithFrame";
import CaptureButton from "./CaptureButton";
import MediaUploadIcon from "./MediaUploadIcon";
import { cropImageToSquare } from "../../utils/cropImageToSquare";
import useScrollLock from "../../hooks/useScrollLock";
import LoadingScreen from "../../pages/loading/LoadingScreen";

export interface FoodVerifyTransferObject {
  foodRecognitionResponse: FoodRecognitionResponse[];
  image: string;
}

const CameraWithFrameAndLoading = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isIdentifying, setIsIdentifying] = useState(false); // State to track loading
  const [isFullScreen, setIsFullScreen] = useState(false);
  const navigate = useNavigate();

  // Disable scrolling on mobile devices
  useScrollLock();

  // Function to capture the image
  const capture = async () => {
    if (!webcamRef.current) {
      alert("Camera not ready. Please try again.");
      return;
    }
    setIsIdentifying(true); // Start loading
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

      const foodRecognitionResponse = await analyzeFoodImage(imageFile);

      const transferObject: FoodVerifyTransferObject = {
        foodRecognitionResponse,
        image: croppedImage,
      };

      navigate("/verify", { state: transferObject });
    } catch (error) {
      console.error("Error during capture:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsIdentifying(false); // Stop loading
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) {
      alert("No file selected.");
      return;
    }
    setIsIdentifying(true); // Start loading
    try {
      const foodRecognitionResponse = await analyzeFoodImage(file);

      // Convert the file to a base64 string for display
      const fileAsBase64 = await fileToBase64(file);

      const transferObject: FoodVerifyTransferObject = {
        foodRecognitionResponse,
        image: fileAsBase64,
      };

      navigate("/verify", { state: transferObject });
    } catch (error) {
      console.error("Error during file upload:", error);
      alert(error instanceof Error ? error.message : "An error occurred.");
    } finally {
      setIsIdentifying(false); // Stop loading
    }
  };

  return (
    <>
      {/* Main Content */}
      {!isIdentifying && (
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
      )}

      {/* Full-Page Loading Screen */}
      {isIdentifying && <LoadingScreen message="Analyzing your meal..." />}
    </>
  );
};

export default CameraWithFrameAndLoading;
