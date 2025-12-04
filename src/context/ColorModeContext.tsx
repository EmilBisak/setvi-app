import React, {createContext, useCallback, useContext, useMemo, useState} from "react";

import {ThemeProvider, CssBaseline, GlobalStyles} from "@mui/material";

import {createAppTheme} from "../theme";


type ColorMode = "light" | "dark";

type ColorModeContextType = {
    mode: ColorMode;
    toggleColorMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextType>({
    mode: "light",
    toggleColorMode: () => {
    },
});


export const ColorModeProvider = ({children}: {
    children: React.ReactNode
}) => {
    const stored = (localStorage.getItem("color-mode") as ColorMode) || "light";
    const [mode, setMode] = useState<ColorMode>(stored);

    const toggleColorMode = useCallback(() => {
        setMode((prev) => {
            const next = prev === "light" ? "dark" : "light";
            localStorage.setItem("color-mode", next);
            return next;
        });
    }, []);

    const theme = useMemo(() => createAppTheme(mode), [mode]);

    const value = useMemo(
        () => ({
            mode,
            toggleColorMode,
        }),
        [mode, toggleColorMode]
    );

    return (
        <ColorModeContext.Provider value={value}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>

                <GlobalStyles
                    styles={(theme) => ({
                        "*::-webkit-scrollbar": {
                            width: "10px",
                            height: "10px"
                        },
                        "*::-webkit-scrollbar-track": {
                            background:
                                theme.palette.mode === "dark" ? "#1a1a1a" : "#e0e0e0"
                        },
                        "*::-webkit-scrollbar-thumb": {
                            background:
                                theme.palette.mode === "dark" ? "#555" : "#bdbdbd",
                            borderRadius: "10px"
                        },
                        "*::-webkit-scrollbar-thumb:hover": {
                            background:
                                theme.palette.mode === "dark" ? "#666" : "#9e9e9e"
                        }
                    })}
                />

                {children}
            </ThemeProvider>
        </ColorModeContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useColorMode = () => useContext(ColorModeContext);

