"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

const Authenticated = (props: any) => {
    const { children } = props;
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user") as string);
        if (!userData) {
            router.push("/login");
        } else {
            setAuthenticated(true);
        }
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!authenticated) {
        return null; // Evitar renderizar cualquier contenido hasta que se autentique
    }

    return <>{children}</>;
};

export default Authenticated;
