import { ROUTES } from "@/Routing/routes";
import api from "@/services/api";
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import axios from "axios";
import { Utensils } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    if (!credential) return;

    try {
      // Send credential to our backend
      const authResponse = await api.post('/auth/google', {
        idToken: credential
      });

      // Handle successful authentication
      if (authResponse.data.accessToken) {
        // Tokens are automatically stored as HTTP-only cookies by the backend
        // Navigate to verify-auth to complete the authentication flow
        navigate(ROUTES.VERIFY_AUTH);
      }
    } catch (err) {
      console.error('Google login error:', err);
      setError('Google authentication failed');
    }
  };

  const onGoogleLoginError = () => {
    console.log('Google error');
    setError('Google authentication failed');
  };

  const validateInputs = (email: string, password: string) => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!validateInputs(email, password)) return;

    try {
      await api.post("/auth/login", { email, password });
      navigate(ROUTES.VERIFY_AUTH);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "An error occurred during login");
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white/90 backdrop-blur-sm shadow-sm border border-gray-100 rounded-2xl p-8 space-y-6">
            {/* Logo and Brand */}
            <div className="flex flex-col items-center">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-xl shadow-lg mb-4">
                <Utensils className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                SmartEat
              </h1>
              <p className="mt-2 text-gray-500 text-center max-w-[250px]">
                Your personal nutrition companion
              </p>
            </div>

            {/* Welcome Text */}
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back
            </h2>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-3 py-2 border ${emailError ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                  placeholder="your@email.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`w-full px-3 py-2 border ${passwordError ? 'border-red-300' : 'border-gray-300'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500`}
                  placeholder="••••••"
                />
                {passwordError && (
                  <p className="mt-1 text-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all"
              >
                Sign in
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <div className="flex justify-center w-full">
              <div className="w-full">
                <GoogleLogin
                  onSuccess={onGoogleLoginSuccess}
                  onError={onGoogleLoginError}
                  useOneTap
                />
              </div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-gray-500">
              Don't have an account?{" "}
              <Link
                to={ROUTES.SIGNUP}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 