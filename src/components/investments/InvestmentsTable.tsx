import React, { useState } from "react";

import { v4 as uuidv4 } from "uuid";

import type { GetRef } from "antd";
import { Button, Form, Popconfirm, Table } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";

import { IInvestment } from "../../app/investments/models";
import { InvestmentUtils } from "../../app/investments/utils/investmentsUtils";
import { InvestmentType } from "../../app/investments/enums/investmentTypes";
import {
    createInvestment,
    deleteInvestmentById,
} from "../../app/investments/services";
import { EditableCell, EditableRow } from "./EditableCell";

type EditableTableProps = Parameters<typeof Table<IInvestment>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const InvestmentsTable = (params: {
    investments: IInvestment[];
    updateInvestments: any;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { investments, updateInvestments, authToken } = params;

    const handleDelete = (key: string) => {
        const newData = investments.filter((item) => item._id !== key);
        updateInvestments(newData);
        deleteInvestmentById(key, authToken);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "Ticker",
            dataIndex: "ticker",
            editable: true,
        },
        {
            title: "Nombre",
            dataIndex: "name",
            width: "25%",
            editable: true,
        },
        {
            title: "Cantindad",
            dataIndex: "quantity",
            editable: true,
        },
        {
            title: "Precio promedio de compra",
            dataIndex: "averagePurchasePrice",
            width: "15%",
            editable: true,
            render: (value) => (
                <>$ {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</>
            ),
        },
        {
            title: "Total invertido",
            dataIndex: "",
            editable: false,
            render: (_, record: IInvestment) => (
                <>
                    ${" "}
                    {InvestmentUtils.calculateInvestmentTotalInvestment(record)
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </>
            ),
        },
        {
            title: "Precio actual",
            dataIndex: "currentPrice",
            editable: true,
            render: (value) => (
                <>$ {value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}</>
            ),
        },
        {
            title: "Capitalización actual",
            dataIndex: "",
            editable: true,
            render: (_, record: IInvestment) => (
                <>
                    ${" "}
                    {InvestmentUtils.calculateInvestmentCurrentValue(record)
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}
                </>
            ),
        },
        {
            title: "Ganancia",
            dataIndex: "",
            render: (_, record: IInvestment) => (
                <span
                    style={{
                        color:
                            InvestmentUtils.calculateInvestmentEarningPorcentage(
                                record
                            ) < 0
                                ? "red"
                                : "green",
                    }}
                >
                    {InvestmentUtils.calculateInvestmentEarningPorcentage(
                        record
                    ).toFixed(2)}{" "}
                    %
                </span>
            ),
            editable: false,
        },
        {
            title: "Tipo de instrumento",
            dataIndex: "type",
            render: (value) => <> {value}</>,
            editable: true,
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: IInvestment) =>
                investments.length >= 1 ? (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <DeleteTwoTone twoToneColor="red" />
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = async () => {
        setCreateButtonLoading(true);
        const newData: IInvestment = {
            _id: uuidv4(),
            ticker: "-",
            name: `Nueva inversión`,
            averagePurchasePrice: 0,
            currentPrice: 0,
            quantity: 1,
            type: InvestmentType.CEDEAR,
        };

        updateInvestments([...investments, newData]);

        try {
            const createdInvestment = await createInvestment(
                newData,
                authToken
            );
            updateInvestments([...investments, createdInvestment]);
        } catch (error) {
            console.error("Error creating investment:", error);
        } finally {
            setCreateButtonLoading(false);
        }
    };

    const handleSave = (row: IInvestment) => {
        const newData = [...investments];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        updateInvestments(newData);
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    const columns = defaultColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: IInvestment) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
                authToken,
            }),
        };
    });

    return (
        <div>
            <Button
                onClick={handleAdd}
                type="primary"
                style={{ marginBottom: 16 }}
                loading={createButtonLoading}
                icon={<PlusOutlined />}
            >
                Agregar una nueva inversión
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={investments}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default InvestmentsTable;
