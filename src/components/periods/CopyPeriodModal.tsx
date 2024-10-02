import React from "react";
import dayjs from "dayjs";
import { Button, DatePicker, Row, Modal, Form } from "antd";
import { copyPeriodData } from "@/app/period/[period]/services/common.services";

const CopyPeriodModal = (params: {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentPeriod: string;
    authToken: string;
}) => {
    const { isModalVisible, setIsModalVisible, currentPeriod, authToken } =
        params;

    const [form] = Form.useForm(); // Formulario de Ant Design
    const handleCancel = () => {
        setIsModalVisible(false); // Oculta el modal al cancelar
    };

    const handleCopy = async () => {
        try {
            const values = await form.validateFields();

            copyPeriodData(
                values.originPeriod.format("MMYYYY"),
                values.destinationPeriod.format("MMYYYY"),
                authToken
            );
            setIsModalVisible(false); // Oculta el modal al copiar
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Modal
            title="Copiar periodo"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null} // Quitamos los botones por defecto
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Periodo origen"
                    name="originPeriod"
                    required
                    initialValue={dayjs(currentPeriod, "MMYYYY")}
                    rules={[
                        {
                            required: true,
                            message:
                                "Por favor seleccione un periodo de origen.",
                        },
                    ]}
                >
                    <DatePicker picker="month" format={"MMYYYY"} />
                </Form.Item>
                <Form.Item
                    label="Periodo destino"
                    name="destinationPeriod"
                    required
                    rules={[
                        {
                            required: true,
                            message:
                                "Por favor seleccione un periodo de destino.",
                        },
                    ]}
                >
                    <DatePicker picker="month" format={"MMYYYY"} />
                </Form.Item>
                <Row justify="end">
                    <Button type="link" onClick={handleCancel}>
                        Cancelar
                    </Button>
                    <Button
                        type="primary"
                        danger
                        onClick={handleCopy}
                        style={{ marginLeft: 10 }}
                    >
                        Copiar
                    </Button>
                </Row>
            </Form>
        </Modal>
    );
};

export default CopyPeriodModal;
