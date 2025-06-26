import React from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import AdminLogin from "./AdminLogin";

interface AdminRouteProps {
  children: React.ReactNode;
  requireEditor?: boolean;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  children,
  requireEditor = false,
}) => {
  const { isAdminAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAdminAuthenticated) {
    return <AdminLogin />;
  }

  // Para features específicas de editor, pode adicionar verificações futuras aqui
  if (requireEditor) {
    // Por enquanto, admin tem acesso a tudo
  }

  return <>{children}</>;
};
