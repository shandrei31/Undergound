import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    alert("Unauthorized: Admin Access Only");
    return <Navigate to="/login" replace />;
  }

  return children;
}