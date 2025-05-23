// src/components/BottomNavbar.tsx
import React from "react";
import {Link, useLocation} from "react-router-dom";
import {FiHome, FiSettings, FiUpload,} from "react-icons/fi"; // Outline icons
import {BsGearFill, BsHouseFill, BsUpload,} from "react-icons/bs"; // Filled icons
import {ROUTES} from "@/Routing/routes";
import {MdNoFood, MdOutlineNoFood} from "react-icons/md";

const BottomNavbar: React.FC = () => {
    const location = useLocation();
    const pathname = location.pathname;

    const hideOnRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP, "/verify-auth"];
    if (hideOnRoutes.includes(pathname)) return null;

    const navItems = [
        {
            to: ROUTES.HOME,
            isActive: pathname === ROUTES.HOME,
            activeIcon: <BsHouseFill size={24} />,
            inactiveIcon: <FiHome size={24} />,
        },
        {
            to: ROUTES.UPLOAD,
            isActive: pathname === ROUTES.UPLOAD,
            activeIcon: <BsUpload size={24} />,
            inactiveIcon: <FiUpload size={24} />,
        },
        {
            to: "/preferences",
            isActive: pathname === "/preferences",
            activeIcon: <BsGearFill size={24} />,
            inactiveIcon: <FiSettings size={24} />,
        },
        {
            to: "/fasting",
            isActive: pathname === "/fasting",
            activeIcon: <MdNoFood size={24} />,
            inactiveIcon: <MdOutlineNoFood size={24} />,
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-sm flex justify-around items-center py-2 z-50">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.to}
                    className={`text-gray-800 ${item.isActive ? "text-black" : "text-gray-400"}`}
                >
                    {item.isActive ? item.activeIcon : item.inactiveIcon}
                </Link>
            ))}
        </nav>
    );
};

export default BottomNavbar;
