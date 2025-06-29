// src/app/investments/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Typography, Card, Row, Col } from "antd";
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
    ResponsiveContainer,
} from "recharts";
import {
    DollarOutlined,
    LineChartOutlined,
    PieChartOutlined,
    BarChartOutlined,
} from "@ant-design/icons";
import { getAllSavings } from "../period/[period]/services";
import { ISaving } from "../period/[period]/models";

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

const DashboardPage = () => {
    const router = useRouter();
    const [authToken, setAuthToken] = useState<string>("");
    const [savingsData, setSavingsData] = useState<ISaving[]>([]);

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
            const savings = await getAllSavings(authToken);

            console.log(savings);

            // Obtener el año actual
            const currentYear = new Date().getFullYear();

            // Crear un mapa inicial con los periodos del año actual (Ene-Dic)
            const monthNames = [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ];
            const initialData: { [key: string]: { month: string; savings: number } } = monthNames.reduce((acc: { [key: string]: { month: string; savings: number } }, month, index) => {
                const periodKey: string = `${month}`;
                acc[periodKey] = { month: periodKey, savings: 0 }; // Iniciar cada mes con 0 ahorros
                return acc;
            }, {});

            // Agrupar los ahorros por periodo (month) y sumar/restar según el tipo
            const groupedData = savings.reduce((acc, curr) => {
                const periodStr = curr.period; // Formato: "MMYYYY" (Ej: "012024", "122024")
                const month = parseInt(periodStr.slice(0, 2), 10); // Mes como número
                const year = parseInt(periodStr.slice(2), 10); // Año

                const amount = curr.amount ?? 0;
                const type = curr.type; // Se asume que el campo "type" es "Ingreso" o "Egreso"

                // Verificar si el ahorro es del año actual
                if (year === currentYear && month >= 1 && month <= 12) {
                    const periodKey = `${monthNames[month - 1]}`; // Formato "Ene 2024", "Feb 2024", etc.

                    // Sumar o restar según el tipo
                    if (type === "Ingreso") {
                        acc[periodKey].savings += amount;
                    } else if (type === "Egreso") {
                        acc[periodKey].savings -= amount;
                    }
                }

                return acc;
            }, initialData);

            // Convertir el objeto agrupado en un array ordenado para el gráfico
            const formattedData = Object.values(groupedData);

            setSavingsData(formattedData as any);
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
                    <Col span={24}>
                        <Card title="Ahorros por mes">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={savingsData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="savings" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
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
