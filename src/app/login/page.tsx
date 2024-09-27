"use client";
import { useState } from "react";
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
} from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async (values: { email: string; password: string }) => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            const {
                authentication,
                _id,
                username,
                email,
                fullName,
                avatarUrl,
            } = data;

            localStorage.setItem(
                "user",
                JSON.stringify({
                    token: authentication.sessionToken,
                    id: _id,
                    username,
                    email,
                    fullName,
                    avatar: avatarUrl,
                })
            );

            message.success("Usuario autenticado");
            router.push("/");
        } catch (error) {
            console.error("Login failed", error);
            message.error("Error al iniciar sesión");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = () => {
        router.push("/register"); // Asegúrate de que esta ruta exista
    };

    return (
        <Row justify="center" align="middle">
            <Col>
                <Card
                    style={{ width: 350, textAlign: "center" }}
                    bordered={false}
                >
                    <Space
                        direction="vertical"
                        size="large"
                        style={{ width: "100%" }}
                    >
                        <Title level={3}>Iniciar Sesión</Title>
                        <Form
                            name="login-form"
                            initialValues={{ remember: true }}
                            onFinish={handleLogin}
                            layout="vertical"
                        >
                            <Form.Item
                                name="email"
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
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            "Por favor ingresa tu contraseña",
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="Contraseña"
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
                                    Iniciar Sesión
                                </Button>
                            </Form.Item>
                        </Form>
                        <Space direction="vertical" size="small">
                            <Text type="secondary">
                                ¿No tienes una cuenta?{" "}
                                <Button type="link" onClick={handleRegister}>
                                    Regístrate
                                </Button>
                            </Text>
                            <Text type="secondary">
                                ¿Olvidaste tu contraseña?
                            </Text>
                        </Space>
                    </Space>
                </Card>
            </Col>
        </Row>
    );
};

export default Login;
