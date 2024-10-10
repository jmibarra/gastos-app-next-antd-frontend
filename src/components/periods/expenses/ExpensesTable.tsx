import React, { useState } from "react";
import dayjs from "dayjs";
import { Button, Popconfirm, Table, Tag } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";

import { IExpense } from "@/app/period/[period]/models/expense.model";
import { ICategory } from "@/app/settings/category/models";
import { IStatus } from "@/app/settings/status/models";

import { StatusIcons } from "../../status/statusIcons";
import { CategoryIcons } from "../../category/categoryIcons";
import {
    createExpense,
    deleteExpenseById,
} from "@/app/period/[period]/services/expenses.service";
import { EditableCell, EditableRow } from "./EditableCell";

const dateFormat = "DD/MM/YYYY";

type EditableTableProps = Parameters<typeof Table<IExpense>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ExpenseTable = (params: {
    expenses: IExpense[];
    updateExpenses: any;
    period: string;
    authToken: string;
    statuses: IStatus[];
    categories: ICategory[];
}) => {
    const { expenses, updateExpenses, authToken, statuses, categories } =
        params;
    const [createButtonLoading, setCreateButtonLoading] = useState(false);

    const handleDelete = (key: string) => {
        const newData = expenses.filter((item) => item._id !== key);
        updateExpenses(newData);
        deleteExpenseById(key, authToken);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "Título",
            dataIndex: "title",
            width: "30%",
            editable: true,
        },
        {
            title: "Fecha de vencimiento",
            dataIndex: "dueDate",
            editable: true,
            render: (value) => dayjs(value).format(dateFormat),
        },
        {
            title: "Estado",
            dataIndex: "status",
            render: (status: IStatus) => (
                <Tag
                    icon={<StatusIcons status={status?.name} />}
                    color={status?.color}
                >
                    {status?.name}
                </Tag>
            ),
            editable: true,
        },
        {
            title: "Monto",
            dataIndex: "amount",
            render: (value) => <>$ {value}</>,
            editable: true,
        },
        {
            title: "Categoría",
            dataIndex: "category",
            render: (category: ICategory) => (
                <Tag
                    icon={<CategoryIcons category={category?.icon} />}
                    color={category?.color}
                >
                    {category?.name}
                </Tag>
            ),
            editable: true,
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: IExpense) =>
                expenses.length >= 1 ? (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <DeleteTwoTone twoToneColor="red" />
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        setCreateButtonLoading(true);
        const newData: IExpense = {
            _id: "1",
            title: `Nuevo Gasto`,
            dueDate: dayjs().startOf("day").toDate().toISOString(),
            status: "6553fe526562128ac0dd6f6e",
            amount: 1,
            period: params.period, //Paso el periodo o alcanza con copiar a sus hermanos?
            category: "6557d86ba3060170d82b6502",
        };
        const response = createExpense(newData, authToken);

        response.then((data) => {
            updateExpenses([...expenses, data]);
            setCreateButtonLoading(false);
        });
    };

    const handleSave = (row: IExpense) => {
        const newData = [...expenses];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        updateExpenses(newData);
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
            onCell: (record: IExpense) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                statuses,
                categories,
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
                Crear un gasto
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={expenses}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default ExpenseTable;
