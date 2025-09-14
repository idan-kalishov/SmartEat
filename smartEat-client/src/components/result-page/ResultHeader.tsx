// components/ResultsHeader.tsx
import { ROUTES } from "@/Routing/routes";
import { ArrowLeft, Bookmark, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ResultsHeader = ({
  name,
  image,
  onBack,
}: {
  name: string;
  image: string;
  onBack: () => void;
}) => {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3 shadow-sm flex items-center justify-between">
      <button onClick={onBack} className="p-2 text-gray-600 hover:text-black">
        <ArrowLeft size={24} />
      </button>

      <div className="flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-14 h-14 rounded-xl object-cover mb-1 shadow"
          />
        )}
        <span className="text-base font-semibold text-gray-800">{name}</span>
      </div>

      <div className="flex flex-col gap-1 items-center">
        <button className="p-2 text-gray-600 hover:text-green-600">
          <Bookmark size={22} />
        </button>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="p-2 text-gray-600 hover:text-red-500"
        >
          <Trash2 size={22} />
        </button>
      </div>
    </div>
  );
};
