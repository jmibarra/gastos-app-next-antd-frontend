// src/app/category/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Button } from "antd";
import { useRouter } from "next/navigation";
import { getCategories } from "./services";
import CategoriesTable from "@/components/category/CategoriesTable";
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

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories(authToken);
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, [authToken]);

    // Función para manejar el clic en el botón de volver
    const handleGoBack = () => {
        router.push("/settings");
    };

    return (
        <Authenticated>
            <h1>Categorías de gastos</h1>
            <Divider orientation="left">Categorías disponibles</Divider>
            <Row>
                <Col span={24}>
                    <CategoriesTable
                        categories={categories}
                        updateCategories={setCategories}
                        authToken={authToken}
                    />
                </Col>
            </Row>
            <Divider />
            <Button type="primary" onClick={handleGoBack}>
                Volver a Configuración
            </Button>
        </Authenticated>
    );
};

export default Category;
