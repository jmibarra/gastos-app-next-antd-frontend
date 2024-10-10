import React, { useState } from "react";
import dayjs from "dayjs";
import { Button, Popconfirm, Table } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ISaving } from "@/app/period/[period]/models";
import {
    createSaving,
    deleteSavingById,
    updateSavingById,
} from "@/app/period/[period]/services";
import { EditableCell, EditableRow } from "./EditableCell";

type EditableTableProps = Parameters<typeof Table<ISaving>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const dateFormat = "DD/MM/YYYY";

const SavingsTable = (params: {
    savings: ISaving[];
    updateSavings: any;
    period: string;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { savings, updateSavings, authToken } = params;

    const handleDelete = (key: string) => {
        const newData = savings.filter((item) => item._id !== key);
        updateSavings(newData);
        deleteSavingById(key, authToken);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "Descripción",
            dataIndex: "description",
            width: "30%",
            editable: true,
        },
        {
            title: "Fecha de movimiento",
            dataIndex: "date",
            editable: true,
            render: (value) => dayjs(value).format(dateFormat),
        },
        {
            title: "Monto",
            dataIndex: "amount",
            render: (value) => <>$ {value}</>,
            editable: true,
        },
        {
            title: "Tipo de operación",
            dataIndex: "type",
            render: (value) => <> {value}</>,
            editable: true,
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: ISaving) =>
                savings.length >= 1 ? (
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
        const newData: ISaving = {
            _id: "1",
            description: `Ahorro`,
            date: dayjs().startOf("day").toDate().toISOString(),
            amount: 1,
            type: "Ingreso",
            period: params.period,
        };

        const response = createSaving(newData, authToken);

        response.then((data) => {
            updateSavings([...savings, data]);
            setCreateButtonLoading(false);
        });
    };

    const handleSave = (row: ISaving) => {
        const newData = [...savings];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        updateSavings(newData);
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
            onCell: (record: ISaving) => ({
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
                Agregar un movimiento de ahorros
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={savings}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default SavingsTable;
