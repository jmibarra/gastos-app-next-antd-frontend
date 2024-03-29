// pages/ExamplePage.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import "../layout.css";
// pages/ExamplePage.tsx
import { Layout, Table, Card, Button } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header, Content } = Layout;

const PeriodLayout: React.FC = () => {
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
            </Sider>
            <Layout>
                <Header className="header">b</Header>
                <Content className="content">c</Content>
            </Layout>
        </Layout>
    );
};

export default PeriodLayout;
