// src/utils/investmentUtils.ts

import { IInvestment } from "@/app/investments/models";


export class InvestmentUtils {
    
    static calculateInvestmentCurrentValue(record: IInvestment): number {
        if (!record.currentPrice || !record.quantity) {
            return 0;
        }

        let actualRecordCurrentPrice = 0;

        if (record.type === "Bonos" || record.type === "Obligación Negociable") {
            actualRecordCurrentPrice = record.currentPrice / 100;
        } else {
            actualRecordCurrentPrice = record.currentPrice;
        }

        return actualRecordCurrentPrice * record.quantity;
    }

    static calculateInvestmentTotalInvestment(record: IInvestment): number {
        if (!record.averagePurchasePrice || !record.quantity) {
            return 0;
        }

        let actualRecordCurrentPrice = 0;

        if (record.type === "Bonos" || record.type === "Obligación Negociable") {
            actualRecordCurrentPrice = record.averagePurchasePrice / 100;
        } else {
            actualRecordCurrentPrice = record.averagePurchasePrice;
        }

        return actualRecordCurrentPrice * record.quantity;
    }

    static calculateInvestmentEarningPorcentage(record: IInvestment): number {
        return (
            (InvestmentUtils.calculateInvestmentCurrentValue(record) /
                InvestmentUtils.calculateInvestmentTotalInvestment(record)) *
                100 -
            100
        );
    }
}
