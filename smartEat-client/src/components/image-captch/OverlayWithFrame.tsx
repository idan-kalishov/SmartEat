import React from "react";

interface OverlayWithFrameProps {
  isFullScreen: boolean;
}

const OverlayWithFrame: React.FC<OverlayWithFrameProps> = ({
  isFullScreen,
}) => (
  <>
    {/* Dark Overlay with Rectangle Cut-out */}
    {!isFullScreen && (
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.7)",
          zIndex: 2,
          clipPath:
            "polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, 9% 17%, 9% 59%, 91% 59%, 91% 17%, 9% 17%)", // Slightly adjusted for buffer
        }}
      />
    )}

    {/* Floating Text */}
    {!isFullScreen && (
      <div
        style={{
          position: "absolute",
          top: "8%", // Positioned above the white square
          left: "50%", // Centered horizontally
          transform: "translateX(-50%)", // Center alignment
          color: "white",
          fontSize: "20px", // Adjust font size for visibility
          fontWeight: "bold",
          textAlign: "center",
          zIndex: 4, // Ensure text is above the overlay
        }}
      >
        Place your food inside the frame 🍽️
      </div>
    )}

    {/* Elegant White Rectangle Frame (Corners Only) */}
    {!isFullScreen && (
      <div
        style={{
          position: "absolute",
          top: "18%", // Moved higher
          left: "10%", // Adjusted for wider rectangle
          width: "80%", // Increased width for a wider rectangle
          height: "40%", // Height remains the same
          pointerEvents: "none",
          zIndex: 3,
        }}
      >
        {/* Top-left Corner */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "-10px",
            width: "40px", // Thicker corner
            height: "5px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10px",
            left: "-10px",
            width: "5px", // Thicker corner
            height: "40px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />

        {/* Top-right Corner */}
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "40px", // Thicker corner
            height: "5px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "5px", // Thicker corner
            height: "40px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />

        {/* Bottom-left Corner */}
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "-10px",
            width: "40px", // Thicker corner
            height: "5px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "-10px",
            width: "5px", // Thicker corner
            height: "40px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />

        {/* Bottom-right Corner */}
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            width: "40px", // Thicker corner
            height: "5px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            width: "5px", // Thicker corner
            height: "40px", // Thicker corner
            background: "white",
            borderRadius: "3px", // Slightly rounded edges
          }}
        />
      </div>
    )}
  </>
);

export default OverlayWithFrame;
