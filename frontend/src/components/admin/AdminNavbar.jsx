import React, { useEffect, useState } from "react";
import { FaBars } from "react-icons/fa";
import ThemeToggle from "../ThemeToggle";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

const AdminNavbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  // GET USER
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await API.get("/auth/me/");
        setUsername(res.data.username);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMe();
  }, []);

  // LOGOUT
  const handleLogout = async () => {
    try {
      const refresh = localStorage.getItem("refresh");

      await API.post("/auth/logout/", { refresh });

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/login");
    } catch (error) {
      console.error(error);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/login");
    }
  };

  return (
    <header
      className="
        flex items-center justify-between px-6 py-4 shadow-md
        bg-light-background text-light-text
        dark:bg-dark-background dark:text-dark-text
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        

        <h1 className="text-xl font-bold">
          Welcome, {username || "Admin"}
        </h1>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <ThemeToggle />

        <button
          onClick={handleLogout}
          className="
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium
            bg-light-primary text-light-text
            hover:opacity-90 hover:shadow-md
            transition-all duration-200
            active:scale-95
            dark:bg-dark-primary dark:text-dark-text
          "
        >
          <FiLogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminNavbar;
