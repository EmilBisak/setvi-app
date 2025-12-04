import {useQuery} from "@tanstack/react-query";

import {fetchProductDetail} from "../../../api/products";
import type {Product} from "../../../types/product";


export const useProductDetail = (id?: number) => useQuery<Product, Error>({
    queryKey: ["product", id],
    queryFn: () => fetchProductDetail(id!),
    enabled: typeof id === "number",
});
