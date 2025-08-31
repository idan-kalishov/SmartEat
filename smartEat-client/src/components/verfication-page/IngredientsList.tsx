import { Plus } from "lucide-react";
import IngredientItem from "./IngredientItem";

interface IngredientsListProps {
  ingredients: any[];
  setIngredients: (ingredients: any[]) => void;
}

const IngredientsList = ({
  ingredients,
  setIngredients,
}: IngredientsListProps) => {
  const addIngredient = () => {
    const newIngredient = { name: "", weight: "", isNew: true };
    setIngredients([...ingredients, newIngredient]);
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const updateIngredient = (index: number, field: string, value: string) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  return (
    <div className="space-y-4">
      {ingredients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No ingredients added yet</p>
          <p className="text-xs text-gray-400 mt-1">Click the button below to add your first ingredient</p>
        </div>
      ) : (
        ingredients.map((ingredient, index) => (
          <IngredientItem
            key={index}
            ingredient={ingredient}
            index={index}
            updateIngredient={updateIngredient}
            removeIngredient={removeIngredient}
          />
        ))
      )}

      <button
        onClick={addIngredient}
        className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 bg-gray-50 text-gray-600 py-4 rounded-xl hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200"
      >
        <Plus className="w-5 h-5 mr-2 text-gray-400" />
        <span className="font-medium">Add more ingredients</span>
      </button>
    </div>
  );
};

export default IngredientsList;
