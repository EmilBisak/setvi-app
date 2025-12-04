import React, {useCallback, useState} from "react";

import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";

import {useQuery} from "@tanstack/react-query";

import {useProductDetail} from "../hooks/useProductDetail";
import {fetchCombinedQuotes} from "../../../api/quotes";

import Typewriter from "../../../components/Typewriter";


type ProductDetailContentProps = {
    id: number;
};

const ProductDetailContent: React.FC<ProductDetailContentProps> = ({id}) => {
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    // summary per product, initialized from localStorage
    const [summary, setSummary] = useState<string | null>(() => {
        if (typeof window === "undefined") return null;
        const key = `summary_product_${id}`;
        return localStorage.getItem(key);
    });

    const {data, isLoading, isError} = useProductDetail(id);

    // quotes for the AI-style summary, loaded once and cached
    const quotesQuery = useQuery({
        queryKey: ["quotes"],
        queryFn: fetchCombinedQuotes,
        staleTime: 1000 * 60 * 60, // 1h
    });


    const handleGenerate = useCallback(() => {
        if (!quotesQuery.data || isGenerating) return;

        setIsGenerating(true);

        const baseText: string = quotesQuery.data;

        const storageKey: string = `summary_product_${id}`;

        try {
            localStorage.setItem(storageKey, baseText);
        } catch {
            // ignore
        }

        setSummary(baseText);
        setIsGenerating(false);
    }, [id, isGenerating, quotesQuery.data]);


    const handleClearSummary = useCallback(() => {
        const storageKey: string = `summary_product_${id}`;
        try {
            localStorage.removeItem(storageKey);
        } catch {
            // ignore
        }
        setSummary(null);
    }, [id]);


    if (isLoading) {
        return <CircularProgress/>;
    }

    if (isError || !data) {
        return (
            <Typography
                color="error"
                variant="body2"
            >
                Failed to load product details.
            </Typography>
        );
    }

    return (
        <>
            <Typography
                variant="h6"
                gutterBottom
            >
                {data.title}
            </Typography>
            <Typography
                variant="h6"
                gutterBottom
                style={{display: "flex", alignItems: "center", justifyContent: "start"}}
            >
                {data?.images?.map((_image, i) => (
                    <Avatar
                        src={data.images && data.images[i]}
                        alt={data.title}
                        variant="rounded"
                        sx={{mr: 2}}
                    />
                ))}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                gutterBottom
            >
                Category: {data.category}
            </Typography>

            <Stack
                direction="row"
                spacing={2}
                sx={{mb: 2}}
            >
                <Typography
                    variant="body1"
                    fontWeight={500}
                >
                    ${data.price}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Rating: {data.rating}/5
                </Typography>
            </Stack>

            {data.tags && data.tags.length > 0 && (
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{mb: 2, flexWrap: "wrap"}}
                >
                    {data.tags.map((tag) => (
                        <Chip
                            key={tag}
                            label={tag}
                            size="small"
                            sx={{mb: 0.5}}
                        />
                    ))}
                </Stack>
            )}

            <Typography
                variant="body2"
                sx={{mb: 3}}
            >
                {data.description}
            </Typography>

            <Divider sx={{my: 2}}/>

            <Box sx={{display: "flex", alignItems: "center", gap: 1, mb: 1}}>
                <Typography variant="subtitle1">AI Summary</Typography>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleGenerate}
                    disabled={
                        !quotesQuery.data ||
                        quotesQuery.isLoading ||
                        isGenerating ||
                        !!summary
                    }
                >
                    {summary
                        ? "Summary saved"
                        : isGenerating
                            ? "Generating..."
                            : "Generate Summary"}
                </Button>

                {summary && (
                    <Button
                        variant="text"
                        size="small"
                        onClick={handleClearSummary}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 2,
                    minHeight: 160,
                    fontSize: 14,
                    position: "relative",
                }}
            >
                {summary ? (
                    <Typewriter text={summary}/>
                ) : quotesQuery.isLoading ? (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                    >
                        <CircularProgress size={18}/>
                        <Typography variant="body2">Loading quotes…</Typography>
                    </Stack>
                ) : quotesQuery.isError ? (
                    <Typography
                        variant="body2"
                        color="error"
                    >
                        Could not load quotes for summary.
                    </Typography>
                ) : (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        Press <strong>Generate Summary</strong> to render an AI-style text
                        built from quotes.
                    </Typography>
                )}
            </Box>
        </>
    );
};

export default ProductDetailContent;
