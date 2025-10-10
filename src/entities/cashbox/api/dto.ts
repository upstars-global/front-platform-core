import { TransactionType } from "./resources";

export type InitPaymentDTO = {
    amount: number;
    route_name: string;
    dfpc: string;
}

export type LoadTransactionHistoryDTO = {
    page?: number;
    perPage?: number;
    type: TransactionType;
    dateFrom?: string,
    dateTo?: string,
}

export enum PayoutFlow {
    HARD = "hard",
    SIMPLE = "simple",
}

