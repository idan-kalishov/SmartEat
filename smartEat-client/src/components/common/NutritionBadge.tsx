import React from 'react';

interface NutritionBadgeProps {
  type: 'calories' | 'protein' | 'fat' | 'carbs';
  value: number;
  unit?: string;
  size?: 'sm' | 'md';
}

export const NutritionBadge: React.FC<NutritionBadgeProps> = ({
  type,
  value,
  unit,
  size = 'sm',
}) => {
  const getBadgeConfig = () => {
    switch (type) {
      case 'calories':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          label: 'kcal',
          title: 'Calories'
        };
      case 'protein':
        return {
          bgColor: 'bg-rose-100',
          textColor: 'text-rose-800',
          label: 'g',
          title: 'Protein'
        };
      case 'fat':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'g',
          title: 'Fat'
        };
      case 'carbs':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-800',
          label: 'g',
          title: 'Carbs'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: unit || '',
          title: ''
        };
    }
  };

  const config = getBadgeConfig();
  const displayValue = Number.isInteger(value) ? value.toString() : value.toFixed(2);
  const displayLabel = unit || config.label;
  const sizeClasses = size === 'sm'
    ? 'px-1 py-0.5 text-xs'
    : 'px-3 py-1 text-sm';

  return (
    <span
      className={`flex flex-col items-center rounded font-medium ${config.bgColor} ${config.textColor} ${sizeClasses}`}
    >
      <span className={`text-xs font-medium leading-none ${config.textColor} mb-0`}>{config.title}</span>
      <span className="flex items-baseline gap-0.5">
        {displayValue} <span className="opacity-75">{displayLabel}</span>
      </span>
    </span>
  );
}; 