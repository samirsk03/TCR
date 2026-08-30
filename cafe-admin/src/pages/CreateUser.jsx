import { useState } from "react";
import api from "../services/api";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    password: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      setLoading(true);

      const res = await api.post(
        "/auth/admin/create-user",
        formData
      );

      setMessage(
        res.data.message || "User created successfully" ``
      );

      setFormData({
        name: "",
        phone: "",
        password: "",
        role: "staff",
      });

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* Header */}

      <div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Create Staff / Admin
        </h1>

        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Create a new staff or admin account.
        </p>
      </div>

      {/* Form */}

      <div className="max-w-2xl bg-white dark:bg-[#231F1C] rounded-3xl shadow-md border border-gray-100 dark:border-[#352E2A] p-8">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* Name */}

          <div>
            <label className="block font-medium mb-2">
              Name
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name"
              required
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Phone */}

          <div>
            <label className="block font-medium mb-2">
              Phone
            </label>

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Password */}

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#6F4E37]"
            />
          </div>

          {/* Role */}

          <div>
            <label className="block font-medium mb-2">
              Role
            </label>

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#6F4E37]"
            >
              <option value="staff">
                Staff
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>

          {/* Message */}

          {message && (
            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#6F4E37] text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create User"}
          </button>

        </form>

      </div>

    </div>
  );
}