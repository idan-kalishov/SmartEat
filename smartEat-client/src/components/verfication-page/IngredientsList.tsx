import React from "react";
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
    <div className="mb-6">
      <label className="text-sm text-gray-600 mb-2 block">Ingredients</label>
      <p className="text-sm text-gray-400 mb-4">
        You can modify the ingredients as needed.
      </p>

      {ingredients.map((ingredient, index) => (
        <IngredientItem
          key={index}
          ingredient={ingredient}
          index={index}
          updateIngredient={updateIngredient}
          removeIngredient={removeIngredient}
        />
      ))}

      <button
        onClick={addIngredient}
        className="flex items-center justify-center w-full border border-gray-300 bg-white text-gray-600 py-2 rounded-xl hover:bg-gray-100 transition"
      >
        <Plus className="w-4 h-4 mr-1" />
        Add more ingredients
      </button>
    </div>
  );
};

export default IngredientsList;
