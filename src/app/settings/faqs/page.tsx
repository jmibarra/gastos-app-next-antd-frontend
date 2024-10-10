// src/app/faq/page.tsx
"use client";
import React from "react";
import { Col, Divider, Row, Collapse, Button } from "antd";
import { useRouter } from "next/navigation";
import Authenticated from "@/app/authenticated/page";

const { Panel } = Collapse;

const FAQs = () => {
    const router = useRouter();

    // Función para manejar el clic en el botón de volver
    const handleGoBack = () => {
        router.push("/settings");
    };

    return (
        <Authenticated>
            <h1>Preguntas Frecuentes (FAQs)</h1>
            <Divider orientation="left">Preguntas Frecuentes</Divider>
            <Row>
                <Col span={24}>
                    <Collapse accordion>
                        <Panel header="¿Cómo puedo crear una cuenta?" key="1">
                            <p>
                                Para crear una cuenta, haz clic en el botón de
                                "Registrarse" en la página de inicio y sigue las
                                instrucciones para completar el formulario de
                                registro.
                            </p>
                        </Panel>
                        <Panel
                            header="¿Cómo puedo restablecer mi contraseña?"
                            key="2"
                        >
                            <p>
                                Si has olvidado tu contraseña, haz clic en
                                "¿Olvidaste tu contraseña?" en la página de
                                inicio de sesión y sigue los pasos para
                                restablecerla.
                            </p>
                        </Panel>
                        <Panel
                            header="¿Dónde puedo ver mis transacciones?"
                            key="3"
                        >
                            <p>
                                Puedes ver todas tus transacciones en la sección
                                de "Historial de Transacciones" en tu perfil.
                                Asegúrate de haber iniciado sesión.
                            </p>
                        </Panel>
                        <Panel header="¿Cómo contacto con el soporte?" key="4">
                            <p>
                                Puedes ponerte en contacto con nuestro equipo de
                                soporte a través de la página de "Contacto" o
                                enviando un correo electrónico a
                                soporte@ejemplo.com.
                            </p>
                        </Panel>
                    </Collapse>
                </Col>
            </Row>
            <Divider />
            <Button type="primary" onClick={handleGoBack}>
                Volver a Configuración
            </Button>
        </Authenticated>
    );
};

export default FAQs;
