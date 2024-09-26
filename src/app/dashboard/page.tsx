// src/app/investments/page.tsx
"use client";
import React from "react";
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

const { Title, Paragraph } = Typography;

// Datos ficticios para los gráficos
const barData = [
    { month: "Ene", rendimiento: 12 },
    { month: "Feb", rendimiento: 15 },
    { month: "Mar", rendimiento: 8 },
    { month: "Abr", rendimiento: 18 },
    { month: "May", rendimiento: 25 },
];

const lineData = [
    { month: "Ene", ganancias: 500 },
    { month: "Feb", ganancias: 800 },
    { month: "Mar", ganancias: 600 },
    { month: "Abr", ganancias: 1000 },
    { month: "May", ganancias: 1200 },
];

const pieData = [
    { name: "Acciones", value: 60 },
    { name: "Bonos", value: 40 },
];

const COLORS = ["#0088FE", "#FFBB28"]; // Colores para el gráfico de torta

const DashboardPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/"); // Redirige al inicio
    };

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
                        <Card title="Rendimiento por Mes">
                            <BarChart width={400} height={300} data={barData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="rendimiento" fill="#8884d8" />
                            </BarChart>
                        </Card>
                    </Col>

                    {/* Gráfico de tendencias (líneas) */}
                    <Col span={12}>
                        <Card title="Tendencia de Ganancias">
                            <LineChart width={400} height={300} data={lineData}>
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

                <Row gutter={16} style={{ marginTop: "20px" }}>
                    {/* Gráfico de torta */}
                    <Col span={12}>
                        <Card title="Diversificación de Inversiones">
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

                {/* Botón para volver al inicio */}
                <Button
                    type="primary"
                    onClick={handleGoBack}
                    style={{ marginTop: "20px" }}
                >
                    Volver al inicio
                </Button>
            </div>
        </Authenticated>
    );
};

export default DashboardPage;
