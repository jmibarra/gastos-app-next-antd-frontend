// src/components/status/StatusTable.tsx
import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import { Button, Form, Input, Popconfirm, Table, Select } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { IStatus } from "@/app/settings/status/models";
import {
    createStatus,
    deleteStatusById , 
    updateStatusById, 
    getStatus
} from "@/app/settings/status/services/status.service";
import { StatusIcons } from "./statusIcons";

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

export const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof IStatus;
    record: IStatus;
    handleSave: (record: IStatus) => void;
    authToken: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    authToken,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            const newValue = { ...record, ...values };
            handleSave(newValue);
            await updateStatusById(record._id, newValue, authToken);
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        if (dataIndex === "color") {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} es requerido.`,
                        },
                    ]}
                >
                    <Input
                        ref={inputRef}
                        type="color"
                        onPressEnter={save}
                        onBlur={save}
                    />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        } else {
            childNode = editing ? (
                <Form.Item
                    style={{ margin: 0 }}
                    name={dataIndex}
                    rules={[
                        {
                            required: true,
                            message: `${title} es requerido.`,
                        },
                    ]}
                >
                    <Input ref={inputRef} onPressEnter={save} onBlur={save} />
                </Form.Item>
            ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
        }
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table<IStatus>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const StatusTable = (params: {
    statuses: IStatus[];
    updateStatuses: React.Dispatch<React.SetStateAction<IStatus[]>>;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { statuses, updateStatuses, authToken } = params;

    const handleDelete = async (key: string) => {
        const newData = statuses.filter((item) => item._id !== key);
        updateStatuses(newData);
        await deleteStatusById(key, authToken);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "Nombre",
            dataIndex: "name",
            width: "30%",
            editable: true,
            render: (value) => (
                <>
                    <StatusIcons status={value} /> {value}
                </>
            ),
        },
        {
            title: "Color",
            dataIndex: "color",
            editable: true,
            render: (value) => (
                <span>
                    <div
                        style={{
                            width: "20px",
                            height: "20px",
                            backgroundColor: value,
                            borderRadius: "50%",
                            display: "inline-block",
                            verticalAlign: "middle",
                            marginRight: "8px"
                        }}
                    />
                    {value}
                </span>
            ),
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: IStatus) =>
                statuses.length >= 1 ? (
                    <Popconfirm
                        title="¿Estás seguro de que quieres eliminar este estado?"
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <DeleteTwoTone twoToneColor="red" />
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = async () => {
        setCreateButtonLoading(true);
        const newData: IStatus = {
            _id: Date.now().toString(),
            name: `Nuevo Estado`,
            color: "#1890ff", // Un color por defecto
            owner: "" // El backend debería asignar el owner
        };

        try {
            const createdStatus = await createStatus(newData, authToken);
            updateStatuses([...statuses, createdStatus]);
        } catch (error) {
            console.error("Error al crear el estado:", error);
        } finally {
            setCreateButtonLoading(false);
        }
    };

    const handleSave = (row: IStatus) => {
        const newData = [...statuses];
        const index = newData.findIndex((item) => row._id === item._id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {
                ...item,
                ...row,
            });
            updateStatuses(newData);
        }
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
            onCell: (record: IStatus) => ({
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
                Crear un estado
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={statuses}
                columns={columns as ColumnTypes}
                rowKey="_id"
            />
        </div>
    );
};

export default StatusTable;