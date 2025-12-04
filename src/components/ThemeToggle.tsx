import {useColorMode} from "../context/ColorModeContext";

import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";


const ThemeToggle = () => {
    const {mode, toggleColorMode} = useColorMode();

    return (
        <IconButton
            sx={{ml: 1}}
            onClick={toggleColorMode}
            color="inherit"
            style={{position: "relative", right: "-8px"}}
            title={mode === "dark" ? "Change to light theme" : "Change to dark theme"}
        >
            {mode === "dark" ? <Brightness7Icon/> : <Brightness4Icon/>}
        </IconButton>
    );
}

export default ThemeToggle;