import { ICategory } from "@/app/settings/category/models";
import { Status } from "../../../settings/status/models/status.model";

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