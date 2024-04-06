"use client";
import React, { useEffect, useState } from "react";
import Authenticated from "../authenticated/page";
import { Col, Divider, Row } from "antd";
import { getCategories } from "./services";

const Category = () => {
    const [category, setCategory] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategory(fetchedCategories);
        };
        fetchCategories();
    }, []);

    return (
        <Authenticated>
            <h1>Categorías de gastos </h1>
            <Divider orientation="left">Categorías disponibles</Divider>
            <Row>
                <Col span={24}>Aca va la tabla de categorias</Col>
            </Row>
        </Authenticated>
    );
};

export default Category;
