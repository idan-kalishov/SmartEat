// src/components/BottomNavbar.tsx
import {ROUTES} from "@/Routing/routes";
import React from "react";
import {
  BsArrowUpCircle,
  BsArrowUpCircleFill,
  BsGear,
  BsGearFill,
  BsHouse,
  BsHouseFill,
  BsPerson,
  BsPersonFill,
} from "react-icons/bs";
import {MdNoFood, MdOutlineNoFood} from "react-icons/md";
import {Link, useLocation} from "react-router-dom";

const BottomNavbar: React.FC = () => {
    const {pathname} = useLocation();

    const hideOnRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP, "/verify-auth"];
    if (hideOnRoutes.includes(pathname)) return null;

    const navItems = [
        {
            to: ROUTES.HOME,
            activeIcon: <BsHouseFill size={24}/>,
            inactiveIcon: <BsHouse size={24}/>,
        },
        {
            to: ROUTES.UPLOAD,
            activeIcon: <BsArrowUpCircleFill size={24}/>,
            inactiveIcon: <BsArrowUpCircle size={24}/>,
        },
        {
            to: ROUTES.PROFILE,
            activeIcon: <BsPersonFill size={24}/>,
            inactiveIcon: <BsPerson size={24}/>,
        },
        {
            to: ROUTES.PREFERENCES,
            activeIcon: <BsGearFill size={24}/>,
            inactiveIcon: <BsGear size={24}/>,
        },
        {
            to: "/fasting",
            isActive: pathname === "/fasting",
            activeIcon: <MdNoFood size={24}/>,
            inactiveIcon: <MdOutlineNoFood size={24}/>,
        },
    ];

    return (
        <nav
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm flex justify-around items-center py-2 z-50">
            {navItems.map((item, index) => {
                const isActive = pathname === item.to;
                return (
                    <Link
                        key={index}
                        to={item.to}
                        className={`text-gray-800 ${
                            isActive ? "text-black" : "text-gray-400"
                        }`}
                    >
                        {isActive ? item.activeIcon : item.inactiveIcon}
                    </Link>
                );
            })}
        </nav>
    );
};

export default BottomNavbar;
