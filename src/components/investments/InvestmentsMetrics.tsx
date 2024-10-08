import React from "react";
import { Typography, Row, Col, Card } from "antd";
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
} from "recharts";
import { IInvestment } from "@/app/investments/models";

const { Title, Paragraph } = Typography;

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

    // Luego puedes usar la función dentro de tu componente
    const barData = getBarData(groupedInvestments);

    return (
        <>
            <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={6}>
                    <Card>
                        <DollarOutlined
                            style={{ fontSize: "32px", color: "#3f8600" }}
                        />
                        <Title level={4}>Monto invertido</Title>
                        <Paragraph>
                            ${" "}
                            {totalInvestedAmount
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Paragraph>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <RiseOutlined
                            style={{ fontSize: "32px", color: "#3f8600" }}
                        />
                        <Title level={4}>Valor actual</Title>
                        <Paragraph>
                            ${" "}
                            {totalCurrentAmount
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Paragraph>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <LineChartOutlined
                            style={{ fontSize: "32px", color: "#1890ff" }}
                        />
                        <Title level={4}>Rendimiento</Title>
                        <Paragraph
                            style={{
                                color:
                                    (totalCurrentAmount / totalInvestedAmount) *
                                        100 -
                                        100 >
                                    0
                                        ? "green"
                                        : "red",
                            }}
                        >
                            {" "}
                            {(
                                (totalCurrentAmount / totalInvestedAmount) *
                                    100 -
                                100
                            ).toFixed(2)}{" "}
                            %
                        </Paragraph>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <BarChartOutlined
                            style={{ fontSize: "32px", color: "#fa8c16" }}
                        />
                        <Title level={4}>Ganancias Totales</Title>
                        <Paragraph
                            style={{
                                color:
                                    totalCurrentAmount / totalInvestedAmount > 0
                                        ? "green"
                                        : "red",
                            }}
                        >
                            ${" "}
                            {(totalCurrentAmount - totalInvestedAmount)
                                .toFixed(2)
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        </Paragraph>
                    </Card>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={12}>
                    <Card title="Composicion de la cartera">
                        <PieChart width={600} height={300}>
                            <Pie
                                data={pieData}
                                innerRadius={50}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={(entry) =>
                                    entry.name + ": " + entry.value + "%"
                                }
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
                    </Card>
                </Col>
                <Col span={12}>
                    <Card title="Total por instrumento">
                        <BarChart width={500} height={300} data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="registro" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="CEDEARS" fill={"#cf1322"} />
                            <Bar
                                dataKey="Obligaciones Negociables"
                                fill={"#3f8600"}
                            />
                            <Bar dataKey="Bonos" fill={"#0088FE"} />
                            <Bar dataKey="Efectivo" fill={"#fa8c16"} />
                        </BarChart>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default InvestmentsMetrics;
