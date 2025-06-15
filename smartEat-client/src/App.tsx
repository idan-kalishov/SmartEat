import Routing from "@/Routing/Routing.tsx";
import React from "react";
import {Toaster} from "sonner";

const App: React.FC = () => {
    return (
        <div>
            <Toaster position="bottom-center"/>
            <Routing/>
        </div>
    );
};

export default App;
