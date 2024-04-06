import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import {
    Button,
    DatePicker,
    Form,
    Input,
    Popconfirm,
    Select,
    Table,
    Tag,
} from "antd";
import {
    AuditOutlined,
    CarOutlined,
    DeleteTwoTone,
    PlusOutlined,
} from "@ant-design/icons";
import { IExpense, Status } from "@/app/period/[period]/models/expense.model";
import { StatusIcons } from "../../status/statusIcons";
import { CategoryIcons } from "../../category/categoryIcons";
import {
    createExpense,
    deleteExpenseById,
    updateExpenseById,
} from "@/app/period/[period]/services/expenses.service";

const { Option } = Select;

import dayjs from "dayjs";

import customParseFormat from "dayjs/plugin/customParseFormat";
import { ICategory } from "@/app/category/models";

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

const dateFormat = "DD/MM/YYYY";

const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
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
    dataIndex: keyof IExpense;
    record: IExpense;
    handleSave: (record: IExpense) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
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

            const response = updateExpenseById(newValue._id, newValue);
            response.then((updatedRecord) => {
                handleSave(updatedRecord);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    if (
        editable &&
        title !== "Estado" &&
        title !== "Categoría" &&
        title !== "Fecha de vencimiento"
    ) {
        childNode = editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
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

    if (editable && title == "Estado") {
        childNode = editing ? (
            <Form.Item
                name="status"
                rules={[
                    {
                        required: true,
                        message: "Por favor seleccione un estado.",
                    },
                ]}
            >
                {/* Deberia dinamizar esto trayendome las opciones desde la api */}
                <Select ref={inputRef} onPressEnter={save} onBlur={save}>
                    <Option value="65d0fb6db33cebd95694e233">Estimado</Option>
                    <Option value="6553fe526562128ac0dd6f6e">Pendiente</Option>
                    <Option value="65d0fb82b33cebd95694e234">
                        Transferido
                    </Option>
                    <Option value="6553fd74df59e3f9af341a03">Pago</Option>
                </Select>
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

    if (editable && title == "Categoría") {
        childNode = editing ? (
            <Form.Item
                name="category"
                rules={[
                    {
                        required: true,
                        message: "Por favor seleccione una categoría.",
                    },
                ]}
            >
                {/* Deberia dinamizar esto trayendome las opciones desde la api */}
                <Select ref={inputRef} onPressEnter={save} onBlur={save}>
                    <Option value="6557d86ba3060170d82b6502">
                        <CarOutlined /> Transporte
                    </Option>
                    <Option value="65d10927b33cebd95694e235">
                        <AuditOutlined /> Impuestos
                    </Option>
                </Select>
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

    if (editable && title == "Fecha de vencimiento") {
        childNode = editing ? (
            <Form.Item name="dueDate">
                <DatePicker ref={inputRef} onPressEnter={save} onBlur={save} />
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

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ExpenseTable = (params: {
    expenses: IExpense[];
    updateExpenses: any;
    period: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);

    const { expenses, updateExpenses } = params;

    const handleDelete = (key: string) => {
        const newData = expenses.filter((item) => item._id !== key);
        updateExpenses(newData);
        deleteExpenseById(key);
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
            render: (status: Status) => (
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
                    icon={<CategoryIcons category={category?.name} />}
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
            dueDate: "2024-02-20T20:19:40.723Z",
            status: "6553fe526562128ac0dd6f6e",
            amount: 1,
            period: params.period, //Paso el periodo o alcanza con copiar a sus hermanos?
            category: "6557d86ba3060170d82b6502",
        };
        const response = createExpense(newData);

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
                handleSave,
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
