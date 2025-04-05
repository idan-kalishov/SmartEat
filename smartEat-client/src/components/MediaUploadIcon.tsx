import React from "react";

interface MediaUploadIconProps {
  onUpload: (file: File) => void;
}

const MediaUploadIcon: React.FC<MediaUploadIconProps> = ({ onUpload }) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <>
      {/* Media Upload Icon (Far Right) */}
      <label
        htmlFor="file-upload"
        style={{
          position: "absolute",
          bottom: "20px", // Positioned near the bottom
          right: "10%", // Positioned at the far right
          cursor: "pointer",
          zIndex: 6, // Ensure it's above other layers
        }}
      >
        <span
          style={{
            fontSize: "40px",
            color: "white",
          }}
          className="material-symbols-outlined"
        >
          photo_library
        </span>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        style={{ display: "none" }} // Hide the default file input
        onChange={handleFileUpload} // Ensure this is correctly bound
      />
    </>
  );
};

export default MediaUploadIcon;
