import React from "react";

import {Theme, useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import ProductDetailContent from "./ProductDetailContent";


type ProductDetailDrawerProps = {
    id?: number;
    open: boolean;
    onClose: () => void;
};

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({id, open, onClose}) => {
    const hasProduct: boolean = typeof id === "number";

    const theme: Theme = useTheme();
    const isMobile: boolean = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    sx: {
                        width: {xs: "100vw", sm: 520},
                    },
                }
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Typography variant="body1">
                    Product Details
                </Typography>

                {isMobile && (
                    <IconButton onClick={onClose}>
                        <CloseIcon/>
                    </IconButton>
                )}
            </Box>
            
            <Box sx={{p: 3}}>
                {hasProduct ? (
                    // key ensures that the internal state resets when the id changes
                    <ProductDetailContent
                        key={id}
                        id={id!}
                    />
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        No product selected.
                    </Typography>
                )}
            </Box>
        </Drawer>
    );
};

export default ProductDetailDrawer;
