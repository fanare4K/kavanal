import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";

import UserDashboard from "../pages/user/Dashboard";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<Users />} />

        {/* User routes */}
        <Route path="/user" element={<UserDashboard />} />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;