import {Navigate, Route, Routes} from "react-router-dom";
import ResultsPage from "@/pages/ResultsPage.tsx";
import IngredientVerificationPage from "@/pages/IngredientVerificationPage.tsx";
import {ROUTES} from "./routes";
import ProtectedRoute from "@/components/ProtectedRoutes.tsx";
import SignUp from "@/pages/auth/SignUp.tsx";
import SignIn from "@/pages/auth/SignIn.tsx";
import LoginRedirector from "@/components/loginRedirector.tsx";
import MealsLogPage from "@/pages/MealsLogPage";
import ProfilePage from "@/pages/Profile";
import FastingTimer from "@/pages/fasting-page/FastingTimer.tsx";
import UserPreferences from "@/pages/preferencesPage";
import CameraWithFrameAndLoading from "@/components/image-captch/CameraWithFrameAndLoading.tsx";

const Routing = () => {
    return (
        <Routes>
            <Route path={ROUTES.SIGNIN} element={<SignIn/>}/>
            <Route path={ROUTES.SIGNUP} element={<SignUp/>}/>
            <Route path="/verify-auth" element={<LoginRedirector/>}/>

            <Route element={<ProtectedRoute/>}>
                <Route path={ROUTES.HOME} element={<MealsLogPage/>}/>
                <Route path={ROUTES.UPLOAD} element={<CameraWithFrameAndLoading/>}/>
                <Route path={ROUTES.RESULT} element={<ResultsPage/>}/>
                <Route path={ROUTES.FASTING} element={<FastingTimer/>}/>
                <Route path={ROUTES.PREFERENCES} element={<UserPreferences/>}/>
                <Route path={ROUTES.VERIFY} element={<IngredientVerificationPage/>}/>
                <Route path={ROUTES.PROFILE} element={<ProfilePage/>}/>
            </Route>
            <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH}/>}/>
        </Routes>
    );
};

export default Routing;
