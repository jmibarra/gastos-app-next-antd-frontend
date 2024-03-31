import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import { Button, Form, Input, Popconfirm, Table, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import {
    Category,
    IExpense,
    Status,
} from "@/app/period/[period]/models/expense.model";
import { StatusIcons } from "../statusIcons";
import { CategoryIcons } from "./categoryIcons";

type InputRef = GetRef<typeof Input>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

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
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
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

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const ExpenseTable = (params: { data: IExpense[] }) => {
    const [dataSource, setDataSource] = useState<IExpense[]>([]);

    useEffect(() => {
        setDataSource(params.data);
    }, [params.data]);

    const [count, setCount] = useState(2);

    const handleDelete = (key: React.Key) => {
        const newData = dataSource.filter((item) => item._id !== key);
        setDataSource(newData);
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
            render: (category: Category) => (
                <Tag
                    icon={<CategoryIcons category={category?.name} />}
                    color={category?.color}
                >
                    {category?.name}
                </Tag>
            ),
        },
        {
            title: "operation",
            dataIndex: "operation",
            render: (_, record: { key: React.Key }) =>
                dataSource.length >= 1 ? (
                    <Popconfirm
                        title="Sure to delete?"
                        onConfirm={() => handleDelete(record.key)}
                    >
                        <DeleteOutlined />
                    </Popconfirm>
                ) : null,
        },
    ];

    const handleAdd = () => {
        const newData: IExpense = {
            key: count,
            name: `Edward King ${count}`,
            age: "32",
            address: `London, Park Lane no. ${count}`,
        };
        setDataSource([...dataSource, newData]);
        setCount(count + 1);
    };

    const handleSave = (row: IExpense) => {
        const newData = [...dataSource];
        const index = newData.findIndex((item) => row.key === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        setDataSource(newData);
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
            >
                Add a row
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={dataSource}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default ExpenseTable;
