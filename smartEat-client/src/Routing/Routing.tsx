import { Navigate, Route, Routes } from "react-router-dom";
import Home from "@/pages/Home.tsx";
import Upload from "@/components/Upload.tsx";
import ResultsPage from "@/pages/ResultsPage.tsx";
import IngredientVerificationPage from "@/pages/IngredientVerificationPage.tsx";
import { ROUTES } from "./routes";
import ProtectedRoute from "@/components/ProtectedRoutes.tsx";
import SignUpPage from "@/pages/SignUpPage.tsx";
import LoginPage from "@/pages/LoginPage.tsx";
import LoginRedirector from "@/components/loginRedirector.tsx";
import UserPreferences from "@/pages/preferencesPage.tsx";
import ProfilePage from "@/pages/Profile";

const Routing = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
      <Route path="/verify-auth" element={<LoginRedirector />} />

      <Route element={<ProtectedRoute />}>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.UPLOAD} element={<Upload />} />
        <Route path={ROUTES.RESULT} element={<ResultsPage />} />
        <Route path="/preferences" element={<UserPreferences />} />
        <Route path={ROUTES.VERIFY} element={<IngredientVerificationPage />} />
        <Route path={ROUTES.USER_PROFILE} element={<ProfilePage />} />
      </Route>
      <Route path="*" element={<Navigate to={ROUTES.VERIFY_AUTH} />} />
    </Routes>
  );
};

export default Routing;
