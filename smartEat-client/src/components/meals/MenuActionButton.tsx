import React from "react";

interface MenuActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  colorClass?: string;
  icon?: React.ReactNode;
}

const MenuActionButton: React.FC<MenuActionButtonProps> = ({
  onClick,
  children,
  colorClass = "text-gray-700 hover:bg-gray-50",
  icon
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full px-3 py-2 text-left flex items-center gap-2 text-sm transition-colors ${colorClass}`}
    >
      {icon}
      <span>{children}</span>
    </button>
  );
};

export default MenuActionButton; 