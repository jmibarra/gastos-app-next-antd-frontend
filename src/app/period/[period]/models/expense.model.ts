export interface IExpense {
    _id: string;
    title: string;
    dueDate?: string;
    period: string;
    status: Status | string;
    category?: Category | string;
    amount?: number;
    type?: string;
    owner?: string;
}

export interface IExpensePlain {
    _id: string;
    title: string;
    dueDate?: string;
    period: string;
    status: string;
    category?: string;
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
export interface Category {
    _id: string;
    name: string;
    color: string;
    icon: string;
    owner: string;
}