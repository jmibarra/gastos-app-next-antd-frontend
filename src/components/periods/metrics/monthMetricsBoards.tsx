import { Card, Col, Row } from "antd";
import React from "react";
import { StatisticCard } from "./StatisticCard";
import { MonthResultStatisticCard } from "./MonthResultStatisticCard";
import { IExpense, IIncome, ISaving } from "@/app/period/[period]/models";
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
    ResponsiveContainer,
} from "recharts";
import {
    MinusCircleOutlined,
    PlusCircleOutlined,
    WalletOutlined,
} from "@ant-design/icons";

const MonthMetricsBoards = (params: {
    incomes: IIncome[];
    expenses: IExpense[];
    savings: ISaving[];
}) => {
    const { incomes, expenses, savings } = params;

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

    const incomingSavings = savings.filter(
        (saving) => saving.type === "Ingreso"
    );
    const totalIncomingSavingsAmount = incomingSavings.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );
    const outgoingSavings = savings.filter(
        (saving) => saving.type === "Egreso"
    );

    const totalOutgoingSavingsAmount = outgoingSavings.reduce(
        (acc, curr) => acc + (curr.amount ?? 0),
        0
    );

    const totalSavingsAmount =
        totalIncomingSavingsAmount - totalOutgoingSavingsAmount;

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

    // Define tu propia interfaz basada en las propiedades que esperas
    interface CustomLabelProps {
        cx: number;
        cy: number;
        midAngle: number;
        innerRadius: number;
        outerRadius: number;
        percent: number;
        index: number;
        // Agrega cualquier otra propiedad que recibas y uses aquí
    }

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }: CustomLabelProps) => { // <--- Usas tu tipo personalizado
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
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
                                data={barData}
                            >
                                <CartesianGrid />
                                <XAxis dataKey="registro" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="Gastos" fill={"#cf1322"} />
                                <Bar dataKey="Ingresos" fill={"#3f8600"} />
                                <Bar dataKey="Ahorros" fill={"#0088FE"} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Categorias de gastos">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart
                                style={{
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                }}
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
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default MonthMetricsBoards;
