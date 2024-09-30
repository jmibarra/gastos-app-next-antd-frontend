"use client";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import Authenticated from "../../authenticated/page";
import { Button, Col, DatePicker, Divider, Row } from "antd";
import ExpenseTable from "@/components/periods/expenses/ExpensesTable";
import IncomeTable from "@/components/periods/incomes/IncomeTable";
import SavingsTable from "@/components/periods/savings/savingsTable";
import { IExpense } from "./models/expense.model";
import { IIncome } from "./models/income.model";
import { ISaving } from "./models";
import {
    getExpensesByPeriod,
    getIncomesByPeriod,
    getSavingsByPeriod,
} from "./services";
import MonthMetricsBoards from "@/components/periods/metrics/monthMetricsBoards";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

export default function Period({ params }: { params: { period: string } }) {
    const [period, setPeriod] = useState(params.period);
    const [expenses, setExpenses] = useState<IExpense[]>([]);
    const [incomes, setIncomes] = useState<IIncome[]>([]);
    const [savings, setSavings] = useState<ISaving[]>([]);
    const [authToken, setAuthToken] = useState<string>("");

    useEffect(() => {
        // Esto solo se ejecutará en el cliente
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    useEffect(() => {
        const fetchExpenses = async () => {
            const fetchedExpenses = await getExpensesByPeriod(
                period,
                authToken
            );
            setExpenses(fetchedExpenses);
        };
        fetchExpenses();
    }, [period, authToken]);

    useEffect(() => {
        const fetchIncomes = async () => {
            const fetchedIncomes = await getIncomesByPeriod(period, authToken);
            setIncomes(fetchedIncomes);
        };

        fetchIncomes();
    }, [period, authToken]);

    useEffect(() => {
        const fetchSavings = async () => {
            const fetchedSavings = await getSavingsByPeriod(period, authToken);
            setSavings(fetchedSavings);
        };

        fetchSavings();
    }, [period, authToken]);

    const handlePeriodChange = (date: any, dateString: string | string[]) => {
        setPeriod(typeof dateString === "string" ? dateString : dateString[0]);
    };

    const handlePreviousPeriod = () => {
        const newPeriod = dayjs(period, "MMYYYY")
            .subtract(1, "month")
            .format("MMYYYY");
        setPeriod(newPeriod);
    };

    const handleNextPeriod = () => {
        const newPeriod = dayjs(period, "MMYYYY")
            .add(1, "month")
            .format("MMYYYY");
        setPeriod(newPeriod);
    };

    return (
        <Authenticated>
            <h1>Periodo {period} </h1>
            <Divider orientation="left">Periodo</Divider>
            <Row align="middle" justify="center">
                <Button
                    icon={<LeftOutlined />}
                    onClick={handlePreviousPeriod}
                />
                <DatePicker
                    onChange={handlePeriodChange}
                    picker="month"
                    format={"MMYYYY"}
                    value={dayjs(period, "MMYYYY")}
                    style={{ margin: "0 10px" }}
                />
                <Button icon={<RightOutlined />} onClick={handleNextPeriod} />
            </Row>
            <Divider orientation="left">Datos del mes</Divider>
            <MonthMetricsBoards
                incomes={incomes}
                expenses={expenses}
                savings={savings}
            />
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
                        authToken={authToken}
                    />
                </Col>
            </Row>
            <Divider orientation="left">Ahorros del mes</Divider>
            <Row>
                <Col span={24}>
                    <SavingsTable
                        savings={savings}
                        updateSavings={setSavings}
                        period={period}
                        authToken={authToken}
                    />
                </Col>
            </Row>
        </Authenticated>
    );
}
