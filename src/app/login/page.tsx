"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Flex, Form, Input, Button, message, Row, Card } from "antd";

const Login: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleLogin = async (values: {
        username: string;
        password: string;
    }) => {
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

            message.success("Usuario autenticado"); // Mostrar mensaje de éxito
            console.log("Login successful");
            router.push("/");
        } catch (error) {
            console.error("Login failed", error);
            console.error("Error:", error);
            message.error("Error al iniciar sesión"); // Mostrar mensaje de error
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center">
            <Card title="Iniciar Sesión" style={{ width: 300 }}>
                <Flex gap="middle" wrap="wrap">
                    <Form
                        name="login-form"
                        initialValues={{ remember: true }}
                        onFinish={handleLogin}
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor ingresa tu usuario",
                                },
                            ]}
                        >
                            <Input placeholder="Usuario" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Por favor ingresa tu contraseña",
                                },
                            ]}
                        >
                            <Input.Password placeholder="Contraseña" />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                Iniciar Sesión
                            </Button>
                        </Form.Item>
                    </Form>
                </Flex>
            </Card>
        </Row>
    );
};

export default Login;
