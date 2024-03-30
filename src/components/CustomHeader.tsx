import {
    MessageOutlined,
    NotificationOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Avatar, Flex, Typography } from "antd";
import React from "react";

const CustomHeader = () => {
    return (
        <Flex align="center" justify="space-between">
            <Typography.Title level={3} type="secondary">
                Gastos
            </Typography.Title>
        </Flex>
    );
};

export default CustomHeader;
