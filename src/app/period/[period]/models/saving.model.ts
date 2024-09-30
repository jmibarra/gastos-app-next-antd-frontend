export interface ISaving {
    _id: string;
    period: string;
    description: string;
    amount: number;
    date: string;
    type: string;
    owner?: string;
}