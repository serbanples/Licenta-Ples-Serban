import React from "react";
import { Outlet } from "react-router-dom";

import './AuthLayout.css';

export const AuthLayout: React.FC = () => {
  return (
    <div className="auth-layout">
      <div className="form-container">
        <Outlet />
      </div>
    </div>
  )
}