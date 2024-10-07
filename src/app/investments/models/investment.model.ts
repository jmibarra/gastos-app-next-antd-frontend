export interface IInvestment {
    _id: string;
    name: string;
    ticker: string;
    averagePurchasePrice?: number;
    quantity?: number;
    type: string;
    owner?: string;
}