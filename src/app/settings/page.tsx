// src/app/investments/page.tsx
"use client";
import React from "react";
import { Typography, Button, Card, Row, Col, Avatar } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "../authenticated/page";
import { NodeExpandOutlined, OrderedListOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";

const { Title, Paragraph } = Typography;

const Settings = () => {
    const router = useRouter();

    const handleGoToPage = (path: string) => {
        router.push(path);
    };

    return (
        <Authenticated>
            <div style={{ padding: "20px" }}>
                <Title level={2}>Elementos de Configuración</Title>
                <Paragraph>
                    Aquí puedes gestionar las categorías y los estados de los
                    elementos.
                </Paragraph>

                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => handleGoToPage("/settings/category")}
                            style={{ cursor: "pointer" }}
                        >
                            <Meta
                                avatar={
                                    <Avatar icon={<OrderedListOutlined />} />
                                }
                                title="Categorías"
                                description="Gestiona las categorías."
                            />
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card
                            hoverable
                            onClick={() => handleGoToPage("/settings/status")}
                            style={{ cursor: "pointer" }}
                        >
                            <Meta
                                avatar={
                                    <Avatar icon={<NodeExpandOutlined />} />
                                }
                                title="Estados"
                                description="Gestiona los estados."
                            />
                        </Card>
                    </Col>
                </Row>

                <Button
                    type="primary"
                    style={{ marginTop: "20px" }}
                    onClick={() => handleGoToPage("/")}
                >
                    Volver al inicio
                </Button>
            </div>
        </Authenticated>
    );
};

export default Settings;
