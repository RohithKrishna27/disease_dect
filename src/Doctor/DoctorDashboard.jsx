import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const todayAppointments = [
    {
      patient: 'John Smith',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'Confirmed'
    },
    {
      patient: 'Emma Johnson',
      time: '11:30 AM',
      type: 'New Patient',
      status: 'Confirmed'
    },
    {
      patient: 'Michael Brown',
      time: '2:00 PM',
      type: 'Consultation',
      status: 'Pending'
    }
  ];

  const quickActions = [
    {
      title: 'Patient Management',
      description: 'View and manage patient records',
      icon: '👥',
      color: 'from-teal-400 to-cyan-400',
      route: '/patient-management'
    },
    {
      title: 'Schedule',
      description: 'Manage your appointments',
      icon: '📅',
      color: 'from-blue-400 to-indigo-400',
      route: '/schedule'
    },
    {
      title: 'Prescriptions',
      description: 'Create and manage prescriptions',
      icon: '💊',
      color: 'from-purple-400 to-pink-400',
      route: '/prescriptions'
    },
    {
      title: 'Lab Reports',
      description: 'Review patient lab results',
      icon: '🔬',
      color: 'from-green-400 to-teal-400',
      route: '/lab-reports'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚕️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">HealthHub</h1>
                <p className="text-sm text-gray-500">Doctor Portal</p>
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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Good morning, Dr. {userProfile?.fullName?.split(' ').pop()}!</h2>
          <p className="text-teal-100">You have {todayAppointments.length} appointments scheduled for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">👥</span>
              <span className="text-xs text-gray-500">Total</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">142</h3>
            <p className="text-sm text-gray-600">Active Patients</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📅</span>
              <span className="text-xs text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{todayAppointments.length}</h3>
            <p className="text-sm text-gray-600">Appointments</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💊</span>
              <span className="text-xs text-gray-500">This Week</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">28</h3>
            <p className="text-sm text-gray-600">Prescriptions</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">🔬</span>
              <span className="text-xs text-gray-500">Pending</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">7</h3>
            <p className="text-sm text-gray-600">Lab Reports</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Today's Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Today's Appointments</h3>
              <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {todayAppointments.map((appointment, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-teal-400 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-lg">👤</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{appointment.patient}</h4>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-800">{appointment.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        appointment.status === 'Confirmed' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={index}
                  onClick={() => navigate(action.route)}
                  className={`bg-gradient-to-r ${action.color} p-4 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{action.icon}</div>
                    <h4 className="text-white font-semibold text-sm mb-1">{action.title}</h4>
                    <p className="text-white text-opacity-90 text-xs">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Patients */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Patient Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Appointment Completed - John Smith</p>
                <p className="text-xs text-gray-500">Follow-up consultation - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">💊</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Prescription Issued - Emma Johnson</p>
                <p className="text-xs text-gray-500">Antibiotic course - 3 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">🔬</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Lab Report Reviewed - Michael Brown</p>
                <p className="text-xs text-gray-500">Blood test results - 5 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;