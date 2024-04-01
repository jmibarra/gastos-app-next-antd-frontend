export interface IIncome {
    _id: string;
    title: string;
    date?: string;
    period: string;
    status: Status | string;
    amount?: number;
    type?: string;
    owner?: string;
}

export interface Status {
    _id: string;
    name: string;
    color: string;
    owner: string;
}