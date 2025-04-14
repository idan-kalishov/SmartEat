import { Trash2 } from "lucide-react";

interface IngredientItemProps {
  ingredient: any;
  index: number;
  updateIngredient: (index: number, field: string, value: string) => void;
  removeIngredient: (index: number) => void;
}

const IngredientItem = ({
  ingredient,
  index,
  updateIngredient,
  removeIngredient,
}: IngredientItemProps) => {
  return (
    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-3 mb-3 shadow-sm">
      <div className="flex-1 min-w-0 mr-2 text-gray-800 truncate">
        {ingredient.isNew ? (
          <input
            type="text"
            value={ingredient.name}
            placeholder="Enter ingredient name"
            onChange={(e) => updateIngredient(index, "name", e.target.value)}
            className="w-full bg-transparent focus:outline-none text-gray-800"
          />
        ) : (
          ingredient.name
        )}
      </div>

      <div className="flex items-center w-24 justify-end mr-2 relative">
        <input
          type="number"
          value={ingredient.weight}
          onChange={(e) => updateIngredient(index, "weight", e.target.value)}
          className="w-full text-right bg-transparent focus:outline-none pr-4 text-gray-600"
        />
        <span className="absolute right-2 text-sm text-gray-500 pointer-events-none">
          g
        </span>
      </div>

      <button onClick={() => removeIngredient(index)}>
        <Trash2 className="text-red-400 hover:text-red-600 w-4 h-4" />
      </button>
    </div>
  );
};

export default IngredientItem;
