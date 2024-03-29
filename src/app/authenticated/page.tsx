"use client";
import React from "react";
import { redirect } from "next/navigation";

const Authenticated = (props: any) => {
    const { children } = props;

    const userData = JSON.parse(localStorage.getItem("user") as string);

    if (!userData) {
        redirect("/login");
    }
    return <>{children}</>;
};

export default Authenticated;
