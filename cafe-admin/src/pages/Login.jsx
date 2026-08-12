import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/admin/login", {
                phone,
                password,
            });

            login(
                res.data.user,
                res.data.token
            );

            navigate("/dashboard");
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login Failed"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow w-96"
            >
                <h1 className="text-2xl font-bold mb-6">
                    Cafe Admin Login
                </h1>

                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) =>
                        setPhone(e.target.value)
                    }
                    className="w-full border p-3 rounded mb-4"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                    className="w-full border p-3 rounded mb-4"
                />

                <button
                    type="submit"
                    className="w-full bg-black text-white p-3 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}