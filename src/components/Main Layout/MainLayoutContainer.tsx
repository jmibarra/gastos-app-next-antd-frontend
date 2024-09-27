"use client";
import Sidebar from "@/components/Sidebar";
import "./styles/layout.css";
import { Layout, Button } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState, useEffect } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CustomHeader from "../CustomHeader";

const { Header, Content } = Layout;

const MainLayoutContainer = (props: any) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState<any>(null); // Cambia el estado de user a null inicialmente

    useEffect(() => {
        // Verifica si se está en el lado del cliente
        if (typeof window !== "undefined") {
            const userData = localStorage.getItem("user");
            setUser(userData ? JSON.parse(userData) : null); // Actualiza el estado del usuario
        }
    }, []); // El efecto se ejecuta solo una vez al montar el componente

    return (
        <Layout>
            <CustomHeader user={user} />
            <Layout>
                <Sider
                    className="sider"
                    theme="light"
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                >
                    <Sidebar />
                </Sider>
                <Content className="content">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined
                                    style={{ fontSize: "16px" }}
                                />
                            ) : (
                                <MenuFoldOutlined
                                    style={{ fontSize: "16px" }}
                                />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="sider-trigger-button"
                    />
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayoutContainer;
