import {useInfiniteQuery, useQuery} from "@tanstack/react-query";

import {fetchCategories, fetchProducts, ProductsListResponse,} from "../../../api/products";

import {Category} from "../../../types/category";


const LIMIT = 20;

export function useProductsInfinite({
                                        q,
                                        category,
                                    }: {
    q?: string;
    category?: string;
}) {
    return useInfiniteQuery<ProductsListResponse, Error>({
        queryKey: ["products", {q: q ?? "", category: category ?? ""}],
        queryFn: async ({pageParam = 0}) =>
            fetchProducts({
                limit: LIMIT,
                skip: pageParam as number,
                q,
                category,
            }),
        getNextPageParam: (lastPage, pages) => {
            const fetched: number = pages.reduce(
                (acc, p) => acc + p.products.length,
                0
            );
            return fetched < lastPage.total ? fetched : undefined;
        },
        initialPageParam: 0,
        staleTime: 1000 * 60 * 2,
    });
}

export function useCategories() {
    return useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 10,
    });
}

export const PAGE_LIMIT = LIMIT;
