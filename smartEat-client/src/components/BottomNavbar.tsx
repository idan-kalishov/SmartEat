import { ROUTES } from "@/Routing/routes";
import React, { useState } from "react";
import {
  BsArrowUpCircle,
  BsArrowUpCircleFill,
  BsHouse,
  BsHouseFill,
  BsPerson,
  BsPersonFill,
} from "react-icons/bs";
import { MdNoFood, MdOutlineNoFood } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import AddMealModal from "./add-meal/AddMealModal";

type NavItem = {
  activeIcon: React.ReactNode;
  inactiveIcon: React.ReactNode;
  label: string;
  to: string;
  onClick?: () => void;
};

const BottomNavbar: React.FC = () => {
  const { pathname } = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      to: ROUTES.HOME,
      activeIcon: <BsHouseFill size={24} />,
      inactiveIcon: <BsHouse size={24} />,
      label: "Home",
    },
    {
      to: ROUTES.FASTING,
      activeIcon: <MdNoFood size={24} />,
      inactiveIcon: <MdOutlineNoFood size={24} />,
      label: "Fasting",
    },
    {
      to: ROUTES.UPLOAD,
      onClick: () => setIsModalOpen(true),
      activeIcon: <BsArrowUpCircleFill size={24} />,
      inactiveIcon: <BsArrowUpCircle size={24} />,
      label: "Add",
    },
    {
      to: ROUTES.PROFILE,
      activeIcon: <BsPersonFill size={24} />,
      inactiveIcon: <BsPerson size={24} />,
      label: "Profile",
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg">
        <div className="max-w-lg mx-auto flex justify-around items-center py-1">
          {navItems.map((item, index) => {
            const baseClasses = "flex flex-col items-center py-1.5 px-2 rounded-lg transition-all cursor-pointer";
            const isActive = pathname === item.to;
            const colorClasses = isActive
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-800";

            if (item.onClick) {
              // Button nav item
              return (
                <button
                  key={`button-${index}`}
                  onClick={item.onClick}
                  className={`${baseClasses} ${colorClasses}`}
                >
                  {isActive ? item.activeIcon : item.inactiveIcon}
                  <span className="text-[10px] mt-0.5 font-medium">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.to}
                to={item.to}
                className={`${baseClasses} ${colorClasses}`}
              >
                {isActive ? item.activeIcon : item.inactiveIcon}
                <span className="text-[10px] mt-0.5 font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <AddMealModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default BottomNavbar;
