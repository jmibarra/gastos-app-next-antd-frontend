"use client";
import {
    AreaChartOutlined,
    DashboardOutlined,
    DollarOutlined,
    ReconciliationOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import { Flex, Menu } from "antd";
import React from "react";
import { useRouter } from "next/navigation";

const Sidebar = () => {
    const handleLogout = () => {
        localStorage.removeItem("user");
    };

    const router = useRouter();

    return (
        <>
            <Flex align="center" justify="center">
                <div className="logo">
                    <DollarOutlined />
                </div>
            </Flex>
            <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                className="menu-bar"
                items={[
                    { key: 1, icon: <DashboardOutlined />, label: "Dashboard" },
                    {
                        key: 2,
                        icon: <ReconciliationOutlined />,
                        label: "Periodos",
                    },
                    {
                        key: 3,
                        icon: <AreaChartOutlined />,
                        label: "Inversiones",
                    },
                    {
                        key: 4,
                        icon: <UnlockOutlined />,
                        label: "Logout",
                    },
                ]}
            />
        </>
    );
};

export default Sidebar;
