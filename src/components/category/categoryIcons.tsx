// CategoryIcons.tsx
import React from "react";
import {
    CarOutlined,
    AuditOutlined,
    HomeOutlined,
    SpotifyOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    SkinOutlined,
} from "@ant-design/icons";

export const CategoryIcons: React.FC<{ category: string | undefined }> = ({
    category,
}) => {
    const categoryIcons: any = {
        Transporte: <CarOutlined />,
        Impuestos: <AuditOutlined />,
        Hogar: <HomeOutlined />,
        Suscripciones: <SpotifyOutlined />,
        Compras: <ShopOutlined />,
        Supermercado: <ShoppingCartOutlined />,
        Ropa: <SkinOutlined />,

        // Agrega más iconos y categorías según sea necesario
    };

    if (!category) {
        return null;
    }
    return categoryIcons[category] || null;
};
