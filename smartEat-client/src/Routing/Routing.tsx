import CameraWithFrameAndLoading from "@/components/image-captch/CameraWithFrameAndLoading.tsx";
import Layout from "@/components/Layout.tsx";
import LoginRedirector from "@/components/loginRedirector.tsx";
import ProtectedRoute from "@/components/ProtectedRoutes.tsx";
import SignIn from "@/pages/auth/SignIn.tsx";
import SignUp from "@/pages/auth/SignUp.tsx";
import FastingTimer from "@/pages/fasting-page/FastingTimer.tsx";
import IngredientVerificationPage from "@/pages/IngredientVerificationPage.tsx";
import LandingPage from "@/pages/LandingPage";
import MealsLogPage from "@/pages/MealsLogPage";
import UserPreferences from "@/pages/preferencesPage";
import ProfilePage from "@/pages/Profile";
import ResultsPage from "@/pages/ResultsPage.tsx";
import { Navigate, Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";

const Routing = () => {
  return (
    <Routes>
      <Route path={ROUTES.LANDING} element={<LandingPage />} />

      <Route path={ROUTES.SIGNIN} element={<SignIn />} />
      <Route path={ROUTES.SIGNUP} element={<SignUp />} />
      <Route path={ROUTES.VERIFY_AUTH} element={<LoginRedirector />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.HOME} element={<MealsLogPage />} />
          <Route path={ROUTES.UPLOAD} element={<CameraWithFrameAndLoading />} />
          <Route path={ROUTES.RESULT} element={<ResultsPage />} />
          <Route path={ROUTES.FASTING} element={<FastingTimer />} />
          <Route path={ROUTES.PREFERENCES} element={<UserPreferences />} />
          <Route
            path={ROUTES.VERIFY}
            element={<IngredientVerificationPage />}
          />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH} />} />
    </Routes>
  );
};

export default Routing;
