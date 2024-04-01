// CategoryIcons.tsx
import React from "react";
import {
    CheckOutlined,
    WarningOutlined,
    BankOutlined,
    AimOutlined,
} from "@ant-design/icons";

export const StatusIcons: React.FC<{ status: string }> = ({ status }) => {
    const statusIcon: any = {
        Pago: <CheckOutlined />,
        Pendiente: <WarningOutlined />,
        Transferido: <BankOutlined />,
        Estimado: <AimOutlined />,
    };

    return statusIcon[status] || null;
};
