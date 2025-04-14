interface MealNameInputProps {
  mealName: string;
  setMealName: (name: string) => void;
}

const MealNameInput = ({ mealName, setMealName }: MealNameInputProps) => {
  return (
    <div className="mb-6">
      <label className="text-sm text-gray-600 mb-1 block">Meal title:</label>
      <input
        type="text"
        value={mealName}
        onChange={(e) => setMealName(e.target.value)}
        className="px-4 py-2 w-full border border-green-300 bg-white rounded-xl focus:outline-none"
      />
    </div>
  );
};

export default MealNameInput;
