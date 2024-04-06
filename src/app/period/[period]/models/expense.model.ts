import { ICategory } from "@/app/category/models";

export interface IExpense {
    _id: string;
    title: string;
    dueDate?: string;
    period: string;
    status: Status | string;
    category?: ICategory | string;
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