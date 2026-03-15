import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, reqRole }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Loading session...</div>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and it doesn't match -> Redirect to home
  if (reqRole && currentUser.role !== reqRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}
