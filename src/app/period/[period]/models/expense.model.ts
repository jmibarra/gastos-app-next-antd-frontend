import { ICategory } from "@/app/settings/category/models";
import { IStatus } from "../../../settings/status/models/status.model";

export interface IExpense {
    _id: string;
    title: string;
    dueDate?: string;
    period: string;
    status: IStatus | string;
    category?: ICategory | string;
    amount?: number;
    type?: string;
    owner?: string;
}