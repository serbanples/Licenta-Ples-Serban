import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthLayout } from "../pages/loggedout/layout/AuthLayout";
import { SignupPage } from "../pages/loggedout/signupPage/SignupPage";
import { LoginPage } from "../pages/loggedout/loginPage/LoginPage";

import './App.css';
import { routes } from "./routeConfig";

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