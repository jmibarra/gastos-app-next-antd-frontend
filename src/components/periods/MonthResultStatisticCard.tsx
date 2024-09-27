import { IExpense } from "@/app/period/[period]/models/expense.model";
import { IIncome } from "@/app/period/[period]/models/income.model";
import { FallOutlined, RiseOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import React from "react";

export const MonthResultStatisticCard = (params: {
    monthFinalBalance: number;
}) => {
    const { monthFinalBalance } = params;

    return (
        <Card bordered={false}>
            <Statistic
                title="Saldo mensual"
                value={monthFinalBalance}
                precision={2}
                valueStyle={{
                    color: monthFinalBalance > 0 ? "#3f8600" : "#cf1322",
                }}
                prefix={
                    monthFinalBalance > 0 ? <RiseOutlined /> : <FallOutlined />
                }
                suffix="$"
            />
        </Card>
    );
};
