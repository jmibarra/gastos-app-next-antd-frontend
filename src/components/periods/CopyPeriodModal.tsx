import React from "react";
import dayjs from "dayjs";
import { Button, DatePicker, Row, Modal, Form } from "antd";

const CopyPeriodModal = (params: {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentPeriod: string;
}) => {
    const { isModalVisible, setIsModalVisible, currentPeriod } = params;

    const [form] = Form.useForm(); // Formulario de Ant Design
    const handleCancel = () => {
        setIsModalVisible(false); // Oculta el modal al cancelar
    };

    const handleCopy = () => {
        alert("Copiado"); // Alerta de copiado
        setIsModalVisible(false); // Oculta el modal al copiar
    };

    return (
        <Modal
            title="Copiar periodo"
            open={isModalVisible}
            onCancel={handleCancel}
            footer={null} // Quitamos los botones por defecto
        >
            <Form form={form} layout="vertical">
                <Form.Item label="Periodo origen">
                    <DatePicker
                        picker="month"
                        format={"MMYYYY"}
                        value={dayjs(currentPeriod, "MMYYYY")}
                    />
                </Form.Item>
                <Form.Item label="Periodo destino">
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
