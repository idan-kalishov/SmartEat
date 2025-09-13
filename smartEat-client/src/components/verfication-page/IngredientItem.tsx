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
          min="0"
          value={ingredient.weight} // expects string
          onChange={(e) => {
            const value = e.target.value;

            if (value === "") {
              // Allow empty during typing
              updateIngredient(index, "weight", "");
            } else {
              const numValue = parseFloat(value);
              // Clamp to 0 or higher, then convert back to string
              const clampedValue = numValue < 0 ? "0" : numValue.toString();
              updateIngredient(index, "weight", clampedValue);
            }
          }}
          onKeyDown={(e) => {
            // Allow: backspace, delete, tab, escape, enter, decimal point, and navigation keys
            const allowedKeys = [
              "Backspace",
              "Delete",
              "Tab",
              "Escape",
              "Enter",
              ".",
              ",",
              "Home",
              "End",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
            ];

            // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
            if (
              e.ctrlKey &&
              ["a", "c", "v", "x"].includes(e.key.toLowerCase())
            ) {
              return;
            }

            // Allow navigation and control keys
            if (allowedKeys.includes(e.key)) {
              return;
            }

            // Allow numbers (0-9) from both main keyboard and numpad
            if (/^[0-9]$/.test(e.key)) {
              return;
            }

            // Prevent all other keys
            e.preventDefault();
          }}
          onInput={(e) => {
            // Additional validation for mobile browsers
            const target = e.target as HTMLInputElement;
            const value = target.value;
            // Remove any non-numeric characters except decimal point
            const numericValue = value.replace(/[^0-9.]/g, "");
            // Ensure only one decimal point
            const parts = numericValue.split(".");
            const cleanValue =
              parts.length > 2
                ? parts[0] + "." + parts.slice(1).join("")
                : numericValue;

            if (cleanValue !== value) {
              target.value = cleanValue;
              updateIngredient(index, "weight", cleanValue);
            }
          }}
          className="w-full text-right bg-transparent focus:outline-none pr-4 text-gray-600"
          placeholder="0"
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
