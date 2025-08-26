import React from "react";
import { fileToBase64 } from "@/utils/base64ToFile";
import { resizeImageFile } from "@/utils/resizeFile";

interface MealImageDisplayProps {
  mealImage: string | null;
  mealName: string;
  isManual?: boolean;
  onImageChange?: (base64: string) => void;
}

const MealImageDisplay = ({
  mealImage,
  mealName,
  isManual = false,
  onImageChange,
}: MealImageDisplayProps) => {
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && onImageChange) {
      const resizedBlob = await resizeImageFile(file, 1024, 1024, 0.7);
      const fileAsBase64 = await fileToBase64(resizedBlob as File);
      onImageChange(fileAsBase64);
    }
  };

  return (
    <div className="flex flex-col items-center mb-4">
      {mealImage ? (
        <img
          src={mealImage}
          alt={`${mealName || "Meal"} image`}
          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-md mb-2"
        />
      ) : isManual ? (
        <div className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl mb-2">
          <span className="text-xs text-gray-400 text-center px-2">
            No image uploaded
          </span>
        </div>
      ) : null}

      {isManual && (
        <label className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-sm font-medium cursor-pointer hover:bg-green-700 transition">
          {mealImage ? "Change Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      )}
    </div>
  );
};

export default MealImageDisplay;
