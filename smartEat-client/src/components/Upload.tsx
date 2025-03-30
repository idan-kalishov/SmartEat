import React, { useState } from "react";
import CameraWithFrameAndLoading from "./CameraWithFrame";

const Upload: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Title */}
      <h1 className="text-2xl font-bold text-center mb-8 sm:text-3xl">
        Upload a Picture
      </h1>

      {/* File Input */}
      <CameraWithFrameAndLoading />

      {/* Display Uploaded Image */}
      {image && (
        <img
          src={image}
          alt="Uploaded"
          className="w-full h-64 object-cover rounded-lg shadow-lg sm:w-96 sm:h-96"
        />
      )}
    </div>
  );
};

export default Upload;
