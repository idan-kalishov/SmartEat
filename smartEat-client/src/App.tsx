import Routing from "@/Routing/Routing.tsx";
import BottomNavbar from "@/components/BottomNavbar.tsx";
import React from "react";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <div>
      <Toaster position="bottom-center" />
      <div>
        <Routing />
      </div>
      <BottomNavbar />
    </div>
  );
};

export default App;
