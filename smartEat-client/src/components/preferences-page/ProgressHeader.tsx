import React from "react";

interface ProgressHeaderProps {
  progress: number;
  onBack: () => void;
  showBackButton: boolean;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  progress,
  onBack,
  showBackButton,
}) => {
  return (
    <div className="px-4 py-3 bg-white">
      <div className="flex items-center">
        {showBackButton && (
          <button onClick={onBack} className="text-xl p-2" aria-label="Go back">
            ←
          </button>
        )}
        <div className="flex-1 px-4">
          <div className="bg-gray-200 h-2 rounded-full">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressHeader;
