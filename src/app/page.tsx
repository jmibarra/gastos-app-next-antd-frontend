"use client";
import React from "react";
import { Button } from "antd";
import Authenticated from "./authenticated/page";

const handleLogout = () => {
    localStorage.removeItem("user");
};
const Home = () => (
    <div className="App">
        <Authenticated />
        <Button type="primary" onClick={handleLogout}>
            Logout
        </Button>
    </div>
);

export default Home;
