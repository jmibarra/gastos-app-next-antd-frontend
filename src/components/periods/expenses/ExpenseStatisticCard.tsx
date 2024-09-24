import { IExpense } from "@/app/period/[period]/models/expense.model";
import { MinusCircleOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const ExpenseStatisticCard = (params: { data: IExpense[] }) => {
    const { data } = params;

    //Contemplar que amount puede ser null
    const totalAmount = data.reduce((acc, curr) => acc + curr.amount, 0);
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
