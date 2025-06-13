import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import queryString from "query-string";
import { useDispatch } from "react-redux";
import { setUser } from "../store/appState";
import { fetchUserProfile } from "@/store/userSlice";
import api from "@/services/api";
import type { AppDispatch } from "@/store/appState";

const LoginRedirector = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const queryParams = queryString.parse(location.search);

        // Step 1: Handle OAuth login via query params (e.g., Google)
        if (queryParams.userId && queryParams.userName && queryParams.email) {
          dispatch(
            setUser({
              _id: queryParams.userId as string,
              userName: queryParams.userName as string,
              email: queryParams.email as string,
              profilePicture:
                (queryParams.profilePicture as string) || undefined,
            })
          );
        }

        // Step 2: Verify auth status via `/auth/verify`
        const verifyResponse = await api.get("/auth/verify").catch((err) => {
          console.error("Auth verification failed:", err);
          return null;
        });

        if (!verifyResponse || verifyResponse.status !== 200) {
          navigate("/login", { replace: true });
          return;
        }

        // Step 3: Fetch full user data including userProfile
        const meResponse = await api.get("/auth/me");
        const user = meResponse.data.user;

        // Update Redux store with full user data
        dispatch(
          setUser({
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profilePicture: user.profilePicture || undefined,
            userProfile: user.userProfile || undefined,
          })
        );

        console.log("user from /auth/me", user);


        // Step 4: Dispatch fetchUserProfile (optional, already set above)
        await dispatch(fetchUserProfile()).unwrap();

        // Step 5: Redirect based on whether user has set preferences
        if (!user.userProfile?.age) {
          navigate("/preferences", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        navigate("/login", { replace: true });
      }
    };

    verifyAuth();
  }, [location, navigate, dispatch]);

  return null;
};

export default LoginRedirector;
