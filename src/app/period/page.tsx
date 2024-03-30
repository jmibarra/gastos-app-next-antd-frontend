"use client";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import Authenticated from "../authenticated/page";
import { Card, Col, Divider, Row, Statistic } from "antd";
import IncomeTable from "@/components/Ingresos/incomeTable";
import ExpenseTable from "@/components/gastos/ExpensesTable";
export default function Period() {
    return (
        <Authenticated>
            <h1>Period</h1>
            <Divider orientation="left">Datos del mes</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Ingresos"
                            value={11.28}
                            precision={2}
                            valueStyle={{ color: "#3f8600" }}
                            prefix={<ArrowUpOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Gastos"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Saldo"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col className="gutter-row" span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title="Ahorros del mes"
                            value={9.3}
                            precision={2}
                            valueStyle={{ color: "#cf1322" }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
            </Row>
            <Divider orientation="left">Ingresos</Divider>
            <Row>
                <Col span={24}>
                    <IncomeTable />
                </Col>
            </Row>
            <Divider orientation="left">Gastos</Divider>
            <Row>
                <Col span={24}>
                    <ExpenseTable />
                </Col>
            </Row>
        </Authenticated>
    );
}
