import {
    CarOutlined,
    AuditOutlined,
    HomeOutlined,
    SpotifyOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    SkinOutlined,
    WalletOutlined,
    TeamOutlined,
    CreditCardOutlined,
    UserOutlined,
    FileUnknownOutlined,
} from "@ant-design/icons";

// Mapeo de categorías a íconos
export const categoryIconsMap: { [key: string]: React.ReactNode } = {
    Transporte: <CarOutlined />,
    Impuestos: <AuditOutlined />,
    Hogar: <HomeOutlined />,
    Suscripciones: <SpotifyOutlined />,
    Compras: <ShopOutlined />,
    Supermercado: <ShoppingCartOutlined />,
    Ropa: <SkinOutlined />,
    Ahorros: <WalletOutlined />,
    Familia: <TeamOutlined />,
    Tarjeta: <CreditCardOutlined />,
    Personal: <UserOutlined />,
};

// Componente para renderizar el ícono en la tabla
export const CategoryIcons: React.FC<{ category: string | undefined }> = ({
    category,
}) => {
    if (!category) {
        return <FileUnknownOutlined />;
    }

    return categoryIconsMap[category] || <FileUnknownOutlined />;
};
