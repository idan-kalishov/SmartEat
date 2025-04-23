import React from "react";
import {Toaster} from "sonner";
import Routing from "@/Routing/Routing.tsx";

const App: React.FC = () => {
    return (
        <div>
            <Toaster position="bottom-center"/>
            <div>
                <Routing/>
            </div>
        </div>
    );
};

export default App;
