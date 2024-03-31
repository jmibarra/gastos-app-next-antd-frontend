"use client";
import { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import Authenticated from "../../authenticated/page";
import { Card, Col, Divider, Row, Statistic } from "antd";
import ExpenseTable from "@/components/gastos/ExpensesTable";
import IncomeTable from "@/components/Ingresos/IncomeTable";
import { IExpense } from "./models/expense.model";
import { getExpensesByPeriod } from "./services/expenses.service";
import { ExpenseStatisticCard } from "@/components/gastos/ExpenseStatisticCard";
import { IncomeStatisticCard } from "@/components/Ingresos/IncomeStatisticCard";

export default function Period({ params }: { params: { period: string } }) {
    const [expenses, setExpenses] = useState<IExpense[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getExpensesByPeriod(params.period);
            setExpenses(fetchedExpenses);
        };

        fetchExpenses();
    }, [params.period]);

    return (
        <Authenticated>
            <h1>Gastos {params.period}</h1>
            <Divider orientation="left">Datos del mes</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <IncomeStatisticCard data={expenses} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <ExpenseStatisticCard data={expenses} />
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
