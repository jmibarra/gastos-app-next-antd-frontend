// pages/ExamplePage.tsx
"use client";
import Sidebar from "@/components/Sidebar";
import "./styles/layout.css";
import { Layout, Button } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import CustomHeader from "../CustomHeader";

const { Header, Content } = Layout;

const MainLayoutContainer = (props: any) => {
    const { children } = props;
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout>
            <CustomHeader />
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
