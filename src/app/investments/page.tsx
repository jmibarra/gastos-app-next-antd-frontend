// src/app/investments/page.tsx
"use client";
import React, { useState } from "react";
import { Typography, Row, Divider, Col } from "antd";
const { Title, Paragraph } = Typography;
import Authenticated from "../authenticated/page";
import {
    InvestmentsMetrics,
    InvestmentsTable,
} from "../../components/investments";
import { IInvestment } from "./models";

const InvestmentsPage = () => {
    const [investments, setInvestments] = useState<IInvestment[]>([]);
    const [authToken, setAuthToken] = useState<string>("");

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
