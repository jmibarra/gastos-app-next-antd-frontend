"use client";
import {
    AreaChartOutlined,
    DashboardOutlined,
    DollarOutlined,
    ReconciliationOutlined,
    UnlockOutlined,
} from "@ant-design/icons";
import { Menu, message } from "antd"; // Importa message
import React from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs"; // Usamos dayjs para el formato de fecha

const Sidebar = () => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("user");

        // Mostramos el mensaje de confirmación
        message.success("Se ha cerrado correctamente la sesión");

        // Redirige al login después de cerrar sesión
        router.push("/login");
    };

    // Obtenemos el periodo actual en formato MMYYYY
    const currentPeriod = dayjs().format("MMYYYY");

    const handleMenuClick = (e: any) => {
        switch (e.key) {
            case "1":
                router.push("/dashboard");
                break;
            case "2":
                router.push(`/period/${currentPeriod}`);
                break;
            case "3":
                router.push("/investments");
                break;
            case "4":
                handleLogout();
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "20px",
                }}
            >
                <div className="logo">
                    <DollarOutlined style={{ fontSize: "32px" }} />
                </div>
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                className="menu-bar"
                onClick={handleMenuClick} // Añadimos la función que maneja los clics
                items={[
                    {
                        key: "1",
                        icon: <DashboardOutlined />,
                        label: "Dashboard",
                    },
                    {
                        key: "2",
                        icon: <ReconciliationOutlined />,
                        label: "Periodos",
                    },
                    {
                        key: "3",
                        icon: <AreaChartOutlined />,
                        label: "Inversiones",
                    },
                    { key: "4", icon: <UnlockOutlined />, label: "Logout" },
                ]}
            />
        </>
    );
};

export default Sidebar;
