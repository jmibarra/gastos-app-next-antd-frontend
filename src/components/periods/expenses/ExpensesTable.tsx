import React, { use, useContext, useEffect, useRef, useState } from "react";
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
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { IExpense } from "@/app/period/[period]/models/expense.model";
import { StatusIcons } from "../../status/statusIcons";
import { CategoryIcons } from "../../category/categoryIcons";
import {
    createExpense,
    deleteExpenseById,
    updateExpenseById,
} from "@/app/period/[period]/services/expenses.service";

const { Option } = Select;

import dayjs from "dayjs";

import { ICategory } from "@/app/settings/category/models";
import { getCategories } from "@/app/settings/category/services";
import { Status } from "@/app/settings/status/models";
import { getStatus } from "@/app/settings/status/services/status.service";

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;
type DateRef = GetRef<typeof DatePicker>;
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
    authToken: string;
}

const EditableCell: React.FC<EditableCellProps> = ({
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
    const selectRef = useRef<SelectRef>(null);
    const dateRef = useRef<DateRef>(null);
    const form = useContext(EditableContext)!;
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [statuses, setStatuses] = useState<Status[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories(authToken);
            setCategories(fetchedCategories);
        };
        if (authToken) {
            fetchCategories();
        }
    }, [authToken]);

    useEffect(() => {
        if (editing) {
            if (title === "Estado" || title === "Categoría") {
                selectRef.current?.focus();
            } else if (title === "Fecha de vencimiento") {
                dateRef.current?.focus();
            } else {
                inputRef.current?.focus();
            }
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

            if (values.dueDate) {
                values.date = dayjs(values.dueDate).startOf("day").toDate();
            }

            const newValue = { ...record, ...values };

            const response = updateExpenseById(
                newValue._id,
                newValue,
                authToken
            );
            response.then((updatedRecord) => {
                handleSave(updatedRecord);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        if (title == "Estado") {
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
                    <Select ref={selectRef} onBlur={save} onChange={save}>
                        <Select.Option
                            key={"65d0fb6db33cebd95694e233"}
                            value="65d0fb6db33cebd95694e233"
                        >
                            Estimado
                        </Select.Option>
                        <Select.Option
                            key={"6553fe526562128ac0dd6f6e"}
                            value="6553fe526562128ac0dd6f6e"
                        >
                            Pendiente
                        </Select.Option>
                        <Select.Option
                            key={"65d0fb82b33cebd95694e234"}
                            value="65d0fb82b33cebd95694e234"
                        >
                            Transferido
                        </Select.Option>
                        <Select.Option
                            key={"6553fd74df59e3f9af341a03"}
                            value="6553fd74df59e3f9af341a03"
                        >
                            Pago
                        </Select.Option>
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
        } else if (title == "Categoría") {
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
                    <Select ref={selectRef} onBlur={save}>
                        {categories.map((category) => (
                            <Option value={category._id}>
                                {" "}
                                <CategoryIcons category={category.icon} />
                                {category.name}
                            </Option>
                        ))}
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
        } else if (title == "Fecha de vencimiento") {
            childNode = editing ? (
                <Form.Item name="dueDate">
                    <Input
                        ref={inputRef}
                        type="date"
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
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table<IExpense>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ExpenseTable = (params: {
    expenses: IExpense[];
    updateExpenses: any;
    period: string;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);

    const { expenses, updateExpenses, authToken } = params;

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
