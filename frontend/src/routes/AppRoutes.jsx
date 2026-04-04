import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import AdminDashboard from "../pages/admin/Dashboard";
import UserDashboard from "../pages/user/Dashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} /> {/* default route */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<UserDashboard />} /> {/* matches your login redirect */}
      <Route path="/user" element={<UserDashboard />} />
    </Routes>
  );
};

export default AppRoutes;