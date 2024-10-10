import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import dayjs from "dayjs";
import { DatePicker, Form, Input, Select, Spin, Table } from "antd";

import { IExpense } from "@/app/period/[period]/models/expense.model";
import { ICategory } from "@/app/settings/category/models";
import { IStatus } from "@/app/settings/status/models";

import { CategoryIcons } from "../../category/categoryIcons";
import { updateExpenseById } from "@/app/period/[period]/services/expenses.service";

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;
type DateRef = GetRef<typeof DatePicker>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const { Option } = Select;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

interface EditableRowProps {
    index: number;
}

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof IExpense;
    record: IExpense;
    categories: ICategory[];
    statuses: IStatus[];
    handleSave: (record: IExpense) => void;
    authToken: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    categories,
    statuses,
    handleSave,
    authToken,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<InputRef>(null);
    const selectRef = useRef<SelectRef>(null);
    const dateRef = useRef<DateRef>(null);
    const form = useContext(EditableContext)!;

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
            setLoading(true);

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
                setLoading(false);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
            setLoading(false);
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
                    <Select ref={selectRef} onBlur={save} onChange={save}>
                        {statuses.map((status) => (
                            <Select.Option key={status._id} value={status._id}>
                                {status.name}
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
                    {loading ? <Spin size="small" /> : children}{" "}
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
                    {loading ? <Spin size="small" /> : children}{" "}
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
                    {loading ? <Spin size="small" /> : children}{" "}
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
                    {loading ? <Spin size="small" /> : children}{" "}
                </div>
            );
        }
    }

    return <td {...restProps}>{childNode}</td>;
};

export const EditableRow: React.FC<EditableRowProps> = ({
    index,
    ...props
}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};
