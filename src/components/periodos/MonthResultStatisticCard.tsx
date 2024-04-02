import { IExpense } from "@/app/period/[period]/models/expense.model";
import { IIncome } from "@/app/period/[period]/models/income.model";
import { RiseOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const MonthResultStatisticCard = (params: {
    incomes: IIncome[];
    expenses: IExpense[];
}) => {
    const { incomes, expenses } = params;

    const filteredIncomesData = incomes.filter((item) => item.amount !== null);
    const filteredExpensesData = expenses.filter(
        (item) => item.amount !== null
    );
    const totalIncomesAmount = filteredIncomesData.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const totalExpensesAmount = filteredExpensesData.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const totalAmount = totalIncomesAmount - totalExpensesAmount;

    if (totalAmount < 0) {
    }

    return (
        <Card bordered={false}>
            <Statistic
                title="Saldo mensual"
                value={totalAmount}
                precision={2}
                valueStyle={{ color: totalAmount > 0 ? "#3f8600" : "#cf1322" }}
                prefix={<RiseOutlined />}
                suffix="$"
            />
        </Card>
    );
};
