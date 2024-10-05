// src/app/investments/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Typography, Row, Divider, Col } from "antd";
const { Title, Paragraph } = Typography;
import Authenticated from "../authenticated/page";
import {
    InvestmentsMetrics,
    InvestmentsTable,
} from "../../components/investments";
import { IInvestment } from "./models";
import { getInvestments } from "./services/investments.service";

/**
 * Componente que renderiza la pagina de mis inversiones.
 *
 * El componente recibe como props el token de autenticacion y el array de inversiones.
 * El componente utiliza el hook de estado para mantener el valor de las inversiones y el
 * token de autenticacion.
 * El componente utiliza el hook de efecto para obtener las inversiones y el token de
 * autenticacion cuando el componente se monta.
 * El componente renderiza un encabezado con el titulo "Mis inversiones" y un
 * componente de metricas de inversiones.
 * El componente renderiza un componente de tabla de inversiones que recibe como props
 * el array de inversiones y el token de autenticacion.
 * El componente renderiza un componente de botones para agregar una inversion y
 * copiar una inversion.
 */
const InvestmentsPage = () => {
    const [investments, setInvestments] = useState<IInvestment[]>([]);
    const [authToken, setAuthToken] = useState<string>("");

    useEffect(() => {
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    useEffect(() => {
        if (!authToken) return;
        const fetchInvestments = async () => {
            const fetchedInvestments = await getInvestments(authToken);
            setInvestments(fetchedInvestments);
        };
        fetchInvestments();
    }, [authToken]);

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
                    <Col span={24}>
                        <InvestmentsTable
                            investments={investments}
                            updateInvestments={setInvestments}
                            authToken={authToken}
                        />
                    </Col>
                </Row>
            </div>
        </Authenticated>
    );
};

export default InvestmentsPage;
