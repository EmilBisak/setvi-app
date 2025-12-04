import type {Product} from "../types/product";
import {Category} from "../types/category";

export type ProductsListResponse = {
    products: Product[];
    total: number;
    skip: number;
    limit: number;
};

type FetchProductsParams = {
    limit: number;
    skip: number;
    q?: string;
    category?: string;
};


export async function fetchProducts({
                                        limit,
                                        skip,
                                        q,
                                        category,
                                    }: FetchProductsParams): Promise<ProductsListResponse> {
    const params = new URLSearchParams({
        limit: String(limit),
        skip: String(skip),
    });

    let url: string;

    if (q && q.trim()) {
        params.set("q", q.trim());
        url = `https://dummyjson.com/products/search?${params.toString()}`;
    } else if (category && category.trim()) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(
            category
        )}?${params.toString()}`;
    } else {
        url = `https://dummyjson.com/products?${params.toString()}`;
    }

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }
    return res.json();
}

export async function fetchCategories(): Promise<Category[]> {
    const res = await fetch("https://dummyjson.com/products/categories");
    if (!res.ok) {
        throw new Error("Failed to fetch categories");
    }
    return res.json();
}

export async function fetchProductDetail(id: number): Promise<Product> {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) {
        throw new Error("Failed to fetch product detail");
    }
    return res.json();
}
