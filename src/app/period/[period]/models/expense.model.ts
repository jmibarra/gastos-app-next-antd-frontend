export interface IExpense {
    _id: string;
    title: string;
    dueDate?: string;
    period: string;
    status: Status;
    category?: Category;
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