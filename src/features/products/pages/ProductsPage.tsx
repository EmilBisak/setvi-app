import React, {useCallback, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";

import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import ProductsTable from "../components/ProductsTable";
import ProductDetailDrawer from "../components/ProductDetailDrawer";

import {useCategories} from "../hooks/useProductsQuery";
import {useDebounce} from "../../../utils/debounce";

import {Category} from "../../../types/category";

const ProductsPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    // URL params - local state
    const qParam: string = searchParams.get("q") ?? "";
    const [q, setQ] = useState<string>(qParam);
    const debouncedQ: string = useDebounce(q, 300); // debounced search: ~300ms

    const categoryParam = searchParams.get("category") ?? "";
    const [category, setCategory] = useState<string>(categoryParam); // slug

    const pageParam = parseInt(searchParams.get("page") ?? "1", 10);
    const [page, setPage] = useState<number>(
        Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam
    );

    // categories
    const categoriesQuery = useCategories();
    const categories: Category[] = categoriesQuery.data ?? [];

    // drawer state
    const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
    const [drawerOpen, setDrawerOpen] = useState(false);


    // screen height for virtualized list
    const [screenHeight, setScreenHeight] = useState<number>(() => window.innerHeight);
    const debouncedScreenHeight = useDebounce(screenHeight, 300);

    // handle set screen height
    useEffect(() => {
        const handleResize = () => {
            setScreenHeight(window.innerHeight);
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // sync local state -> URL (q, category, page)
    useEffect(() => {
        const params: Record<string, string> = {};

        if (debouncedQ) params.q = debouncedQ;
        if (category) params.category = category;
        if (page > 1) params.page = String(page);

        setSearchParams(params);
    }, [debouncedQ, category, page, setSearchParams]);


    const handleSearchChange = (value: string) => {
        setQ(value);
        setPage(1); // on a new search, start from page one
    };

    const handleCategoryChange = (slug: string) => {
        setCategory(slug);
        setPage(1); // "when a new category is selected, start from page one
    };

    const handleReset = () => {
        setQ("");
        setCategory("");
        setPage(1);
        setSearchParams({});
    };

    const onRowClick = useCallback((id: number) => {
        setSelectedId(id);
        setDrawerOpen(true);
    }, []);

    const handleCloseDrawer = () => setDrawerOpen(false);


    return (
        <Box>
            <Grid
                container
                spacing={2}
                sx={{mb: 2}}
                alignItems="center"
            >
                {/* search */}
                <Grid size={{xs: 12, sm: 6}}>
                    <TextField
                        fullWidth
                        label="Search products"
                        value={q}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search..."
                    />
                </Grid>

                {/* category */}
                <Grid size={{xs: 8, sm: 4}}>
                    <Autocomplete<Category, false, false, false>
                        fullWidth
                        options={categories}
                        loading={categoriesQuery.isLoading}
                        value={categories.find((c) => c.slug === category) ?? null}
                        onChange={(_event, newValue) => {
                            handleCategoryChange(newValue?.slug ?? "");
                        }}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) => option.slug === value.slug}
                        clearOnEscape
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Category"
                                placeholder="All categories"
                            />
                        )}
                    />
                </Grid>

                {/* reset */}
                <Grid size={{xs: 4, sm: 2}}>
                    <Button fullWidth
                            onClick={handleReset}>
                        Reset
                    </Button>
                </Grid>
            </Grid>

            {/* virtualized products table */}
            <ProductsTable
                q={debouncedQ}
                category={category}
                page={page}
                onPageChange={setPage}
                onRowClick={onRowClick}
                screenHeight={debouncedScreenHeight}
            />

            {/* detail drawer */}
            <ProductDetailDrawer
                id={selectedId}
                open={drawerOpen}
                onClose={handleCloseDrawer}
            />
        </Box>
    );
};

export default ProductsPage;
