import React from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const PatientDashboard = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const healthTools = [
    {
      title: 'Blood Pressure Monitor',
      description: 'Track your blood pressure readings',
      icon: '💗',
      color: 'from-red-400 to-pink-400',
      route: '/blood-pressure-monitor'
    },
    {
      title: 'ECG Simulator',
      description: 'Monitor your heart rhythm',
      icon: '❤️',
      color: 'from-pink-400 to-rose-400',
      route: '/ecg-simulator'
    },
    {
      title: 'Glucose Monitor',
      description: 'Keep track of your blood sugar levels',
      icon: '🩸',
      color: 'from-blue-400 to-cyan-400',
      route: '/glucose-monitor'
    }
  ];

  const upcomingAppointments = [
    {
      doctor: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      date: 'Oct 10, 2025',
      time: '10:00 AM'
    },
    {
      doctor: 'Dr. Michael Chen',
      specialization: 'General Physician',
      date: 'Oct 15, 2025',
      time: '2:30 PM'
    }
  ];

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
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-teal-500 to-blue-500 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {userProfile?.fullName}!</h2>
          <p className="text-teal-100">Here's your health overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📅</span>
              <span className="text-xs text-gray-500">This Month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">2</h3>
            <p className="text-sm text-gray-600">Appointments</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">💊</span>
              <span className="text-xs text-gray-500">Active</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">3</h3>
            <p className="text-sm text-gray-600">Medications</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">📋</span>
              <span className="text-xs text-gray-500">Recent</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">5</h3>
            <p className="text-sm text-gray-600">Lab Reports</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">❤️</span>
              <span className="text-xs text-gray-500">Today</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Normal</h3>
            <p className="text-sm text-gray-600">Health Status</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Health Monitoring Tools */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Health Monitoring Tools</h3>
            <div className="space-y-4">
              {healthTools.map((tool, index) => (
                <div
                  key={index}
                  onClick={() => navigate(tool.route)}
                  className={`bg-gradient-to-r ${tool.color} p-4 rounded-xl cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{tool.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg">{tool.title}</h4>
                      <p className="text-white text-opacity-90 text-sm">{tool.description}</p>
                    </div>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Upcoming Appointments</h3>
              <button className="text-teal-600 text-sm font-semibold hover:text-teal-700">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-4 hover:border-teal-400 transition">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">👨‍⚕️</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{appointment.doctor}</h4>
                      <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          📅 {appointment.date}
                        </span>
                        <span className="flex items-center">
                          🕐 {appointment.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-4 py-3 border-2 border-teal-500 text-teal-600 rounded-xl font-semibold hover:bg-teal-50 transition">
              Book New Appointment
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">📋</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Lab Report Available</p>
                <p className="text-xs text-gray-500">Blood test results - 2 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">💊</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Prescription Updated</p>
                <p className="text-xs text-gray-500">New medication added - 5 days ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">✅</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Appointment Completed</p>
                <p className="text-xs text-gray-500">Dr. Sarah Johnson - 1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;