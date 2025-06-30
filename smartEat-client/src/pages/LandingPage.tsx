import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

declare global {
  interface Navigator {
    standalone?: boolean;
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

const isIos = () =>
  /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
  !window.navigator.standalone;

const LandingPage = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIosMessage, setShowIosMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    if (isIos()) {
      setShowIosMessage(true);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);
    setDeferredPrompt(null);
    setShowInstallButton(false);
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
              Track your nutrition effortlessly with our PWA app.
            </motion.p>

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
                🌐 Continue in Browser
              </Button>
            </motion.div>

            <motion.p
              className="text-xs text-gray-500 mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              Nutrition tracking • Photo analysis • Personalized tips{" "}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LandingPage;
