import React, { useState } from "react";
import dayjs from "dayjs";
import {
    Button,
    DatePicker,
    Row,
    Modal,
    Form,
    Popconfirm,
    message,
} from "antd";
import { copyPeriodData } from "@/app/period/[period]/services/common.services";

const CopyPeriodModal = (params: {
    isModalVisible: boolean;
    setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentPeriod: string;
    authToken: string;
}) => {
    const [isCopying, setIsCopying] = useState(false);
    const { isModalVisible, setIsModalVisible, currentPeriod, authToken } =
        params;

    const [form] = Form.useForm(); // Formulario de Ant Design

    const handleCancel = () => {
        setIsModalVisible(false); // Oculta el modal al cancelar
    };

    const handleCopy = async () => {
        try {
            const values = await form.validateFields();
            setIsCopying(true); // Activamos el estado de carga

            // Llamada al servicio para copiar los datos
            await copyPeriodData(
                values.originPeriod.format("MMYYYY"),
                values.destinationPeriod.format("MMYYYY"),
                authToken
            );

            // Mostrar mensaje de éxito
            message.success("La copia del periodo fue exitosa.");

            setIsModalVisible(false); // Ahora cerramos el modal después del éxito
        } catch (error) {
            console.log(error);
            message.error("Ocurrió un error durante la copia del periodo."); // Mensaje de error en caso de fallo
        } finally {
            setIsCopying(false); // Desactivamos el estado de carga
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
                    <Popconfirm
                        title="¿Estás seguro de que quieres copiar los datos del periodo?"
                        onConfirm={handleCopy} // Ejecuta la acción al confirmar
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                            loading={isCopying} // Añadimos el estado de carga
                            style={{ marginLeft: 10 }}
                        >
                            {isCopying ? null : "Copiar"}
                        </Button>
                    </Popconfirm>
                </Row>
            </Form>
        </Modal>
    );
};

export default CopyPeriodModal;
