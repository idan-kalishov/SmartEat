import { useEffect } from "react";

const useScrollLock = () => {
  useEffect(() => {
    document.documentElement.style.overflow = "hidden"; // Disable vertical scrolling
    document.body.style.overflow = "hidden"; // Disable horizontal scrolling

    return () => {
      document.documentElement.style.overflow = ""; // Re-enable scrolling on unmount
      document.body.style.overflow = "";
    };
  }, []);
};

export default useScrollLock;
