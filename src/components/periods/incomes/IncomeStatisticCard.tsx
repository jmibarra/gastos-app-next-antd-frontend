import { IIncome } from "@/app/period/[period]/models/income.model";
import { PlusCircleOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const IncomeStatisticCard = (params: { totalAmount: number }) => {
    const { totalAmount } = params;

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
