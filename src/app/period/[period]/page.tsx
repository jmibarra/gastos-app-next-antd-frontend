"use client";
import { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import Authenticated from "../../authenticated/page";
import { Card, Col, Divider, Row, Statistic } from "antd";
import ExpenseTable from "@/components/periodos/gastos/ExpensesTable";
import IncomeTable from "@/components/periodos/Ingresos/IncomeTable";
import { IExpense } from "./models/expense.model";
import { ExpenseStatisticCard } from "@/components/periodos/gastos/ExpenseStatisticCard";
import { IncomeStatisticCard } from "@/components/periodos/Ingresos/IncomeStatisticCard";
import { IIncome } from "./models/income.model";
import { getExpensesByPeriod, getIncomesByPeriod } from "./services";
import { MonthResultStatisticCard } from "@/components/periodos/MonthResultStatisticCard";

export default function Period({ params }: { params: { period: string } }) {
    const [period, setPeriod] = useState(params.period);
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [incomes, setIncomes] = useState<IIncome[]>([]);

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getExpensesByPeriod(period);
            setExpenses(fetchedExpenses);
        };
        fetchExpenses();
    }, [period]);

    useEffect(() => {
        const fetchIncomes = async () => {
            const fetchedIncomes = await getIncomesByPeriod(period);
            setIncomes(fetchedIncomes);
        };

        fetchIncomes();
    }, [period]);

    return (
        <Authenticated>
            <h1>Gastos {period}</h1>
            <Divider orientation="left">Datos del mes</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={6}>
                    <IncomeStatisticCard data={incomes} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <ExpenseStatisticCard data={expenses} />
                </Col>
                <Col className="gutter-row" span={6}>
                    <MonthResultStatisticCard
                        incomes={incomes}
                        expenses={expenses}
                    />
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
                    <IncomeTable data={incomes} period={period} />
                </Col>
            </Row>
            <Divider orientation="left">Gastos</Divider>
            <Row>
                <Col span={24}>
                    <ExpenseTable
                        expenses={expenses}
                        updateExpenses={setExpenses}
                        period={period}
                    />
                </Col>
            </Row>
        </Authenticated>
    );
}
