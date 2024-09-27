import { Card, Statistic } from "antd";
import React from "react";

export const StatisticCard = (params: {
    title: string;
    color: string;
    iconElement: React.ReactNode;
    totalAmount: number;
}) => {
    const { title, color, iconElement, totalAmount } = params;

    return (
        <Card bordered={false}>
            <Statistic
                title={title}
                value={totalAmount}
                precision={2}
                valueStyle={{ color: color }}
                prefix={iconElement}
                suffix="$"
            />
        </Card>
    );
};
