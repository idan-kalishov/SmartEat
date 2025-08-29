import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Navigator {
    standalone?: boolean;
  }

  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// Improved platform detection
const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) && !window.navigator.standalone;
};

const isAndroid = () =>
  /android/.test(window.navigator.userAgent.toLowerCase());

const isInStandaloneMode = () =>
  window.navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;

const isChrome = () => /chrome/.test(window.navigator.userAgent.toLowerCase());

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIosMessage, setShowIosMessage] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(isInStandaloneMode());
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log("beforeinstallprompt event fired");
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      console.log("App was installed");
      setIsAppInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    // Check if on iOS
    if (isIos()) {
      setShowIosMessage(true);
      setShowInstallButton(false); // Hide install button on iOS
    } else if (isAndroid() && !isChrome()) {
      // Show instructions for Android browsers other than Chrome
      setShowAndroidInstructions(true);
      setShowInstallButton(false);
    } else if (isAndroid() && isChrome() && !isInStandaloneMode()) {
      // For Android Chrome, we might need to check if the app meets installation criteria
      // This is a basic check - you might need more sophisticated logic
      setTimeout(() => {
        if (!deferredPrompt) {
          setShowAndroidInstructions(true);
        }
      }, 3000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      console.log("No deferred prompt available");
      return;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);

      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      }

      setDeferredPrompt(null);
      setShowInstallButton(false);
    } catch (error) {
      console.error("Error prompting installation:", error);
    }
  };

  const checkPwaEligibility = () => {
    // Check if the PWA meets installation criteria
    // This is a simplified check - you might need more comprehensive validation
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      console.log("App is not in standalone mode");
    }

    if (!deferredPrompt) {
      console.log("No deferred prompt available");
      setShowAndroidInstructions(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-100 via-emerald-100 to-green-200 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="rounded-2xl border border-green-200 shadow-xl backdrop-blur-md bg-white/80">
          <CardHeader className="pt-8 pb-4 px-6 text-center">
            <motion.h1
              className="text-4xl font-extrabold text-green-700 leading-tight"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              Welcome to <span className="text-emerald-500">smartEat</span>
            </motion.h1>
            <p className="text-sm text-gray-500 mt-1">
              Your personal AI nutrition guide
            </p>
          </CardHeader>

          <CardContent className="space-y-6 py-8 px-6 sm:px-8">
            <motion.p
              className="text-gray-700 text-lg text-center font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Track your nutrition effortlessly with our app.
            </motion.p>

            {isAppInstalled ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full py-5 text-base font-semibold bg-green-600 hover:bg-green-700 transition-colors shadow"
                >
                  🚀 Open App
                </Button>
              </motion.div>
            ) : (
              <>
                {showInstallButton && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={handleInstallClick}
                      className="w-full py-5 text-base font-semibold bg-green-600 hover:bg-green-700 transition-colors shadow"
                    >
                      📲 Install App
                    </Button>
                  </motion.div>
                )}

                {showIosMessage && (
                  <motion.div
                    className="text-sm text-gray-800 bg-yellow-100 border border-yellow-300 p-4 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <strong>iPhone user?</strong> Tap <strong>Share</strong> in
                    Safari and select <strong>"Add to Home Screen"</strong> to
                    install smartEat.
                  </motion.div>
                )}

                {showAndroidInstructions && (
                  <motion.div
                    className="text-sm text-gray-800 bg-blue-100 border border-blue-300 p-4 rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <strong>Android user?</strong> To install this app:
                    <ol className="list-decimal list-inside mt-2 ml-2">
                      <li>Tap the menu button (⋮) in Chrome</li>
                      <li>Select "Add to Home screen"</li>
                      <li>Confirm the installation</li>
                    </ol>
                  </motion.div>
                )}
              </>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full py-5 text-base font-semibold border-green-300 text-green-700 hover:bg-green-50"
              >
                Get Started 🚀
              </Button>
            </motion.div>

            <motion.p
              className="text-xs text-gray-500 mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Nutrition tracking • Photo analysis • Personalized tips
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LandingPage;
