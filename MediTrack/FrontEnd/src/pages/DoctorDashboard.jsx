import { useState, useEffect } from "react";
import API from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function DoctorDashboard() {
    const { token } = useAuth();
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const [medicineName, setMedicine] = useState("");
    const [dosage, setDosage] = useState("");
    const [instructions, setInstructions] = useState("");
    const [timings, setTimings] = useState("");

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        const res = await API.get("/doctor/patients", {
            headers: { Authorization: token }
        });
        setPatients(res.data);
    };

    const addReminder = async () => {
        await API.post("/reminder/add",
            {
                patientId: selectedPatient,
                medicineName,
                dosage,
                instructions,
                timings: timings.split(",")
            },
            { headers: { Authorization: token } }
        );

        alert("Reminder Added!");
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Doctor Dashboard</h2>

            <h3>Your Patients:</h3>
            <select onChange={(e) => setSelectedPatient(e.target.value)}>
                <option>Select</option>
                {patients.map((p) => (
                    <option key={p._id} value={p._id}>
                        {p.contact} (Age: {p.age})
                    </option>
                ))}
            </select>

            <br /><br />

            <input placeholder="Medicine Name" onChange={(e) => setMedicine(e.target.value)} />
            <br /><br />

            <input placeholder="Dosage" onChange={(e) => setDosage(e.target.value)} />
            <br /><br />

            <input placeholder="Instructions" onChange={(e) => setInstructions(e.target.value)} />
            <br /><br />

            <input placeholder="Timings e.g. 09:00,14:00,20:00" onChange={(e) => setTimings(e.target.value)} />
            <br /><br />

            <button onClick={addReminder}>Add Reminder</button>
        </div>
    );
}
