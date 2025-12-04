import React from "react";

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ProductDetailContent from "./ProductDetailContent";


type ProductDetailDrawerProps = {
    id?: number;
    open: boolean;
    onClose: () => void;
};

const ProductDetailDrawer: React.FC<ProductDetailDrawerProps> = ({id, open, onClose}) => {
    const hasProduct: boolean = typeof id === "number";

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
        >
            <Box sx={{width: {xs: "100vw", sm: 520}, p: 3}}>
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
