// src/app/investments/page.tsx
"use client";
import React from "react";
import { Typography, Row, Divider } from "antd";
const { Title, Paragraph } = Typography;
import { useRouter } from "next/navigation";
import Authenticated from "../authenticated/page";
import InvestmentsMetrics from "@/components/investments/investmentsMetrics";

const InvestmentsPage = () => {
    const router = useRouter();

    const handleGoBack = () => {
        router.push("/"); // Cambia esto a la ruta que desees
    };

    return (
        <Authenticated>
            <div style={{ padding: "20px" }}>
                <Title level={2}>Mis inversiones</Title>
                <Paragraph>
                    Realiza un seguimiento de tus inversiones.
                </Paragraph>
                <InvestmentsMetrics />
                <Divider orientation="left">Inversiones</Divider>
                <Row gutter={16} style={{ marginTop: "20px" }}>
                    Tabla de inversiones
                </Row>
            </div>
        </Authenticated>
    );
};

export default InvestmentsPage;
