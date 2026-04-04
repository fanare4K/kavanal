import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "", // or email depending on backend
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await login(formData);

      console.log("Login success:", res.data);

      // ✅ Optional: role-based redirect
      if (res.data.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-lg w-80"
      >
        <h2 className="text-2xl font-bold mb-5 text-center text-gray-700">
          Login
        </h2>

        {/* Username or Email */}
        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          className="w-full p-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={formData.password}
          onChange={handleChange}
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition duration-200"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;