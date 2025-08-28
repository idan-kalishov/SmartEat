import {useEffect, useState} from "react";
import {Navigate, Outlet} from "react-router-dom";
import api from "@/services/api";
import {ROUTES} from "@/Routing/routes";
import LoadingSpinner from "@/components/common/LoadingSpinner.tsx";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const verifyResponse = await api.get("/auth/verify");

                if (verifyResponse.status === 200) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error while checking authentication", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <LoadingSpinner/> ;
    }

    return isAuthenticated ? <Outlet/> : <Navigate to={ROUTES.SIGNIN}/>;
};

export default ProtectedRoute;
