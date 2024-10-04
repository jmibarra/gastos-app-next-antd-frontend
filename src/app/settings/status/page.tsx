// src/app/category/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Button } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "@/app/authenticated/page";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [authToken, setAuthToken] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        // Obtener token del usuario desde localStorage
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    // Función para manejar el clic en el botón de volver
    const handleGoBack = () => {
        router.push("/settings");
    };

    return (
        <Authenticated>
            <h1>Estados</h1>
            <Divider orientation="left">Estados disponibles</Divider>
            <Row>
                <Col span={24}>Aca va la tabla</Col>
            </Row>
            <Divider />
            <Button type="primary" onClick={handleGoBack}>
                Volver a Configuración
            </Button>
        </Authenticated>
    );
};

export default Category;
