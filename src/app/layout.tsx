import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import MainLayoutContainer from "@/components/Main Layout/MainLayoutContainer";

const RootLayout = ({ children }: React.PropsWithChildren) => (
    <html lang="en">
        <body>
            <AntdRegistry>
                <MainLayoutContainer>{children}</MainLayoutContainer>
            </AntdRegistry>
        </body>
    </html>
);

export default RootLayout;
