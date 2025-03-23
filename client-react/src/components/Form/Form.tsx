import React, { useState } from "react";
import { TextField, InputAdornment, IconButton, Button, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FormProps } from "./types";

export const FormComponent: React.FC<{ props: FormProps }> = ({ props }) => {
  const { title, fields, actions, onSubmit, isLoading, onFormChange } = props;

  const [passwordVisibility, setPasswordVisibility] = useState<{ [key: string]: boolean }>({});

  const handlePasswordVisibility = (id: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <h1>{title}</h1>
      <form onSubmit={onSubmit} className="login-form">
        {fields.map((field) => (
          <TextField
            key={field.id}
            className="form-field"
            label={field.label}
            variant="standard"
            fullWidth
            type={field.type === "password" && !passwordVisibility[field.id] ? "password" : "text"}
            InputProps={
              field.type === "password"
                ? {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => handlePasswordVisibility(field.id)} edge="end">
                          {passwordVisibility[field.id] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }
                : undefined
            }
            onChange={(e) => onFormChange(field.id, e.target.value)}
          />
        ))}

        {/* Render Action Buttons */}
        <div className="form-actions">
          {actions.map((action, index) => (
            <Button
              key={index}
              type={action.type}
              variant="contained"
              color="primary"
              onClick={action.onClick}
            >
              { isLoading && action.type === 'submit' ? (
                <CircularProgress size={24} color="inherit" style={{ marginRight: 8 }} />
              ) : action.label }
            </Button>
          ))}
        </div>
      </form>
    </>
  );
};