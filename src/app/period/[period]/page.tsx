"use client";
import { useEffect, useState } from "react";
import Authenticated from "../../authenticated/page";
import { Col, DatePicker, Divider, Row } from "antd";
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
    const [authToken, setAuthToken] = useState<string>("");

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getExpensesByPeriod(period);
            setExpenses(fetchedExpenses);
        };
        fetchExpenses();
    }, [period]);

    useEffect(() => {
        const fetchIncomes = async () => {
            const fetchedIncomes = await getIncomesByPeriod(period, authToken);
            setIncomes(fetchedIncomes);
        };

        fetchIncomes();
    }, [period, authToken]);

    useEffect(() => {
        // Esto solo se ejecutará en el cliente
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    const handlePeriodChange = (date: any, dateString: string | string[]) => {
        setPeriod(typeof dateString === "string" ? dateString : dateString[0]);
    };

    return (
        <Authenticated>
            <h1>Gastos {period} </h1>
            <Divider orientation="left">Periodo</Divider>
            <DatePicker
                onChange={handlePeriodChange}
                picker="month"
                format={"MMYYYY"}
            />
            <Divider orientation="left">Datos del mes</Divider>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={8}>
                    <IncomeStatisticCard data={incomes} />
                </Col>
                <Col className="gutter-row" span={8}>
                    <ExpenseStatisticCard data={expenses} />
                </Col>
                <Col className="gutter-row" span={8}>
                    <MonthResultStatisticCard
                        incomes={incomes}
                        expenses={expenses}
                    />
                </Col>
            </Row>
            <Divider orientation="left">Ingresos</Divider>
            <Row>
                <Col span={24}>
                    <IncomeTable
                        incomes={incomes}
                        updateIncomes={setIncomes}
                        period={period}
                        authToken={authToken}
                    />
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
