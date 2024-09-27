import { Card, Col, Row } from "antd";
import React from "react";
import { StatisticCard } from "./StatisticCard";
import { MonthResultStatisticCard } from "../MonthResultStatisticCard";
import { IExpense, IIncome } from "@/app/period/[period]/models";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    MinusCircleOutlined,
    PlusCircleOutlined,
    WalletOutlined,
} from "@ant-design/icons";

const MonthMetricsBoards = (params: {
    incomes: IIncome[];
    expenses: IExpense[];
}) => {
    const { incomes, expenses } = params;

    //Contemplar que amount puede ser null
    const filteredIncomes = incomes.filter((income) => income.amount !== null);
    const totalIncomesAmount = filteredIncomes.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const totalExpensesAmount = expenses.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const totalSavingsAmount = 0;

    const monthFinalBalance =
        totalIncomesAmount - totalExpensesAmount - totalSavingsAmount;

    const pieData = [
        { name: "Acciones", value: 60 },
        { name: "Bonos", value: 40 },
    ];

    const barData = [
        {
            registro: "Mes actual",
            Gastos: totalExpensesAmount,
            Ingresos: totalIncomesAmount,
            Ahorros: totalSavingsAmount,
        },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <StatisticCard
                        title="Ingresos"
                        color="#3f8600"
                        iconElement={<PlusCircleOutlined />}
                        totalAmount={totalIncomesAmount}
                    />
                </Col>
                <Col className="gutter-row" span={6}>
                    <StatisticCard
                        title="Gastos"
                        color="#cf1322"
                        iconElement={<MinusCircleOutlined />}
                        totalAmount={totalExpensesAmount}
                    />
                </Col>
                <Col className="gutter-row" span={6}>
                    <StatisticCard
                        title="Ahorros"
                        color="#0088FE"
                        iconElement={<WalletOutlined />}
                        totalAmount={totalSavingsAmount}
                    />
                </Col>
                <Col className="gutter-row" span={6}>
                    <MonthResultStatisticCard
                        monthFinalBalance={monthFinalBalance}
                    />
                </Col>
            </Row>
            <Row
                gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                style={{ marginTop: "20px" }}
            >
                <Col span={12}>
                    <Card title="Ingresos Gastos Ahorros">
                        <BarChart width={400} height={300} data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="registro" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Gastos" fill={"#cf1322"} />
                            <Bar dataKey="Ingresos" fill={"#3f8600"} />
                            <Bar dataKey="Ahorros" fill={"#0088FE"} />
                        </BarChart>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Categorias de gastos">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={pieData}
                                cx={200}
                                cy={150}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        name={entry.name}
                                    />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MonthMetricsBoards;
