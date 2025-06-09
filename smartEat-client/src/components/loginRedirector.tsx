import {useEffect} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import queryString from "query-string";
import {useDispatch} from "react-redux";
import {setUser} from "../store/appState";
import api from "@/services/api";

const LoginRedirector = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const queryParams = queryString.parse(location.search);

                if (Object.keys(queryParams).length > 0) {
                    const userId = queryParams.userId as string;
                    const userName = queryParams.userName as string;
                    const email = queryParams.email as string;
                    const profilePicture = queryParams.profilePicture as string;

                    if (userId && userName && email) {
                        dispatch(
                            setUser({
                                _id: userId,
                                userName,
                                email,
                                profilePicture: profilePicture || undefined,
                            })
                        );
                    }
                }

                const verifyResponse = await api.get("/auth/verify");
                if (verifyResponse.status === 200) {
                    try {
                        const response = await api.get("/auth/me");
                        dispatch(setUser(response.data.user));
                    } catch (error) {
                        console.error("Failed to fetch user data:", error);
                    } finally {
                        navigate("/home", {replace: true});
                    }
                } else {
                    navigate("/login", {replace: true});
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                navigate("/login", {replace: true});
            }
        };

        verifyAuth();
    }, [location, navigate, dispatch]);

    return null;
};

export default LoginRedirector;
