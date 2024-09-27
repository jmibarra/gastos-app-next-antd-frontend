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

    const totalExpensesAmount = expenses.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const totalSavingsAmount = 0;

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

    // Mapa para sumarizar las categorías con su color
    const categoryMap = {};

    // Recorrer el array de gastos
    expenses.forEach((expense) => {
        const categoryName = expense?.category.name;
        const categoryColor = expense?.category.color;
        const amount = expense.amount;

        // Sumarizar el amount por categoría y guardar su color
        if (categoryMap[categoryName]) {
            categoryMap[categoryName].value += amount;
        } else {
            categoryMap[categoryName] = { value: amount, color: categoryColor };
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

    console.log(pieData);

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
