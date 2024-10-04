import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import { Button, Form, Input, Popconfirm, Table } from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ICategory } from "@/app/settings/category/models";
import {
    createCategory,
    deleteCategoryById,
    updateCategoryById,
} from "@/app/settings/category/services";
import { CategoryIcons } from "./categoryIcons";

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;
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
    authToken: string;
}

import { Select } from "antd";
import { categoryIconsMap } from "./categoryIcons"; // Asumimos que es un objeto que contiene el mapeo de iconos

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
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            if (dataIndex === "icon") {
                selectRef.current?.focus();
            } else inputRef.current!.focus();
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
            updateCategoryById(record._id, newValue, authToken);
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        if (dataIndex === "icon") {
            // Selector de íconos
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
                    <Select ref={selectRef} onBlur={save} onChange={save}>
                        {Object.keys(categoryIconsMap).map((iconKey) => (
                            <Select.Option key={iconKey} value={iconKey}>
                                <span style={{ marginRight: 8 }}>
                                    {categoryIconsMap[iconKey]}
                                </span>
                                {iconKey}
                            </Select.Option>
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
        } else if (dataIndex === "color") {
            // Campo de color
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
            // Campos de texto
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

type EditableTableProps = Parameters<typeof Table<ICategory>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const CategoriesTable = (params: {
    categories: ICategory[];
    updateCategories: any;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { categories, updateCategories, authToken } = params;

    const handleDelete = (key: string) => {
        const newData = categories.filter((item) => item._id !== key);
        updateCategories(newData);
        deleteCategoryById(key, authToken);
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
            render: (value) => (
                <>
                    <CategoryIcons category={value} /> {value}
                </>
            ),
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

        const response = createCategory(newData, authToken);

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
