import { IExpense } from "@/app/period/[period]/models/expense.model";
import { IIncome } from "@/app/period/[period]/models/income.model";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const IncomeStatisticCard = (params: { data: IIncome[] }) => {
    const { data } = params;

    //Contemplar que amount puede ser null
    const filteredData = data.filter((item) => item.amount !== null);
    const totalAmount = filteredData.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );
    return (
        <Card bordered={false}>
            <Statistic
                title="Ingresos"
                value={totalAmount}
                precision={2}
                valueStyle={{ color: "#3f8600" }}
                prefix={<PlusCircleOutlined />}
                suffix="$"
            />
        </Card>
    );
};
