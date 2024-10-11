import React from "react";
import { Row, Col, Card, Statistic } from "antd";
import {
    BarChartOutlined,
    DollarOutlined,
    LineChartOutlined,
    RiseOutlined,
} from "@ant-design/icons";
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    Label,
    ResponsiveContainer,
} from "recharts";
import { IInvestment } from "@/app/investments/models";

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#3f8600"];

const InvestmentsMetrics = (params: { investments: IInvestment[] }) => {
    const { investments } = params;

    // Agrupamos las inversiones por tipo y sumamos los valores absolutos
    const groupedInvestments = investments.reduce((acc, investment) => {
        const { type, quantity = 0, averagePurchasePrice = 0 } = investment;

        // Verificamos si el tipo es "Bonos" o "Obligación Negociable"
        const investmentValue =
            type === "Bonos" || type === "Obligación Negociable"
                ? quantity * (averagePurchasePrice / 100) // Cálculo especial para estos tipos
                : quantity * averagePurchasePrice;

        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type] += investmentValue;

        return acc;
    }, {} as Record<string, number>);

    // Calculamos el valor total de todas las inversiones
    const totalInvestedAmount = investments.reduce((acc, investment) => {
        const { quantity = 0, averagePurchasePrice = 0, type } = investment;

        // Verificamos si el tipo es "Bonos" o "Obligación Negociable"
        const investmentValue =
            type === "Bonos" || type === "Obligación Negociable"
                ? quantity * (averagePurchasePrice / 100) // Cálculo especial para estos tipos
                : quantity * averagePurchasePrice;

        return acc + investmentValue;
    }, 0);

    // Calculamos el valor total de todas las inversiones
    const totalCurrentAmount = investments.reduce((acc, investment) => {
        const { quantity = 0, currentPrice = 0, type } = investment;

        // Verificamos si el tipo es "Bonos" o "Obligación Negociable"
        const investmentValue =
            type === "Bonos" || type === "Obligación Negociable"
                ? quantity * (currentPrice / 100) // Cálculo especial para estos tipos
                : quantity * currentPrice;

        return acc + investmentValue;
    }, 0);

    const getPieData = (
        groupedInvestments: Record<string, number>,
        totalValue: number
    ) => {
        // Convertimos los valores agrupados a porcentajes
        return Object.keys(groupedInvestments).map((type) => ({
            name: type,
            value: parseFloat(
                ((groupedInvestments[type] / totalValue) * 100).toFixed(2) // Convertimos a porcentaje y redondeamos a 2 decimales
            ),
        }));
    };

    // Luego puedes usar la función dentro de tu componente
    const pieData = getPieData(groupedInvestments, totalInvestedAmount);

    const getBarData = (groupedInvestments: Record<string, number>) => {
        // Creamos el formato para barData con los tipos conocidos
        return [
            {
                registro: "Mes actual", // Etiqueta general para el registro
                CEDEARS: groupedInvestments["CEDEARS"] || 0, // Si no existe, el valor es 0
                "Obligaciones Negociables":
                    groupedInvestments["Obligación Negociable"] || 0,
                Bonos: groupedInvestments["Bonos"] || 0,
                Efectivo: groupedInvestments["Efectivo"] || 0, // Añadir otros tipos según sea necesario
            },
        ];
    };

    const formatter = (value: number) => {
        return `${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $`;
    };

    // Luego puedes usar la función dentro de tu componente
    const barData = getBarData(groupedInvestments);

    return (
        <>
            <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Valor actual"
                            value={totalCurrentAmount}
                            suffix="$"
                            precision={2}
                            prefix={<RiseOutlined />}
                            valueStyle={{ color: "#1890ff" }}
                        ></Statistic>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total invertido"
                            value={totalInvestedAmount}
                            suffix="$"
                            precision={2}
                            prefix={<DollarOutlined />}
                        ></Statistic>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Rendimiento"
                            value={
                                (totalCurrentAmount / totalInvestedAmount) *
                                    100 -
                                100
                            }
                            precision={2}
                            valueStyle={{
                                color:
                                    (totalCurrentAmount / totalInvestedAmount) *
                                        100 -
                                        100 >
                                    0
                                        ? "green"
                                        : "red",
                            }}
                            prefix={<LineChartOutlined />}
                            suffix="%"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Ganancias totales"
                            value={totalCurrentAmount - totalInvestedAmount}
                            precision={2}
                            valueStyle={{
                                color:
                                    totalCurrentAmount - totalInvestedAmount > 0
                                        ? "green"
                                        : "red",
                            }}
                            prefix={<BarChartOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={12}>
                    <Card title="Composicion de la cartera">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    innerRadius={50}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={(entry) => entry.value + "%"}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Total por instrumento">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="registro" />
                                <YAxis />
                                <Tooltip formatter={formatter} />
                                <Legend />
                                <Bar dataKey="CEDEARS" fill={"#cf1322"} />
                                <Bar
                                    dataKey="Obligaciones Negociables"
                                    fill={"#3f8600"}
                                />
                                <Bar dataKey="Bonos" fill={"#0088FE"} />
                                <Bar dataKey="Efectivo" fill={"#fa8c16"} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default InvestmentsMetrics;
