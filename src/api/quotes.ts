import type {QuotesResponse} from "../types/quotes";

export async function fetchCombinedQuotes(): Promise<string> {
    const res = await fetch("https://dummyjson.com/quotes");
    if (!res.ok) {
        throw new Error("Failed to fetch quotes");
    }

    const data: QuotesResponse = await res.json();

    return data.quotes.map((q) => q.quote).join(" ");
}
