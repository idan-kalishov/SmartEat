// components/NutritionSummary.tsx
import { Button } from "@/components/ui/button";

export const NutritionSummary = ({
  calories,
  servingSize,
  onServingSizeChange,
}: {
  calories: number | null;
  servingSize: number;
  onServingSizeChange: (change: number) => void;
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Total Calories</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="w-20 border rounded px-2 py-1"
            value={calories !== null ? calories.toFixed(0) : "-"}
            readOnly
          />
          <span className="text-sm">cal</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span>Servings</span>
        <div className="flex gap-2 items-center">
          <Button variant="outline" onClick={() => onServingSizeChange(-0.5)}>
            -
          </Button>
          <span>{servingSize}</span>
          <Button variant="outline" onClick={() => onServingSizeChange(0.5)}>
            +
          </Button>
        </div>
      </div>
    </>
  );
};
