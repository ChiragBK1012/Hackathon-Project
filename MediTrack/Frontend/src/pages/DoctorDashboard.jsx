import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import client from '../api/client';

const DoctorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [patientForm, setPatientForm] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
    conditions: '',
  });
  const [prescriptionForm, setPrescriptionForm] = useState({
    patientId: '',
    medicines: [{ name: '', dosage: '', time: '', durationInDays: '', instructions: '' }],
    diagnosis: '',
    notes: '',
  });

  useEffect(() => {
    if (activeTab === 'patients') {
      fetchPatients();
    } else if (activeTab === 'prescriptions') {
      fetchPrescriptions();
    }
  }, [activeTab]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const res = await client.get('/doctor/patients');
      setPatients(res.data);
    } catch (err) {
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const res = await client.get('/prescription/doctor/all');
      setPrescriptions(res.data);
    } catch (err) {
      setError('Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const conditionsArray = patientForm.conditions
        ? patientForm.conditions.split(',').map((c) => c.trim())
        : [];
      const res = await client.post('/doctor/patients', {
        ...patientForm,
        conditions: conditionsArray,
      });
      setPatients([...patients, res.data.patient]);
      setPatientForm({
        name: '',
        age: '',
        gender: '',
        contact: '',
        conditions: '',
      });
      alert('Patient added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add patient');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePrescription = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const medicines = prescriptionForm.medicines
        .filter((m) => m.name && m.dosage)
        .map((m) => ({
          name: m.name,
          dosage: m.dosage,
          time: m.time ? m.time.split(',').map((t) => t.trim()) : [],
          durationInDays: m.durationInDays ? parseInt(m.durationInDays) : undefined,
          instructions: m.instructions || '',
        }));

      await client.post('/prescription/create', {
        patientId: prescriptionForm.patientId,
        medicines,
        diagnosis: prescriptionForm.diagnosis,
        notes: prescriptionForm.notes,
      });
      setPrescriptionForm({
        patientId: '',
        medicines: [{ name: '', dosage: '', time: '', durationInDays: '', instructions: '' }],
        diagnosis: '',
        notes: '',
      });
      alert('Prescription created successfully!');
      fetchPrescriptions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  const addMedicineField = () => {
    setPrescriptionForm({
      ...prescriptionForm,
      medicines: [
        ...prescriptionForm.medicines,
        { name: '', dosage: '', time: '', durationInDays: '', instructions: '' },
      ],
    });
  };

  const updateMedicineField = (index, field, value) => {
    const updatedMedicines = [...prescriptionForm.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionForm({ ...prescriptionForm, medicines: updatedMedicines });
  };

  return (
    <ProtectedRoute requiredType="doctor">
      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Doctor Dashboard</h1>

          <div className="flex space-x-2 mb-6 border-b border-gray-700">
            {['profile', 'patients', 'prescriptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-900 text-red-200 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && user && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{user.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white ml-2">{user.email}</span>
                </div>
                {user.specialization && (
                  <div>
                    <span className="text-gray-400">Specialization:</span>
                    <span className="text-white ml-2">{user.specialization}</span>
                  </div>
                )}
                {user.experience && (
                  <div>
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white ml-2">{user.experience} years</span>
                  </div>
                )}
                {user.hospitalName && (
                  <div>
                    <span className="text-gray-400">Hospital:</span>
                    <span className="text-white ml-2">{user.hospitalName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Patients Tab */}
          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Add Patient</h2>
                <form onSubmit={handleAddPatient} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={patientForm.name}
                        onChange={(e) =>
                          setPatientForm({ ...patientForm, name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Age
                      </label>
                      <input
                        type="number"
                        value={patientForm.age}
                        onChange={(e) =>
                          setPatientForm({ ...patientForm, age: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Gender
                      </label>
                      <select
                        value={patientForm.gender}
                        onChange={(e) =>
                          setPatientForm({ ...patientForm, gender: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Contact
                      </label>
                      <input
                        type="text"
                        value={patientForm.contact}
                        onChange={(e) =>
                          setPatientForm({ ...patientForm, contact: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Conditions (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={patientForm.conditions}
                      onChange={(e) =>
                        setPatientForm({ ...patientForm, conditions: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Add Patient
                  </button>
                </form>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">My Patients</h2>
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : patients.length === 0 ? (
                  <div className="text-gray-400">No patients added yet</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-gray-300 py-2">Name</th>
                          <th className="text-gray-300 py-2">Age</th>
                          <th className="text-gray-300 py-2">Gender</th>
                          <th className="text-gray-300 py-2">Contact</th>
                          <th className="text-gray-300 py-2">Conditions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient._id} className="border-b border-gray-700">
                            <td className="text-white py-2">{patient.name}</td>
                            <td className="text-gray-300 py-2">{patient.age || '-'}</td>
                            <td className="text-gray-300 py-2">{patient.gender || '-'}</td>
                            <td className="text-gray-300 py-2">{patient.contact || '-'}</td>
                            <td className="text-gray-300 py-2">
                              {patient.conditions?.join(', ') || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prescriptions Tab */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Create Prescription</h2>
                <form onSubmit={handleCreatePrescription} className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Patient ID *
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.patientId}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          patientId: e.target.value,
                        })
                      }
                      required
                      placeholder="Enter Patient MongoDB _id"
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      value={prescriptionForm.diagnosis}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          diagnosis: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Notes
                    </label>
                    <textarea
                      value={prescriptionForm.notes}
                      onChange={(e) =>
                        setPrescriptionForm({
                          ...prescriptionForm,
                          notes: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                      rows="3"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-gray-300 text-sm font-medium">
                        Medicines *
                      </label>
                      <button
                        type="button"
                        onClick={addMedicineField}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        + Add Medicine
                      </button>
                    </div>
                    {prescriptionForm.medicines.map((medicine, index) => (
                      <div
                        key={index}
                        className="bg-gray-700 p-4 rounded-lg mb-4 space-y-2"
                      >
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Medicine name *"
                            value={medicine.name}
                            onChange={(e) =>
                              updateMedicineField(index, 'name', e.target.value)
                            }
                            required
                            className="px-3 py-2 bg-gray-600 text-white rounded"
                          />
                          <input
                            type="text"
                            placeholder="Dosage *"
                            value={medicine.dosage}
                            onChange={(e) =>
                              updateMedicineField(index, 'dosage', e.target.value)
                            }
                            required
                            className="px-3 py-2 bg-gray-600 text-white rounded"
                          />
                          <input
                            type="text"
                            placeholder="Time (comma-separated, e.g., 09:00, 15:00)"
                            value={medicine.time}
                            onChange={(e) =>
                              updateMedicineField(index, 'time', e.target.value)
                            }
                            className="px-3 py-2 bg-gray-600 text-white rounded"
                          />
                          <input
                            type="number"
                            placeholder="Duration (days)"
                            value={medicine.durationInDays}
                            onChange={(e) =>
                              updateMedicineField(index, 'durationInDays', e.target.value)
                            }
                            className="px-3 py-2 bg-gray-600 text-white rounded"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Instructions"
                          value={medicine.instructions}
                          onChange={(e) =>
                            updateMedicineField(index, 'instructions', e.target.value)
                          }
                          className="w-full px-3 py-2 bg-gray-600 text-white rounded"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                  >
                    Create Prescription
                  </button>
                </form>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">My Prescriptions</h2>
                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : prescriptions.length === 0 ? (
                  <div className="text-gray-400">No prescriptions created yet</div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription._id}
                        className="bg-gray-700 p-4 rounded-lg border border-gray-600"
                      >
                        <div className="flex justify-between mb-2">
                          <div>
                            <span className="text-gray-400">Patient:</span>
                            <span className="text-white ml-2">
                              {prescription.patient?.name || 'N/A'}
                            </span>
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        {prescription.diagnosis && (
                          <div className="mb-2">
                            <span className="text-gray-400">Diagnosis:</span>
                            <span className="text-white ml-2">{prescription.diagnosis}</span>
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="text-gray-400">Medicines:</span>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            {prescription.medicines?.map((med, idx) => (
                              <li key={idx} className="text-white text-sm">
                                {med.name} - {med.dosage}
                                {med.time?.length > 0 && ` (${med.time.join(', ')})`}
                                {med.durationInDays && ` - ${med.durationInDays} days`}
                                {med.instructions && ` - ${med.instructions}`}
                              </li>
                            ))}
                          </ul>
                        </div>
                        {prescription.notes && (
                          <div>
                            <span className="text-gray-400">Notes:</span>
                            <span className="text-white ml-2">{prescription.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default DoctorDashboard;

