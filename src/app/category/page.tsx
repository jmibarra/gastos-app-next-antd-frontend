"use client";
import React, { useEffect, useState } from "react";
import Authenticated from "../authenticated/page";
import { Col, Divider, Row } from "antd";
import { getCategories } from "./services";
import CategoriesTable from "@/components/category/CategoriesTable";

const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const fetchedCategories = await getCategories();
            setCategories(fetchedCategories);
        };
        fetchCategories();
    }, []);

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
                    />
                </Col>
            </Row>
        </Authenticated>
    );
};

export default Category;
