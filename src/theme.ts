import { createTheme } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                background: {
                    default: "#fafafa",
                    paper: "#fff",
                },
            }
            : {
                background: {
                    default: "#121212",
                    paper: "#1d1d1d",
                },
            }),
    },
});

export function createAppTheme(mode: "light" | "dark") {
    return createTheme(getDesignTokens(mode));
}
