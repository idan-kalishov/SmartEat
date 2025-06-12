import React from "react";
import { ImagePlus } from "lucide-react";

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
        className="absolute bottom-6 right-[10%] cursor-pointer z-[6] flex flex-col items-center gap-1"
      >
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all">
          <ImagePlus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </div>
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />
    </>
  );
};

export default MediaUploadIcon;
