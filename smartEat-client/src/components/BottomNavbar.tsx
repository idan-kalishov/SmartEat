// src/components/BottomNavbar.tsx
import React from "react";
import {Link, useLocation} from "react-router-dom";
import {FiHome, FiSettings, FiUpload, FiUser,} from "react-icons/fi";
import {BsGearFill, BsHouseFill, BsPersonFill, BsUpload,} from "react-icons/bs";
import {ROUTES} from "@/Routing/routes";

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
            to: ROUTES.PROFILE,
            isActive: pathname === ROUTES.PROFILE,
            activeIcon: <BsPersonFill size={24} />,
            inactiveIcon: <FiUser size={24} />,
        },
        {
            to: ROUTES.PREFERENCES,
            isActive: pathname === ROUTES.PREFERENCES,
            activeIcon: <BsGearFill size={24} />,
            inactiveIcon: <FiSettings size={24} />,
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
