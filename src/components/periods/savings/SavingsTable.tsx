import React, { useContext, useEffect, useRef, useState } from "react";
import type { GetRef } from "antd";
import dayjs from "dayjs";
import {
    Button,
    Form,
    Input,
    Popconfirm,
    Select,
    DatePicker,
    Table,
    Tag,
} from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { ISaving } from "@/app/period/[period]/models";
import {
    createSaving,
    deleteSavingById,
    updateSavingById,
} from "@/app/period/[period]/services";

const { Option } = Select;

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
    dataIndex: keyof ISaving;
    record: ISaving;
    handleSave: (record: ISaving) => void;
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

    useEffect(() => {
        if (editing) {
            if (title === "Estado") {
                selectRef.current?.focus();
            } else if (title === "Fecha de ingreso") {
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
                console.log(updatedRecord);
                handleSave(updatedRecord);
            });
        } catch (errInfo) {
            console.log("Save failed:", errInfo);
        }
    };

    let childNode = children;
    if (editable && title !== "Estado" && title !== "Fecha de ingreso") {
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
                <Select ref={selectRef} onBlur={save}>
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

    if (editable && title == "Fecha de ingreso") {
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
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

type EditableTableProps = Parameters<typeof Table<ISaving>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

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
            title: "Fecha de ingreso",
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
            date: "2024-02-20T20:19:40.723Z",
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
