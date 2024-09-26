import { Status } from "../../../settings/status/models/status.model";

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