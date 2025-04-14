import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const IngredientVerificationHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="relative mb-4 flex items-center justify-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-0 ml-2 p-0 focus:outline-none"
      >
        <ArrowLeft className="text-gray-700 w-5 h-5" />
      </button>
      <p className="text-2xl font-semibold text-gray-800">Meal Summary</p>
    </div>
  );
};

export default IngredientVerificationHeader;
