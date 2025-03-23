import React from "react";
import { Route, Routes } from "react-router-dom";

import { routes } from "./routeConfig";
import { AuthLayout, LoginPage, SignupPage } from "../pages";

import './App.css';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path={routes.auth} element={<AuthLayout />} >
        <Route path={routes.signup} element={<SignupPage />} />
        <Route path={routes.login} element={<LoginPage />} />
      </Route>
    </Routes>
  )
}