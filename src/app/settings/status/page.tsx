// src/app/settings/status/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Col, Divider, Row, Button } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "@/app/authenticated/page";

import StatusTable from "@/components/status/StatusTable"; // Importar el nuevo componente de tabla
import { IStatus } from "../status/models";
import { getStatus } from "../status/services/status.service";

const Status = () => {
    const [statuses, setStatuses] = useState<IStatus[]>([]); // Cambiado a 'statuses' y tipo IStatus[]
    const [authToken, setAuthToken] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        // Obtener token del usuario desde localStorage
        const parsedUserData = localStorage.getItem("user");
        const user = parsedUserData ? JSON.parse(parsedUserData) : null;
        const token = user ? user.token : null;
        setAuthToken(token);
    }, []);

    useEffect(() => {
        if (!authToken) return; // No intentar buscar si no hay token
        const fetchStatuses = async () => {
            const fetchedStatuses = await getStatus(authToken);
            setStatuses(fetchedStatuses);
        };
        fetchStatuses();
    }, [authToken]); // Dependencia del authToken para recargar los estados

    // Función para manejar el clic en el botón de volver
    const handleGoBack = () => {
        router.push("/settings");
    };

    return (
        <Authenticated>
            <h1>Estados</h1>
            <Divider orientation="left">Estados disponibles</Divider>
            <Row>
                <Col span={24}>
                    <StatusTable
                        statuses={statuses}
                        updateStatuses={setStatuses}
                        authToken={authToken}
                    />
                </Col>
            </Row>
            <Divider />
            <Button type="primary" onClick={handleGoBack}>
                Volver a Configuración
            </Button>
        </Authenticated>
    );
};

export default Status;