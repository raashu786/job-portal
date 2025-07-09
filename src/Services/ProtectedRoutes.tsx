import { jwtDecode } from "jwt-decode";
import { JSX } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface ProtectedRoutesProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children, allowedRoles }) => {
  const token = useSelector((state: any) => state.jwt);

  if (!token) {
    return <Navigate to="/login" />;
  }

  let decoded: any;
  try {
    decoded = jwtDecode(token);
  } catch (e) {
    console.error("Invalid token", e);
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(decoded.accountType)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export { ProtectedRoutes };
