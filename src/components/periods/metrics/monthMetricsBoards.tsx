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

    console.log(expenses);

    //Contemplar que amount puede ser null
    const filteredIncomes = incomes.filter((income) => income.amount !== null);
    const totalIncomesAmount = filteredIncomes.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const filteredExpenses = expenses.filter(
        (expense) => expense.category && expense.category?.name !== "Ahorros"
    );
    const totalExpensesAmount = filteredExpenses.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const filteredSavings = expenses.filter(
        (expense) => expense.category && expense.category?.name === "Ahorros"
    );
    const totalSavingsAmount = filteredSavings.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const monthFinalBalance =
        totalIncomesAmount - totalExpensesAmount - totalSavingsAmount;

    const barData = [
        {
            registro: "Mes actual",
            Gastos: totalExpensesAmount,
            Ingresos: totalIncomesAmount,
            Ahorros: totalSavingsAmount,
        },
    ];

    const pieData = getCategoryPieData();

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    // Mapa para sumarizar las categorías con su color
    function getCategoryPieData() {
        const categoryMap: Record<string, { value: number; color: string }> =
            {};

        // Recorrer el array de gastos
        expenses.forEach((expense) => {
            const categoryName =
                expense.category && typeof expense.category === "object"
                    ? expense.category.name
                    : "Sin categoría";
            const categoryColor =
                expense.category && typeof expense.category === "object"
                    ? expense.category.color
                    : "#000";
            const amount = expense.amount ?? 0;

            // Sumarizar el amount por categoría y guardar su color
            if (categoryMap[categoryName]) {
                categoryMap[categoryName].value += amount;
            } else {
                categoryMap[categoryName] = {
                    value: amount,
                    color: categoryColor,
                };
            }
        });

        // Convertir el mapa en el formato pieData
        const pieData = Object.entries(categoryMap).map(
            ([name, { value, color }]) => ({
                name,
                value,
                color,
            })
        );
        return pieData;
    }

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
                        <BarChart width={500} height={300} data={barData}>
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
                        <PieChart
                            width={500}
                            height={300}
                            style={{ marginLeft: "auto", marginRight: "auto" }}
                        >
                            <Pie
                                data={pieData}
                                cx={250}
                                cy={115}
                                outerRadius={120}
                                dataKey="value"
                                labelLine={false}
                                label={renderCustomizedLabel}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
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
