"use client";
import React, { useEffect, useState } from "react";
import Authenticated from "../authenticated/page";
import { Col, Divider, Row } from "antd";
import { getCategories } from "./services";
import CategoriesTable from "@/components/category/CategoriesTable";

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [authToken, setAuthToken] = useState<string>("");

    useEffect(() => {
        // Esto solo se ejecutará en el cliente
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

    console.log(categories);

    return (
        <Authenticated>
            <h1>Categorías de gastos </h1>
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
        </Authenticated>
    );
};

export default Category;
