// src/app/investments/page.tsx
"use client";
import React from "react";
import { Typography, Button, Row, Col, Card } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "../authenticated/page";
import {
    BarChartOutlined,
    DollarOutlined,
    LineChartOutlined,
    PieChartOutlined,
} from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const InvestmentsPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/"); // Cambia esto a la ruta que desees
    };

    return (
        <Authenticated>
            <div style={{ padding: "20px" }}>
                <Title level={2}>Página de Inversiones</Title>
                <Paragraph>
                    Esta es una página de ejemplo para la ruta de inversiones.
                    Aquí se mostrarán todos los detalles relacionados con tus
                    inversiones.
                </Paragraph>
                <Row gutter={16} style={{ marginTop: "20px" }}>
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
                <Row gutter={16} style={{ marginTop: "20px" }}>
                    <Button type="primary" onClick={handleGoBack}>
                        Volver al inicio
                    </Button>
                </Row>
            </div>
        </Authenticated>
    );
};

export default InvestmentsPage;
