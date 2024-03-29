"use client";
import { useState } from "react";
import { Form, Input, Button, message } from "antd";

const Login: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await axios.post("http://localhost:8080/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const data = response.data;

        console.log(data);

        const { authentication, _id, username, email, fullName, avatarUrl } =
          data;

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

        console.log("Login successful");
        return true;
      } else {
        console.error("Login failed");
        return false;
      }
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    // Aquí puedes agregar la lógica para enviar los datos del formulario a tu API
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      console.log(data); // Manejar la respuesta de tu API aquí
      message.success(data.message); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error:", error);
      message.error("Error al iniciar sesión"); // Mostrar mensaje de error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login-form"
      initialValues={{ remember: true }}
      onFinish={onFinish}
    >
      <Form.Item
        name="username"
        rules={[{ required: true, message: "Por favor ingresa tu usuario" }]}
      >
        <Input placeholder="Usuario" />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: "Por favor ingresa tu contraseña" }]}
      >
        <Input.Password placeholder="Contraseña" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Iniciar Sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Login;
