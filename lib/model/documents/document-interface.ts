
export interface Document {
    name: {
        name: string;
        options: {
            vector: {
                dimension: number;
                metric: string;
                sourceModel: string;
            };
        };
    },
    prefixMatched: boolean;
};

export interface Collections {
    collections: Document[];
}