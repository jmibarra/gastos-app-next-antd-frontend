// pages/ExamplePage.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import "./styles/layout.css";
import { Layout, Table, Card, Button, Flex, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { Children, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CustomHeader from "@/components/CustomHeader";

const { Header, Content } = Layout;

const MainLayoutContainer = (props: any) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);

    return (
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
            <Layout>
                <Header className="header">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="sider-trigger-button"
                    />
                </Header>
                <Content className="content">{children}</Content>
            </Layout>
        </Layout>
    );
};

export default MainLayoutContainer;
