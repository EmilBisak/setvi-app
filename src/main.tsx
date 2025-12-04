import React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import App from "./App";
import {ColorModeProvider} from "./context/ColorModeContext";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ColorModeProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </QueryClientProvider>
        </ColorModeProvider>
    </React.StrictMode>
);
