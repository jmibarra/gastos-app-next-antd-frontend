import { IExpense } from "@/app/period/[period]/models/expense.model";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const ExpenseStatisticCard = (params: { totalAmount: number }) => {
    const { totalAmount } = params;

    return (
        <Card bordered={false}>
            <Statistic
                title="Gastos"
                value={totalAmount}
                precision={2}
                valueStyle={{ color: "#cf1322" }}
                prefix={<MinusCircleOutlined />}
                suffix="$"
            />
        </Card>
    );
};
