import { useEffect, useState } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";
import { speak } from "../utils/speak";

export default function PatientDashboard() {
    const { token, user } = useAuth();
    const [reminders, setReminders] = useState([]);

    useEffect(() => {
        loadMyReminders();
    }, []);

    const loadMyReminders = async () => {
        const res = await API.get("/reminder/patient/" + user.id, {
            headers: { Authorization: token }
        });

        setReminders(res.data);
    };

    // AUTO SPEAK EVERY 1 MINUTE
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const currentTime = now.toTimeString().slice(0, 5);

            reminders.forEach((r) => {
                if (r.timings.includes(currentTime)) {
                    const message = `Take ${r.dosage} of ${r.medicineName}. ${r.instructions}`;
                    speak(message);
                }
            });
        }, 60000);

        return () => clearInterval(interval);
    }, [reminders]);

    return (
        <div style={{ padding: 20 }}>
            <h2>Patient Dashboard</h2>

            <h3>Your Medication Schedule</h3>

            {reminders.map((r) => (
                <div key={r._id} style={{ marginBottom: 20 }}>
                    <b>{r.medicineName}</b> – {r.dosage} <br />
                    Timings: {r.timings.join(", ")} <br />
                    Instructions: {r.instructions}
                </div>
            ))}
        </div>
    );
}
