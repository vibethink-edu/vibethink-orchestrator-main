import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@/index.css";
import { AuthProvider } from "@/shared/hooks/hooks/useAuth";
import AdminRouter from "./AdminRouter";

const AdminApp = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminRouter />
      </AuthProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
); 