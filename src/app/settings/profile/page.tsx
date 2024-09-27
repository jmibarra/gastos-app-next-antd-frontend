"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Form,
    Input,
    Button,
    message,
    Row,
    Col,
    Card,
    Typography,
    Space,
    Avatar,
} from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const EditProfile: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Cargar la información del usuario desde localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setUser(user);
            // Inicializa el formulario con los datos del usuario
            form.setFieldsValue({
                email: user.email,
                fullName: user.fullName,
                username: user.username,
            });
        } else {
            router.push("/login"); // Redirige si no hay sesión
        }
    }, [form, router]);

    const handleUpdateProfile = async (values: {
        email: string;
        fullName: string;
        username: string;
    }) => {
        setLoading(true);
        try {
            // Aquí iría tu lógica para enviar los datos actualizados al servidor
            // Ejemplo: const response = await fetch('/api/update-profile', { method: 'POST', body: JSON.stringify(values) });

            // Actualiza el localStorage con la nueva información
            const updatedUser = {
                ...user,
                email: values.email,
                fullName: values.fullName,
                username: values.username,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            //Acá realizaría el llamado a la api

            message.success("Perfil actualizado exitosamente");
            window.location.reload();
        } catch (error) {
            console.error("Error al actualizar el perfil", error);
            message.error("Error al actualizar el perfil");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh" }}>
            <Col>
                <Card
                    style={{ width: 400, textAlign: "center" }}
                    bordered={false}
                >
                    <Button
                        type="link"
                        onClick={() => router.back()} // Volver a la página anterior
                        style={{ position: "absolute", top: 16, left: 16 }}
                    >
                        Volver
                    </Button>
                    {user && (
                        <Avatar
                            src={
                                user.avatar || "https://via.placeholder.com/150"
                            }
                            size={100}
                            style={{ marginBottom: 20 }}
                        />
                    )}
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        <Title level={3}>Editar Perfil</Title>
                        <Form
                            form={form}
                            name="edit-profile-form"
                            onFinish={handleUpdateProfile}
                            layout="vertical"
                        >
                            <Form.Item
                                name="username"
                                label="Nombre de usuario"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Por favor ingresa tu nombre de usuario",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Nombre de usuario"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Por favor ingresa tu email",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="Email"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item
                                name="fullName"
                                label="Nombre completo"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Por favor ingresa tu nombre completo",
                                    },
                                ]}
                            >
                                <Input
                                    placeholder="Nombre completo"
                                    size="large"
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    size="large"
                                >
                                    Actualizar Perfil
                                </Button>
                            </Form.Item>
                        </Form>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default EditProfile;
