import { ROUTES } from "@/Routing/routes";
import { MealRecognitionResult } from "@/types/protoServicesTypes";
import { base64ToFile, fileToBase64 } from "@/utils/base64ToFile.ts";
import { cropImageToSquare } from "@/utils/cropImageToSquare.ts";
import { analyzeFoodImage } from "@/utils/mealAnalysisApi.ts";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { toast } from "sonner";
import useScrollLock from "../../hooks/useScrollLock";
import LoadingScreen from "../../pages/loading/LoadingScreen";
import CameraFeed from "./CameraFeed";
import CaptureButton from "./CaptureButton";
import MediaUploadIcon from "./MediaUploadIcon";
import OverlayWithFrame from "./OverlayWithFrame";

export interface FoodVerifyTransferObject {
  foodRecognitionResponse: MealRecognitionResult[];
  image: string;
}

const CameraWithFrameAndLoading = () => {
  const webcamRef = useRef<Webcam>(null);
  const [isIdentifying, setIsIdentifying] = useState(false); // State to track loading
  const navigate = useNavigate();

  // Disable scrolling on mobile devices
  useScrollLock();

  // Function to capture the image
  const capture = async () => {
    if (!webcamRef.current) {
      toast.error("Camera not ready. Please try again.");
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

      navigate(ROUTES.VERIFY, { state: transferObject });
    } catch (error) {
      console.error("Error during capture:", error);
      toast.error("An error occurred while analyzing your meal.");
    } finally {
      setIsIdentifying(false); // Stop loading
    }
  };

  // Function to handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) {
      toast.error("No file selected.");
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

      navigate(ROUTES.VERIFY, { state: transferObject });
    } catch (error) {
      console.error("Error during file upload:", error);
      toast.error("An error occurred while analyzing your meal.");
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
            height: "94vh",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "transparent",
            touchAction: "none",
          }}
        >
          {/* Close Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            style={{ backdropFilter: "blur(4px)" }}
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Camera Feed */}
          <CameraFeed ref={webcamRef} />

          {/* Overlay with Frame */}
          <OverlayWithFrame />

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
