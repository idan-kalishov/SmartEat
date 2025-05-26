import React from "react";
import {Toaster} from "sonner";
import Routing from "@/Routing/Routing.tsx";
import BottomNavbar from "@/components/BottomNavbar.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Toaster position="bottom-center"/>
            <div>
                <Routing/>
            </div>
            <BottomNavbar/>
        </div>
    );
};

export default App;
