import React from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Template from "../template/Template";
import Login from "../pages/Login";

const GlobalRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<Template />}>
                    <Route path="/*"/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default GlobalRouter;