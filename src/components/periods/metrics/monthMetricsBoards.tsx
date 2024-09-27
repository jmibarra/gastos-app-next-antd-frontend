import { Card, Col, Row, Tooltip } from "antd";
import React from "react";
import { IncomeStatisticCard } from "../incomes/IncomeStatisticCard";
import { ExpenseStatisticCard } from "../expenses/ExpenseStatisticCard";
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
} from "recharts";

const MonthMetricsBoards = (params: {
    incomes: IIncome[];
    expenses: IExpense[];
}) => {
    const { incomes, expenses } = params;

    //Contemplar que amount puede ser null
    const filteredIncomes = incomes.filter((income) => income.amount !== null);
    const totalIncomesAmount = filteredIncomes.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const totalExpensesAmount = expenses.reduce(
        (acc, curr) => acc + curr.amount,
        0
    );

    const monthFinalBalance = totalIncomesAmount - totalExpensesAmount;

    const pieData = [
        { name: "Acciones", value: 60 },
        { name: "Bonos", value: 40 },
    ];

    const barData = [
        { registro: "Gastos", rendimiento: totalExpensesAmount },
        { registro: "Ingresos", rendimiento: totalIncomesAmount },
        { registro: "Ahorros", rendimiento: 10000 },
    ];

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    return (
        <>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                    <IncomeStatisticCard totalAmount={totalIncomesAmount} />
                </Col>
                <Col className="gutter-row" span={8}>
                    <ExpenseStatisticCard totalAmount={totalExpensesAmount} />
                </Col>
                <Col className="gutter-row" span={8}>
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
                    <Card title="Rendimiento por Mes">
                        <BarChart width={400} height={300} data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="registro" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="rendimiento" fill={COLORS[0]} />
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
