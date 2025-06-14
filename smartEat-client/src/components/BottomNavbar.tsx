import {ROUTES} from "@/Routing/routes";
import React from "react";
import {BsArrowUpCircle, BsArrowUpCircleFill, BsHouse, BsHouseFill, BsPerson, BsPersonFill,} from "react-icons/bs";
import {MdNoFood, MdOutlineNoFood} from "react-icons/md";
import {Link, useLocation} from "react-router-dom";

const BottomNavbar: React.FC = () => {
    const {pathname} = useLocation();

    const navItems = [
        {
            to: ROUTES.HOME,
            activeIcon: <BsHouseFill size={24}/>,
            inactiveIcon: <BsHouse size={24}/>,
            label: "Home",
        },
        {
            to: "/fasting",
            activeIcon: <MdNoFood size={24}/>,
            inactiveIcon: <MdOutlineNoFood size={24}/>,
            label: "Fasting",
        },
        {
            to: ROUTES.UPLOAD,
            activeIcon: <BsArrowUpCircleFill size={24}/>,
            inactiveIcon: <BsArrowUpCircle size={24}/>,
            label: "Add",
        },
        {
            to: ROUTES.PROFILE,
            activeIcon: <BsPersonFill size={24}/>,
            inactiveIcon: <BsPerson size={24}/>,
            label: "Profile",
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 shadow-lg">
            <div className="max-w-lg mx-auto flex justify-around items-center py-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.to;

                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex flex-col items-center py-1.5 px-2 rounded-lg transition-all ${
                                isActive
                                    ? "text-green-600"
                                    : "text-gray-500 hover:text-gray-800"
                            }`}
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
    );
};

export default BottomNavbar;
