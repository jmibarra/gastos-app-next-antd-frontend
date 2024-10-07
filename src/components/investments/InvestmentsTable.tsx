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
} from "antd";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import { IInvestment } from "../../app/investments/models";
import {
    createInvestment,
    deleteInvestmentById,
    updateInvestmentById,
} from "../../app/investments/services";

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
    dataIndex: keyof IInvestment;
    record: IInvestment;
    handleSave: (record: IInvestment) => void;
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
            dataIndex === "ticker")
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
                        Obligaciones Negociables
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

type EditableTableProps = Parameters<typeof Table<IInvestment>>[0];

type ColumnTypes = Exclude<EditableTableProps["columns"], undefined>;

const InvestmentsTable = (params: {
    investments: IInvestment[];
    updateInvestments: any;
    authToken: string;
}) => {
    const [createButtonLoading, setCreateButtonLoading] = useState(false);
    const { investments, updateInvestments, authToken } = params;

    const handleDelete = (key: string) => {
        const newData = investments.filter((item) => item._id !== key);
        updateInvestments(newData);
        deleteInvestmentById(key, authToken);
    };

    const defaultColumns: (ColumnTypes[number] & {
        editable?: boolean;
        dataIndex: string;
    })[] = [
        {
            title: "Ticker",
            dataIndex: "ticker",
            editable: true,
        },
        {
            title: "Nombre",
            dataIndex: "name",
            width: "30%",
            editable: true,
        },
        {
            title: "Precio promedio de compra",
            dataIndex: "averagePurchasePrice",
            editable: true,
            render: (value) => <>$ {value}</>,
        },
        {
            title: "Cantindad",
            dataIndex: "quantity",
            editable: true,
        },
        {
            title: "Tipo de instrumento",
            dataIndex: "type",
            render: (value) => <> {value}</>,
            editable: true,
        },
        {
            title: "",
            dataIndex: "operation",
            render: (_, record: IInvestment) =>
                investments.length >= 1 ? (
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
        const newData: IInvestment = {
            _id: "1",
            ticker: "TEST",
            name: `Nueva inversión`,
            averagePurchasePrice: 0,
            quantity: 1,
            type: "CEDEAR",
        };

        updateInvestments([...investments, newData]); // PRovisorio

        const response = createInvestment(newData, authToken);

        response.then((data) => {
            updateInvestments([...investments, data]);
            setCreateButtonLoading(false);
        });
    };

    const handleSave = (row: IInvestment) => {
        const newData = [...investments];
        const index = newData.findIndex((item) => row._id === item._id);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });
        updateInvestments(newData);
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
            onCell: (record: IInvestment) => ({
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
                Agregar una nueva inversión
            </Button>
            <Table
                components={components}
                rowClassName={() => "editable-row"}
                bordered
                dataSource={investments}
                columns={columns as ColumnTypes}
            />
        </div>
    );
};

export default InvestmentsTable;
