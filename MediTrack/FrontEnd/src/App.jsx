import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/doctor" element={<DoctorDashboard />} />
                    <Route path="/patient" element={<PatientDashboard />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
