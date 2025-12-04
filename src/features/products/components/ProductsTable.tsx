import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {FixedSizeList, ListOnItemsRenderedProps} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import {Product} from "../../../types/product";
import {useProductsInfinite} from "../hooks/useProductsQuery";


type Props = {
    q?: string;
    category?: string;
    page: number;
    onPageChange: (page: number) => void;
    onRowClick: (id: number) => void;
    screenHeight?: number;
};

const ROW_HEIGHT = 72;
const HEADER_HEIGHT = 56;

export default function ProductsTable(
    {
        q,
        category,
        page,
        onPageChange,
        onRowClick,
        screenHeight,
    }: Props) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
        error,
    } = useProductsInfinite({q, category});


    // prefetch pages until we reach the page value from the URL
    useEffect(() => {
        if (!data) return;
        const loadedPages = data.pages.length;

        if (page > loadedPages && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [page, data, hasNextPage, isFetchingNextPage, fetchNextPage]);


    const items: Product[] = useMemo(
        () => (data ? data.pages.flatMap((p) => p.products) : []),
        [data]
    );

    const itemCount: number = items.length + (hasNextPage ? 1 : 0);

    const listRef = useRef<FixedSizeList | null>(null);

    const handleItemsRendered = ({
                                     visibleStopIndex
                                 }: ListOnItemsRenderedProps) => {
        if (
            hasNextPage &&
            !isFetchingNextPage &&
            visibleStopIndex >= itemCount - 1
        ) {
            void fetchNextPage().then(() => {
                onPageChange(page + 1);
            });
        }
    };

    const Row = useCallback(
        ({index, style}: {
            index: number;
            style: React.CSSProperties
        }) => {
            const isLoaderRow: boolean = index === itemCount - 1 && hasNextPage;

            if (isLoaderRow) {
                return (
                    <Box
                        component="div"
                        style={style}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        role="row"
                    >
                        <CircularProgress size={24}/>
                    </Box>
                );
            }

            const product: Product = items[index];

            return (
                <Box
                    component="div"
                    style={style}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        px: 2,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        cursor: "pointer",
                    }}
                    role="row"
                    onClick={() => onRowClick(product.id)}
                >
                    <Box
                        component="div"
                        role="cell"
                        sx={{
                            width: 72,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            pr: 1,
                        }}
                    >
                        <Avatar
                            src={product.thumbnail}
                            alt={product.title}
                            variant="rounded"
                        />
                    </Box>

                    <Box
                        component="div"
                        role="cell"
                        sx={{flex: 1, pr: 2}}
                    >
                        <Typography noWrap>{product.title}</Typography>
                    </Box>

                    <Box
                        component="div"
                        role="cell"
                        sx={{width: 160, pr: 2}}
                    >
                        <Typography noWrap>{product.category}</Typography>
                    </Box>

                    <Box
                        component="div"
                        role="cell"
                        sx={{width: 120, pr: 2}}
                    >
                        ${product.price}
                    </Box>

                    <Box
                        component="div"
                        role="cell"
                        sx={{width: 100}}
                    >
                        {product.rating}
                    </Box>
                </Box>
            );
        },
        [items, itemCount, hasNextPage, onRowClick]
    );

    const effectiveHeight: number = screenHeight && screenHeight > 300 ? screenHeight - 220 : 500;

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                mt={4}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box mt={4}>
                <Typography color="error">
                    Failed to load products: {error?.message}
                </Typography>
            </Box>
        );
    }

    if (items.length === 0) {
        return (
            <Box mt={4}>
                <Typography>No products found.</Typography>
            </Box>
        );
    }

    return (
        <Paper
            sx={{
                height: effectiveHeight,
                width: "100%",
                overflow: "hidden",
            }}
        >
            <Box
                component="div"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 2,
                    height: HEADER_HEIGHT,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    typography: "subtitle2",
                }}
                role="row"
            >
                <Box sx={{width: 72}}>Thumb</Box>
                <Box sx={{flex: 1}}>Title</Box>
                <Box sx={{width: 160}}>Category</Box>
                <Box sx={{width: 120}}>Price</Box>
                <Box sx={{width: 100}}>Rating</Box>
            </Box>

            <Box sx={{height: effectiveHeight - HEADER_HEIGHT}}>
                <AutoSizer>
                    {({height, width}) => (
                        <FixedSizeList
                            height={height}
                            width={width}
                            itemCount={itemCount}
                            itemSize={ROW_HEIGHT}
                            onItemsRendered={handleItemsRendered}
                            ref={listRef}
                        >
                            {Row}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </Box>
        </Paper>
    );
}
