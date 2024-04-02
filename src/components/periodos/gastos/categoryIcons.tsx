// CategoryIcons.tsx
import React from "react";
import { CarOutlined, AuditOutlined } from "@ant-design/icons";

export const CategoryIcons: React.FC<{ category: string | undefined }> = ({
    category,
}) => {
    const categoryIcons: any = {
        Transporte: <CarOutlined />,
        Impuestos: <AuditOutlined />,
        // Agrega más iconos y categorías según sea necesario
    };

    if (!category) {
        return null;
    }
    return categoryIcons[category] || null;
};
