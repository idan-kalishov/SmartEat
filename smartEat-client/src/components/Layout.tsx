import { ROUTES } from "@/Routing/routes";
import { RootState } from "@/store/appState";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import BottomNavbar from "./BottomNavbar";

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  const { userProfile } = useSelector((state: RootState) => state.user);

  const hideOnRoutes = [ROUTES.SIGNIN, ROUTES.SIGNUP, "/verify-auth"];
  const shouldShowNavbar =
    !hideOnRoutes.includes(pathname) &&
    !(pathname === ROUTES.PREFERENCES && !userProfile?.age);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <main className="flex-1 w-full max-w-5xl mx-auto">
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          <Outlet />
        </div>
      </main>
      {shouldShowNavbar && <BottomNavbar />}
    </div>
  );
};

export default Layout;
