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
} from "recharts";

const { Title, Paragraph } = Typography;

const pieData = [
    { name: "CEDEARS", value: 64.4 },
    { name: "Renta Fija", value: 12.3 },
    { name: "Liquidez U$D", value: 23.2 },
];

const barData = [
    {
        registro: "Mes actual",
        CEDEARS: 10000,
        "Obligaciones Negociables": 11000,
        Bonos: 13000,
        Efectivo: 5000,
    },
];

const COLORS = ["#0088FE", "#FFBB28", "#FF8042", "#3f8600"];

const InvestmentsMetrics = () => {
    return (
        <>
            <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={6}>
                    <Card>
                        <DollarOutlined
                            style={{ fontSize: "32px", color: "#3f8600" }}
                        />
                        <Title level={4}>Monto invertido</Title>
                        <Paragraph>$25,000</Paragraph>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <RiseOutlined
                            style={{ fontSize: "32px", color: "#3f8600" }}
                        />
                        <Title level={4}>Valor actual</Title>
                        <Paragraph>$25,000</Paragraph>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <LineChartOutlined
                            style={{ fontSize: "32px", color: "#1890ff" }}
                        />
                        <Title level={4}>Rendimiento</Title>
                        <Paragraph>+12.5%</Paragraph>
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
                <Col span={12}>
                    <Card title="Composicion de la cartera">
                        <PieChart width={400} height={300}>
                            <Pie
                                data={pieData}
                                innerRadius={60}
                                outerRadius={100}
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
