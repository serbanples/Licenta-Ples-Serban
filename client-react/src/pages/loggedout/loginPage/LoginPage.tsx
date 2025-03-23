import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useRequest, useToast } from "../../../hooks";
import { FormComponent, FormProps } from "../../../components";
import { login } from "../../../services/auth";
import { routes } from "../../../routes/routeConfig";
import { LoginFormType } from "../../../types";

import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { request, loading } = useRequest();
  const [formData, setFormData] = useState<LoginFormType>({ email: '', password: ''});

  const handleFormChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }))
  }

  const formProps: FormProps = {
    title: "Login",
    fields: [
      { id: 'email', label: "Email", type: "email" },
      { id: 'password', label: "Password", type: "password" },
    ],
    actions: [
      { label: "Sign In", type: "submit" },
      { label: "Dont have an account? Sign up!", type: "button", onClick: () => alert("Cancelled!") },
    ],
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleLogin();
    },
    isLoading: loading,
    onFormChange: handleFormChange
  }

  const handleLogin = () => {
    return request(login, {
      onError(error) {
        showToast(error.message, 'error');
      }, 
      onSuccess(_) {
        navigate(routes.signup, { replace: true });
      },
    }, formData)
  }

  return (
    <div className="login-form">
      <FormComponent props={formProps} />
    </div>
  );
};