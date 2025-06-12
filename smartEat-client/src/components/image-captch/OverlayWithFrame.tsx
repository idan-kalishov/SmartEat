import React from "react";
import { UtensilsCrossed } from "lucide-react";

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
          top: "2%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          fontSize: "18px",
          fontWeight: "500",
          textAlign: "center",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          paddingBottom: "20px" // Extra padding to ensure separation from frame
        }}
      >
        <UtensilsCrossed className="w-6 h-6 text-white" strokeWidth={2.5} />
        <span>Place your food inside the frame</span>
      </div>
    )}

    {/* Elegant White Rectangle Frame (Corners Only) */}
    {!isFullScreen && (
      <div
        style={{
          position: "absolute",
          top: "18%",
          left: "10%",
          width: "80%",
          height: "40%",
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
