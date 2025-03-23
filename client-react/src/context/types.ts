import { AlertColor } from "@mui/material";

export interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  hideToast: () => void;
}