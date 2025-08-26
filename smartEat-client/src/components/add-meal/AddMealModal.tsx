import React from "react";
import { useNavigate } from "react-router-dom";

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMealModal: React.FC<AddMealModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAuto = () => {
    onClose();
    navigate("/upload"); // goes to CameraWithFrameAndLoading
  };

  const handleManual = () => {
    onClose();
    navigate("/verify", { state: { isManual: true } }); // opens IngredientVerificationPage empty
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-72 p-6">
        <h2 className="text-lg font-semibold text-center mb-4">Add Meal</h2>
        <div className="flex flex-col gap-3">
          <button
            onClick={handleAuto}
            className="px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Auto (AI Recognition)
          </button>
          <button
            onClick={handleManual}
            className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Manual Entry
          </button>
        </div>
        <button
          onClick={onClose}
          className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMealModal;
