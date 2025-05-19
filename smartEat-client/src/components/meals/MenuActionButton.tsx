import React from "react";

interface MenuActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  colorClass?: string; // e.g., 'text-red-600 hover:bg-red-50'
}

const MenuActionButton: React.FC<MenuActionButtonProps> = ({ children, onClick, colorClass = "text-gray-700 hover:bg-gray-100" }) => (
  <button
    className={`block w-full text-left px-4 py-2 text-sm rounded transition duration-150 active:scale-95 focus-visible:ring focus-visible:ring-green-200 ${colorClass}`}
    onClick={onClick}
    type="button"
  >
    {children}
  </button>
);

export default MenuActionButton; 