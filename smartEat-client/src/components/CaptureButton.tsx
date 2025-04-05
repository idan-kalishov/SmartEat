import React from "react";

interface CaptureButtonProps {
  onClick: () => void; // Define the onClick prop
}

const CaptureButton: React.FC<CaptureButtonProps> = ({ onClick }) => (
  <div
    onClick={onClick} // Bind the onClick prop to the button's click event
    style={{
      position: "relative",
      width: "80px",
      height: "80px",
      cursor: "pointer", // Make it clickable
    }}
  >
    {/* Outer Circle */}
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Black Ring */}
      <div
        style={{
          position: "absolute",
          top: "5px",
          left: "5px",
          width: "70px",
          height: "70px",
          borderRadius: "50%",
          background: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Inner Circle */}
        <div
          style={{
            position: "absolute",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "white",
          }}
        />
      </div>
    </div>
  </div>
);

export default CaptureButton;
