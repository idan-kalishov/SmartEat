import React from "react";

interface ContinueButtonProps {
  canContinue: boolean;
  onClick: () => void;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  canContinue,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={!canContinue}
      className={`w-full py-4 rounded-full text-white font-medium text-lg ${
        canContinue ? "bg-black" : "bg-gray-300"
      }`}
    >
      Continue
    </button>
  );
};

export default ContinueButton;
