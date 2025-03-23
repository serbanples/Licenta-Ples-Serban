import React, { useState } from "react";

import './SignupPage.css';
import { useRequest, useToast } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { FormComponent, FormProps } from "../../../components";
import { signup } from "../../../services/auth";
import { routes } from "../../../routes/routeConfig";
import { SignupFormType } from "../../../types";

export const SignupPage: React.FC = () => {
  const { showToast } = useToast();
  const { request, loading } = useRequest();
  const [formData, setFormData] = useState<SignupFormType>({ email: '', fullName: '', password: '', confirmPassword: ''});

  const navigate = useNavigate();

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
      { id: 'fullName', label: "Full Name", type: 'text' },
      { id: 'password', label: "Password", type: "password" },
      { id: 'confirmPassword', label: "Confirm Password", type: 'password' },
    ],
    actions: [
      { label: "Create Account", type: "submit" },
    ],
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      handleSignup();
    },
    isLoading: loading,
    onFormChange: handleFormChange
    }

  const handleSignup = () => {
    return request(signup, {
      onError(error) {
        showToast(error.message, 'error');
      },
      onSuccess(_) {
        navigate(routes.login, { replace: true });
      },
    }, formData)
  }

  return (
    <div className="login-form">
      <FormComponent props={formProps} />
    </div>
  );
}