import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import dayjs from "dayjs";
import { Form, Input, Select, DatePicker, Table, Spin } from "antd";
import { ISaving } from "@/app/period/[period]/models";
import { updateSavingById } from "@/app/period/[period]/services";

interface EditableRowProps {
    index: number;
}

const { Option } = Select;

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;
type DateRef = GetRef<typeof DatePicker>;
type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

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

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof ISaving;
    record: ISaving;
    handleSave: (record: ISaving) => void;
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
    const [loading, setLoading] = useState(false);

    const inputRef = useRef<InputRef>(null);
    const selectRef = useRef<SelectRef>(null);
    const dateRef = useRef<DateRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            if (title === "Estado") {
                selectRef.current?.focus();
            } else if (title === "Fecha de movimiento") {
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

            if (values.date) {
                values.date = dayjs(values.date).startOf("day").toDate();
            }

            const newValue = { ...record, ...values };

            const response = updateSavingById(
                newValue._id,
                newValue,
                authToken
            );

            response.then((updatedRecord: ISaving) => {
                handleSave(updatedRecord);
                setLoading(false);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
            setLoading(false);
        }
    };

    let childNode = children;

    if (editable && (title === "Descripción" || title === "Monto")) {
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

    if (editable && title == "Tipo de operación") {
        childNode = editing ? (
            <Form.Item
                name="type"
                rules={[
                    {
                        required: true,
                        message: "Por favor seleccione un tipo de operación.",
                    },
                ]}
            >
                <Select ref={selectRef} onBlur={save}>
                    <Option value="Ingreso">Ingreso</Option>
                    <Option value="Egreso">Egreso</Option>
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
    }

    if (editable && title == "Fecha de movimiento") {
        childNode = editing ? (
            <Form.Item name="date">
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
    }

    return <td {...restProps}>{childNode}</td>;
};
