import { ICategory } from "@/app/category/models";
import { Status } from "./status.model";

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