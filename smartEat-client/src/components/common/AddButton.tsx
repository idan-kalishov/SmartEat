import React from 'react';
import { useMemo } from 'react';

interface AddButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selectedDate: Date;
}

const AddButton: React.FC<AddButtonProps> = ({
  selectedDate,
  onClick,
  children,
  className = "",
  ...buttonProps
}) => {
  const isToday = useMemo(() => {
    const today = new Date();
    return (
      selectedDate.getFullYear() === today.getFullYear() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getDate() === today.getDate()
    );
  }, [selectedDate]);

  const buttonClasses = useMemo(() => {
    const baseClasses = "flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all text-sm font-medium";
    
    if (isToday) {
      return `${baseClasses} bg-emerald-500 text-white hover:bg-emerald-600`;
    } else {
      return `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed`;
    }
  }, [isToday]);

  return (
    <button
      {...buttonProps}
      onClick={onClick}
      disabled={!isToday || buttonProps.disabled}
      className={`${buttonClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default AddButton;
