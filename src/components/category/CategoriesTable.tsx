import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ICategory } from "@/app/category/models";
import {
    createCategory,
    deleteCategoryById,
    updateCategoryById,
} from "@/app/category/services";
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
    dataIndex: keyof ICategory;
    record: ICategory;
    handleSave: (record: ICategory) => void;
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
            handleSave(newValue);

            updateCategoryById(record._id, newValue);
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        if (title == "Color") {
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
                    <Input
                        ref={inputRef}
                        onPressEnter={save}
                        onBlur={save}
                        type="color"
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

type EditableTableProps = Parameters<typeof Table>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const CategoriesTable = (params: {
    categories: ICategory[];
    updateCategories: any;
    period: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { categories, updateCategories } = params;

    const handleDelete = (key: string) => {
        const newData = categories.filter((item) => item._id !== key);
        updateCategories(newData);
        deleteCategoryById(key);
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
                        }}
                    />
                </span>
            ),
        },
        {
            title: "Icon",
            dataIndex: "icon",
            editable: true,
            render: (value) => <CategoryIcons category={value} />,
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: ICategory) =>
                categories.length >= 1 ? (
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
        const newData: ICategory = {
            _id: "1",
            name: `Nueva categoria`,
            color: "red",
            icon: "DirectionBus",
        };

        const response = createCategory(newData);

        response.then((data) => {
            updateCategories([...categories, data]);
            setCreateButtonLoading(false);
        });
    };

    const handleSave = (row: ICategory) => {
        const newData = [...categories];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        updateCategories(newData);
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
            onCell: (record: ICategory) => ({
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
                Crear una categoría
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={categories}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default CategoriesTable;
