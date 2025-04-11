// components/NutrientCircle.tsx
import { CircularProgress } from "@mui/material";

const getNutritionValue = (value: number | null) => {
  return value !== null ? value.toFixed(0) : "-";
};

export const NutrientCircle = ({
  label,
  value,
  color,
  totalWeight,
}: {
  label: string;
  value: number | null;
  color: string;
  totalWeight: number;
}) => {
  const percentage =
    value && totalWeight ? Math.min((value / totalWeight) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-20 h-20">
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={80}
          thickness={5}
          style={{ color }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {getNutritionValue(value)}g
        </div>
      </div>
      <span className="mt-1 text-sm">{label}</span>
    </div>
  );
};
