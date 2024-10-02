"use client";
import { IExpense, IIncome } from "../models";
import { createExpense, getExpensesByPeriod } from "./expenses.service";
import { createIncome, getIncomesByPeriod } from "./incomes.service";

export const copyPeriodData = async (originPeriod: string, destinationPeriod: string, authToken: string) => {
    const periodExpenses: IExpense[] = await getExpensesByPeriod(originPeriod, authToken);
    const periodIncomes: IIncome[] = await getIncomesByPeriod(originPeriod, authToken);

    console.log(periodExpenses)
    if(periodExpenses.length > 0) { 
        periodExpenses.forEach(async (expense) => {
            expense.period = destinationPeriod;
            expense.status = "65d0fb6db33cebd95694e233";
            createExpense(expense, authToken);
        });
    }

    if(periodIncomes.length > 0) {
        periodIncomes.forEach(async (income: IIncome) => {
            income.period = destinationPeriod;
            income.status = "65d0fb6db33cebd95694e233";
            createIncome(income, authToken);
        });
    }
};
