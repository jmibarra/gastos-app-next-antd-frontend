// src/app/investments/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Typography, Button, Card, Row, Col } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "../authenticated/page";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";
import {
    DollarOutlined,
    LineChartOutlined,
    PieChartOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { getExpensesByCategory } from "../period/[period]/services";

const { Title, Paragraph } = Typography;

const lineData = [
    { month: "Ene", ganancias: 500 },
    { month: "Feb", ganancias: 800 },
    { month: "Mar", ganancias: 600 },
    { month: "Abr", ganancias: 1000 },
    { month: "May", ganancias: 1200 },
    { month: "Jun", ganancias: 1500 },
    { month: "Jul", ganancias: 1800 },
    { month: "Ago", ganancias: 2000 },
    { month: "Sep", ganancias: 2500 },
    { month: "Oct", ganancias: 2800 },
    { month: "Nov", ganancias: 2900 },
    { month: "Dic", ganancias: 4000 },
];

const pieData = [
    { name: "Acciones", value: 50 },
    { name: "Bonos", value: 30 },
    { name: "Efectivo", value: 20 },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042"]; // Colores para el gráfico de torta

const DashboardPage = () => {
    const router = useRouter();
    const [authToken, setAuthToken] = useState<string>("");
    const [savingsData, setSavingsData] = useState([]);

    const handleGoBack = () => {
        router.push("/"); // Redirige al inicio
    };

    useEffect(() => {
        // Esto solo se ejecutará en el cliente
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    // Función para obtener los ahorros del servicio y procesarlos
    const fetchSavingsData = async () => {
        try {
            const expenses = await getExpensesByCategory(
                "66f8a860b487b4336c5f9fbd",
                authToken
            ); // Trae los gastos de categoría "Ahorros"

            console.log(expenses);

            // Agrupar los ahorros por periodo (month)
            const groupedData = expenses.reduce((acc, curr) => {
                const month = curr.period; // Usa el periodo como el mes
                const amount = curr.amount ?? 0;

                // Sumarizar por mes
                if (acc[month]) {
                    acc[month].savings += amount;
                } else {
                    acc[month] = { month, savings: amount };
                }

                return acc;
            }, {});

            // Convertir el objeto agrupado en un array para el gráfico
            const formattedData = Object.values(groupedData);
            setSavingsData(formattedData);
        } catch (error) {
            console.error("Error al traer los ahorros:", error);
        }
    };

    useEffect(() => {
        fetchSavingsData(); // Llamada al servicio cuando se carga el componente
    }, [authToken]);

    return (
        <Authenticated>
            <div style={{ padding: "20px" }}>
                <Title level={2}>Dashboard</Title>
                <Paragraph>
                    Aquí se mostrarán todos los detalles relacionados con tus
                    inversiones.
                </Paragraph>

                {/* Diseño en cuadrícula con métricas */}
                <Row gutter={16}>
                    <Col span={6}>
                        <Card>
                            <DollarOutlined
                                style={{ fontSize: "32px", color: "#3f8600" }}
                            />
                            <Title level={4}>Total Inversiones</Title>
                            <Paragraph>$25,000</Paragraph>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <LineChartOutlined
                                style={{ fontSize: "32px", color: "#1890ff" }}
                            />
                            <Title level={4}>Rendimiento Mensual</Title>
                            <Paragraph>+12.5%</Paragraph>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <PieChartOutlined
                                style={{ fontSize: "32px", color: "#ffc53d" }}
                            />
                            <Title level={4}>Diversificación</Title>
                            <Paragraph>60% Acciones / 40% Bonos</Paragraph>
                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card>
                            <BarChartOutlined
                                style={{ fontSize: "32px", color: "#fa8c16" }}
                            />
                            <Title level={4}>Ganancias Totales</Title>
                            <Paragraph>$10,500</Paragraph>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} style={{ marginTop: "20px" }}>
                    {/* Gráfico de barras */}
                    <Col span={12}>
                        <Card title="Ahorros por mes">
                            <BarChart
                                width={400}
                                height={300}
                                data={savingsData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="savings" fill="#8884d8" />
                            </BarChart>
                        </Card>
                    </Col>
                    {/* Gráfico de torta */}
                    <Col span={12}>
                        <Card title="Composicion de la cartera de ahorros">
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={pieData}
                                    cx={200}
                                    cy={150}
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
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
                </Row>

                <Row gutter={16} style={{ marginTop: "20px" }}>
                    {/* Gráfico de tendencias (líneas) */}
                    <Col span={24}>
                        <Card title="Ahorros acumulados por mes">
                            <LineChart
                                width={1000}
                                height={300}
                                data={lineData}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="ganancias"
                                    stroke="#82ca9d"
                                />
                            </LineChart>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Authenticated>
    );
};

export default DashboardPage;
