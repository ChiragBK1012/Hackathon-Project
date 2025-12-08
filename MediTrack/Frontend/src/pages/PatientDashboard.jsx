import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import client from '../api/client';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await client.get('/prescription/patient/all');
      setPrescriptions(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch prescriptions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute requiredType="patient">
      <Layout>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">Patient Dashboard</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Profile</h2>
                {user && (
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white ml-2">{user.email}</span>
                    </div>
                    {user.age && (
                      <div>
                        <span className="text-gray-400">Age:</span>
                        <span className="text-white ml-2">{user.age}</span>
                      </div>
                    )}
                    {user.gender && (
                      <div>
                        <span className="text-gray-400">Gender:</span>
                        <span className="text-white ml-2">{user.gender}</span>
                      </div>
                    )}
                    {user.contact && (
                      <div>
                        <span className="text-gray-400">Contact:</span>
                        <span className="text-white ml-2">{user.contact}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Prescriptions Section */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">My Prescriptions</h2>

                {error && (
                  <div className="bg-red-900 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}

                {loading ? (
                  <div className="text-gray-400">Loading...</div>
                ) : prescriptions.length === 0 ? (
                  <div className="text-gray-400">No prescriptions found</div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription._id}
                        className="bg-gray-700 p-6 rounded-lg border border-gray-600"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-white font-semibold text-lg">
                              Dr. {prescription.doctor?.name || 'Unknown Doctor'}
                            </div>
                            {prescription.doctor?.specialization && (
                              <div className="text-gray-400 text-sm">
                                {prescription.doctor.specialization}
                              </div>
                            )}
                          </div>
                          <div className="text-gray-400 text-sm">
                            {new Date(prescription.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        {prescription.diagnosis && (
                          <div className="mb-4">
                            <span className="text-gray-400 font-medium">Diagnosis:</span>
                            <span className="text-white ml-2">{prescription.diagnosis}</span>
                          </div>
                        )}

                        <div className="mb-4">
                          <span className="text-gray-400 font-medium block mb-2">
                            Medicines:
                          </span>
                          <div className="space-y-3">
                            {prescription.medicines?.map((med, idx) => (
                              <div
                                key={idx}
                                className="bg-gray-600 p-3 rounded border-l-4 border-green-500"
                              >
                                <div className="text-white font-medium">{med.name}</div>
                                <div className="text-gray-300 text-sm mt-1 space-y-1">
                                  <div>
                                    <span className="text-gray-400">Dosage:</span>{' '}
                                    <span className="text-white">{med.dosage}</span>
                                  </div>
                                  {med.time && med.time.length > 0 && (
                                    <div>
                                      <span className="text-gray-400">Timings:</span>{' '}
                                      <span className="text-white">
                                        {med.time.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                  {med.durationInDays && (
                                    <div>
                                      <span className="text-gray-400">Duration:</span>{' '}
                                      <span className="text-white">
                                        {med.durationInDays} days
                                      </span>
                                    </div>
                                  )}
                                  {med.instructions && (
                                    <div>
                                      <span className="text-gray-400">Instructions:</span>{' '}
                                      <span className="text-white">{med.instructions}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {prescription.notes && (
                          <div className="pt-4 border-t border-gray-600">
                            <span className="text-gray-400 font-medium">Notes:</span>
                            <p className="text-white mt-1">{prescription.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default PatientDashboard;

