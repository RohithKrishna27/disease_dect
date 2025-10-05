import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const RoleSelection = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const { setUserRole } = useAuth();

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setIsAnimating(true);
    
    setTimeout(() => {
      setUserRole(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Medical Elements */}
        <div className="absolute top-20 left-16 animate-bounce" style={{animationDelay: '0s', animationDuration: '4s'}}>
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🏥</span>
          </div>
        </div>
        <div className="absolute top-40 right-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3s'}}>
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">💊</span>
          </div>
        </div>
        <div className="absolute bottom-32 left-24 animate-bounce" style={{animationDelay: '1s', animationDuration: '3.5s'}}>
          <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🩺</span>
          </div>
        </div>
        <div className="absolute bottom-20 right-32 animate-bounce" style={{animationDelay: '3s', animationDuration: '4s'}}>
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-white">❤️</span>
          </div>
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-32 left-1/3 w-16 h-16 border-4 border-white border-opacity-20 rounded-full animate-spin" style={{animationDuration: '12s'}}></div>
        <div className="absolute bottom-40 right-1/4 w-12 h-12 bg-red-300 bg-opacity-20 transform rotate-45 animate-pulse"></div>
        
        {/* Medical Symbols */}
        <div className="absolute top-60 left-32 text-white text-3xl animate-pulse opacity-30" style={{animationDelay: '1s'}}>
          ⚕️
        </div>
        <div className="absolute bottom-60 right-16 text-white text-2xl animate-pulse opacity-30" style={{animationDelay: '2s'}}>
          +
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 w-full max-w-4xl relative z-10 transform hover:scale-[1.02] transition-all duration-500">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Choose Your Role
          </h1>
          <p className="text-gray-600 text-xl">Join our healthcare platform and start your journey</p>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            <div className="w-3 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
            <div className="w-8 h-3 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Patient Card */}
          <div
            onClick={() => handleRoleSelection('patient')}
            className={`group relative p-8 rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
              selectedRole === 'patient'
                ? 'bg-gradient-to-br from-blue-400 to-indigo-400 text-white scale-105 shadow-2xl'
                : 'bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-400'
            }`}
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 rounded-3xl opacity-10">
              <div className="absolute top-4 right-4 text-6xl">🩺</div>
              <div className="absolute bottom-4 left-4 text-4xl">💊</div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                selectedRole === 'patient'
                  ? 'bg-white bg-opacity-20 scale-110'
                  : 'bg-blue-500 group-hover:bg-blue-600'
              }`}>
                <svg className={`w-10 h-10 transition-colors duration-300 ${
                  selectedRole === 'patient' ? 'text-white' : 'text-white'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                selectedRole === 'patient' ? 'text-white' : 'text-gray-800'
              }`}>
                🏥 Patient
              </h3>
              <p className={`text-lg leading-relaxed ${
                selectedRole === 'patient' ? 'text-white text-opacity-90' : 'text-gray-600'
              }`}>
                Access your health records, book appointments, consult with healthcare professionals, and track your wellness journey.
              </p>
              
              {/* Patient Features */}
              <div className="mt-6 space-y-2">
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  selectedRole === 'patient' ? 'text-white text-opacity-80' : 'text-blue-600'
                }`}>
                  <span>📅</span>
                  <span>Book Appointments</span>
                </div>
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  selectedRole === 'patient' ? 'text-white text-opacity-80' : 'text-blue-600'
                }`}>
                  <span>📊</span>
                  <span>Health Tracking</span>
                </div>
              </div>
            </div>
            
            {selectedRole === 'patient' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-lg">✓</span>
              </div>
            )}
          </div>

          {/* Doctor Card */}
          <div
            onClick={() => handleRoleSelection('doctor')}
            className={`group relative p-8 rounded-3xl cursor-pointer transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl ${
              selectedRole === 'doctor'
                ? 'bg-gradient-to-br from-teal-400 to-cyan-400 text-white scale-105 shadow-2xl'
                : 'bg-gradient-to-br from-teal-50 to-cyan-50 hover:from-teal-100 hover:to-cyan-100 border-2 border-teal-200 hover:border-teal-400'
            }`}
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 rounded-3xl opacity-10">
              <div className="absolute top-4 right-4 text-6xl">⚕️</div>
              <div className="absolute bottom-4 left-4 text-4xl">🔬</div>
            </div>
            
            <div className="relative z-10 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ${
                selectedRole === 'doctor'
                  ? 'bg-white bg-opacity-20 scale-110'
                  : 'bg-teal-500 group-hover:bg-teal-600'
              }`}>
                <svg className={`w-10 h-10 transition-colors duration-300 ${
                  selectedRole === 'doctor' ? 'text-white' : 'text-white'
                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${
                selectedRole === 'doctor' ? 'text-white' : 'text-gray-800'
              }`}>
                👨‍⚕️ Doctor
              </h3>
              <p className={`text-lg leading-relaxed ${
                selectedRole === 'doctor' ? 'text-white text-opacity-90' : 'text-gray-600'
              }`}>
                Manage patient records, conduct consultations, track treatments, and provide quality healthcare services.
              </p>
              
              {/* Doctor Features */}
              <div className="mt-6 space-y-2">
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  selectedRole === 'doctor' ? 'text-white text-opacity-80' : 'text-teal-600'
                }`}>
                  <span>👥</span>
                  <span>Patient Management</span>
                </div>
                <div className={`flex items-center justify-center space-x-2 text-sm ${
                  selectedRole === 'doctor' ? 'text-white text-opacity-80' : 'text-teal-600'
                }`}>
                  <span>📈</span>
                  <span>Analytics Dashboard</span>
                </div>
              </div>
            </div>
            
            {selectedRole === 'doctor' && (
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-white text-lg">✓</span>
              </div>
            )}
          </div>
        </div>

        {/* Selection Confirmation */}
        {selectedRole && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-teal-100 to-blue-100 px-8 py-4 rounded-2xl border border-teal-200">
              <div className="w-6 h-6 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <p className="text-gray-700 font-medium">
                Great! You're joining as a <span className="font-bold text-teal-600 capitalize">{selectedRole}</span>
              </p>
            </div>
            
            {isAnimating && (
              <div className="mt-6 flex items-center justify-center space-x-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-teal-600 font-medium">Setting up your healthcare profile...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Help Button */}
      <div className="absolute bottom-8 right-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 text-white hover:bg-opacity-30 transition-all duration-300 cursor-pointer group">
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
};

export default RoleSelection;