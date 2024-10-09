import { IInvestment } from "@/app/investments/models";
import React, { useContext, useEffect, useRef, useState } from "react";

import type { GetRef } from "antd";
import { Button, Form, Input, Popconfirm, Select, Table } from "antd";

import dayjs from "dayjs";
import { updateInvestmentById } from "@/app/investments/services";

const { Option } = Select;

type FormInstance<T> = GetRef<typeof Form<T>>;

const EditableContext = React.createContext<FormInstance<any> | null>(null);

type InputRef = GetRef<typeof Input>;
type SelectRef = GetRef<typeof Select>;

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: keyof IInvestment;
    record: IInvestment;
    handleSave: (record: IInvestment) => void;
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
    const selectRef = useRef<SelectRef>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            if (title === "Tipo de inversión") {
                selectRef.current?.focus();
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

            if (values.date) {
                values.date = dayjs(values.date).startOf("day").toDate();
            }

            const newValue = { ...record, ...values };

            const response = updateInvestmentById(
                newValue._id,
                newValue,
                authToken
            );

            response.then((updatedRecord: IInvestment) => {
                handleSave(updatedRecord);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;

    if (
        editable &&
        (dataIndex === "name" ||
            dataIndex === "averagePurchasePrice" ||
            dataIndex === "quantity" ||
            dataIndex === "ticker" ||
            dataIndex === "currentPrice")
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

    if (editable && dataIndex == "type") {
        childNode = editing ? (
            <Form.Item
                name="type"
                rules={[
                    {
                        required: true,
                        message: "Por favor seleccione un tipo de instrumento.",
                    },
                ]}
            >
                <Select ref={selectRef} onBlur={save}>
                    <Option value="CEDEARS">CEDEARS</Option>
                    <Option value="Obligación Negociable">
                        Obligación Negociable
                    </Option>
                    <Option value="Bonos">Bonos</Option>
                    <Option value="Efectivo">Efectivo</Option>
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

    return <td {...restProps}>{childNode}</td>;
};

interface EditableRowProps {
    index: number;
}

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
