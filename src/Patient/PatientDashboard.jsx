import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

const PatientDashboard = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [medications, setMedications] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedUID, setCopiedUID] = useState(false);

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const fetchPatientData = async () => {
    if (!user) return;
    
    try {
      // Fetch appointments
      const appointmentsRef = collection(db, 'appointments');
      const appointmentsQuery = query(
        appointmentsRef,
        where('patientId', '==', user.uid),
        orderBy('date', 'desc'),
        limit(5)
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      setAppointments(appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch medications
      const medicationsRef = collection(db, 'medications');
      const medicationsQuery = query(
        medicationsRef,
        where('patientId', '==', user.uid),
        where('status', '==', 'active')
      );
      const medicationsSnapshot = await getDocs(medicationsQuery);
      setMedications(medicationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Fetch reports
      const reportsRef = collection(db, 'reports');
      const reportsQuery = query(
        reportsRef,
        where('patientId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const reportsSnapshot = await getDocs(reportsQuery);
      setReports(reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyUID = () => {
    navigator.clipboard.writeText(user.uid);
    setCopiedUID(true);
    setTimeout(() => setCopiedUID(false), 2000);
  };

  const healthTools = [
    {
      title: 'Disease Risk Analysis',
      description: 'AI-powered health risk assessment',
      icon: '🔬',
      color: 'from-red-400 to-pink-400',
      route: '/disease-analysis'
    },
    {
      title: 'Medical Reports',
      description: 'View and manage your reports',
      icon: '📋',
      color: 'from-blue-400 to-cyan-400',
      route: '/medical-reports'
    },
    {
      title: 'Medicine Tracker',
      description: 'Track your medications',
      icon: '💊',
      color: 'from-purple-400 to-indigo-400',
      route: '/medicine-tracker'
    },
    {
      title: 'Health Monitoring',
      description: 'Track vital signs',
      icon: '❤️',
      color: 'from-green-400 to-teal-400',
      route: '/health-monitoring'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏥</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HealthHub</h1>
                <p className="text-sm text-gray-500">Patient Portal</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section with UID */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userProfile?.fullName}!</h2>
          <p className="text-teal-100 mb-4">Here's your health overview for today</p>
          <div className="flex items-center space-x-2 bg-white bg-opacity-20 rounded-lg px-4 py-2 w-fit">
            <span className="text-sm font-mono">Patient ID: {user.uid.slice(0, 8)}...</span>
            <button
              onClick={copyUID}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition"
              title="Copy full UID"
            >
              {copiedUID ? (
                <span className="text-green-300">✓</span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📅</span>
              <span className="text-xs text-gray-500">Upcoming</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{appointments.length}</h3>
            <p className="text-sm text-gray-600">Appointments</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💊</span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{medications.length}</h3>
            <p className="text-sm text-gray-600">Medications</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-gray-500">Recent</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{reports.length}</h3>
            <p className="text-sm text-gray-600">Lab Reports</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">❤️</span>
              <span className="text-xs text-gray-500">Status</span>
            </div>
            <h3 className="text-2xl font-bold text-green-600">Good</h3>
            <p className="text-sm text-gray-600">Health Status</p>
          </div>
        </div>

        {/* Health Tools Grid */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Health Management Tools</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthTools.map((tool, index) => (
              <div
                key={index}
                onClick={() => navigate(tool.route)}
                className={`bg-gradient-to-r ${tool.color} p-6 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
              >
                <div className="text-center">
                  <div className="text-5xl mb-3">{tool.icon}</div>
                  <h4 className="text-white font-bold text-lg mb-2">{tool.title}</h4>
                  <p className="text-white text-opacity-90 text-sm">{tool.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Upcoming Appointments</h3>
              <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">
                View All
              </button>
            </div>
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-xl p-4 hover:border-teal-400 transition">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">👨‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600">{appointment.specialization}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>📅 {appointment.date}</span>
                          <span>🕐 {appointment.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No upcoming appointments</p>
                <button className="mt-4 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition">
                  Book Appointment
                </button>
              </div>
            )}
          </div>

          {/* Active Medications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Active Medications</h3>
              <button 
                onClick={() => navigate('/medicine-tracker')}
                className="text-teal-600 text-sm font-semibold hover:text-teal-700"
              >
                View All
              </button>
            </div>
            {medications.length > 0 ? (
              <div className="space-y-3">
                {medications.slice(0, 3).map((med) => (
                  <div key={med.id} className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                    <span className="text-2xl">💊</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage} - {med.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No active medications</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          {reports.length > 0 ? (
            <div className="space-y-3">
              {reports.slice(0, 3).map((report) => (
                <div key={report.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">📋</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{report.type} Report Available</p>
                    <p className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => navigate('/medical-reports')}
                    className="text-teal-600 text-sm font-semibold hover:text-teal-700"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;