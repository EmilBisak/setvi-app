import React from "react";
import {Routes, Route} from "react-router-dom";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductsPage from "./features/products/pages/ProductsPage";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
    return (
        <Container
            maxWidth="lg"
            sx={{py: 4}}
        >
            <Box
                mb={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
            >
                <Typography variant="h4">SETVI Products</Typography>
                <ThemeToggle/>
            </Box>

            <Routes>
                <Route
                    path="/"
                    element={<ProductsPage/>}
                />
            </Routes>
        </Container>
    );
}
