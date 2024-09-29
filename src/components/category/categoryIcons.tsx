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
    FileUnknownOutlined,
    WalletOutlined,
} from "@ant-design/icons";

export const CategoryIcons: React.FC<{ category: string | undefined }> = ({
    category,
}) => {
    // Agrega más iconos y categorías según sea necesario si no hay conincidencia devuelvo <FileUnknownOutlined />
    const categoryIcons: any = {
        Transporte: <CarOutlined />,
        Impuestos: <AuditOutlined />,
        Hogar: <HomeOutlined />,
        Suscripciones: <SpotifyOutlined />,
        Compras: <ShopOutlined />,
        Supermercado: <ShoppingCartOutlined />,
        Ropa: <SkinOutlined />,
        Ahorros: <WalletOutlined />,
    };

    if (!category) {
        return <FileUnknownOutlined />;
    }

    return categoryIcons[category] || <FileUnknownOutlined />;
};
