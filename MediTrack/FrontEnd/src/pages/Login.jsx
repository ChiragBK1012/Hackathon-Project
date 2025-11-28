import { useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setUser, setToken } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await API.post("/auth/login", { email, password });

            setToken(res.data.token);
            setUser({ role: res.data.role });

            if (res.data.role === "doctor") navigate("/doctor");
            else navigate("/patient");
        } catch (err) {
            alert("Login Failed");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Login</h2>

            <input
                type="text"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)} />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)} />

            <br /><br />

            <button onClick={handleLogin}>Login</button>
        </div>
    );
}
