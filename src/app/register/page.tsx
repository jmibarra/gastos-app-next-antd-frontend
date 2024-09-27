"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, message, Row, Card } from "antd";

const Register: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleRegister = async (values: {
        username: string;
        email: string;
        fullName: string;
        password: string;
        confirmPassword: string;
    }) => {
        if (values.password !== values.confirmPassword) {
            message.error("Las contraseñas no coinciden");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(
                "http://localhost:8080/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: values.username,
                        email: values.email,
                        fullName: values.fullName, // Se agrega el nombre completo
                        password: values.password,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Error al registrar");
            }

            const data = await response.json();
            message.success("Usuario registrado con éxito");
            router.push("/login"); // Redirige al login tras registrarse con éxito
        } catch (error) {
            message.error("Error al registrar. Inténtalo de nuevo.");
            console.error("Register failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Row justify="center">
            <Card title="Registrarse" style={{ width: 400 }}>
                <Form name="register-form" onFinish={handleRegister}>
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message:
                                    "Por favor ingresa tu nombre de usuario",
                            },
                        ]}
                    >
                        <Input placeholder="Nombre de usuario" />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        rules={[
                            {
                                type: "email",
                                message: "Ingresa un correo válido",
                            },
                            {
                                required: true,
                                message: "Por favor ingresa tu correo",
                            },
                        ]}
                    >
                        <Input placeholder="Correo electrónico" />
                    </Form.Item>

                    <Form.Item
                        name="fullName"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa tu nombre completo",
                            },
                        ]}
                    >
                        <Input placeholder="Nombre completo" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingresa tu contraseña",
                            },
                            {
                                min: 6,
                                message:
                                    "La contraseña debe tener al menos 6 caracteres",
                            },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="Contraseña" />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        dependencies={["password"]}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: "Confirma tu contraseña",
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (
                                        !value ||
                                        getFieldValue("password") === value
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(
                                        new Error(
                                            "Las contraseñas no coinciden"
                                        )
                                    );
                                },
                            }),
                        ]}
                    >
                        <Input.Password placeholder="Confirmar contraseña" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            block
                        >
                            Registrarse
                        </Button>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="link"
                            onClick={() => router.push("/login")}
                            block
                        >
                            ¿Ya tienes cuenta? Inicia sesión
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Row>
    );
};

export default Register;
