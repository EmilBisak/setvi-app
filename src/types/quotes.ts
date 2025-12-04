export type QuotesResponse = {
    quotes: {
        id: number;
        quote: string;
        author: string
    }[];
    total: number;
    skip: number;
    limit: number;
};