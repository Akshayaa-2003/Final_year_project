import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const storedUser = localStorage.getItem("studentUser");

  if (!user && !storedUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
