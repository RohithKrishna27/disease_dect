import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginScreen from './LoginScreen';
import RoleSelection from './RoleSelection';
import { AuthProvider, useAuth } from './AuthContext';
import PatientProfile from './Patient/PatientProfile';
import DoctorProfile from './Doctor/DoctorProfile';
import PatientDashboard from './Patient/PatientDashboard';
import DoctorDashboard from './Doctor/DoctorDashboard';
import PatientManagement from './Doctor/PatientManagement';
import DiseaseAnalysis from './Patient/DiseaseAnalysis';

// Import your medical lab/diagnostic components
// import BloodPressureMonitor from './Patient/blood-pressure-monitor';
// import ECGSimulator from './Patient/ecg-simulator';
// import GlucoseMonitor from './Patient/glucose-monitor';

// Debug component
const DebugAuthState = () => {
  const { user, userRole, userProfile, loading } = useAuth();

  console.log('Debug Auth State:', {
    user: !!user,
    userRole,
    userProfile: !!userProfile,
    loading
  });
  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children, requiresAuth = true, requiresRole = null, requiresProfile = true }) => {
  const { user, userRole, userProfile, loading } = useAuth();

  console.log('ProtectedRoute check:', {
    user: !!user,
    userRole,
    userProfile: !!userProfile,
    loading,
    requiresAuth,
    requiresRole,
    requiresProfile
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 1. Check authentication
  if (requiresAuth && !user) {
    console.log('ProtectedRoute: Redirecting to login - user not authenticated.');
    return <Navigate to="/login" replace />;
  }

  // 2. Check role existence
  if ((requiresRole === true || typeof requiresRole === 'string') && !userRole) {
    console.log('ProtectedRoute: Redirecting to role selection - role required but not set.');
    return <Navigate to="/role-selection" replace />;
  }

  // 3. Check specific role match
  if (typeof requiresRole === 'string' && userRole !== requiresRole) {
    console.log(`ProtectedRoute: Redirecting to dashboard - required role "${requiresRole}" does not match user's role "${userRole}".`);
    return <Navigate to="/dashboard" replace />;
  }

  // 4. Check profile completion
  if (requiresProfile && userRole && !userProfile) {
    console.log('ProtectedRoute: Redirecting to profile setup - profile required but not complete.');
    if (userRole === 'patient') {
      return <Navigate to="/patient-profile" replace />;
    } else if (userRole === 'doctor') {
      return <Navigate to="/doctor-profile" replace />;
    }
  }

  console.log('ProtectedRoute: All checks passed. Rendering children.');
  return children;
};

// AppContent handles all routes
const AppContent = () => {
  const { user, userRole, userProfile, loading } = useAuth();

  console.log('AppContent render:', { user: !!user, userRole, userProfile: !!userProfile, loading });

  return (
    <>
      <DebugAuthState />

      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !user ? <LoginScreen /> : <Navigate to="/dashboard" replace />
          }
        />

        {/* Role Selection Route */}
        <Route
          path="/role-selection"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole={false} requiresProfile={false}>
              {!userRole ? (
                <RoleSelection />
              ) : !userProfile ? (
                userRole === 'patient' ? (
                  <Navigate to="/patient-profile" replace />
                ) : (
                  <Navigate to="/doctor-profile" replace />
                )
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Profile Setup Routes */}
        <Route
          path="/patient-profile"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={false}>
              {userRole === 'patient' && !userProfile ? (
                <PatientProfile />
              ) : (
                userProfile ? <Navigate to="/patient-dashboard" replace /> : <Navigate to="/role-selection" replace />
              )}
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-profile"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="doctor" requiresProfile={false}>
              {userRole === 'doctor' && !userProfile ? (
                <DoctorProfile />
              ) : (
                userProfile ? <Navigate to="/doctor-dashboard" replace /> : <Navigate to="/role-selection" replace />
              )}
            </ProtectedRoute>
          }
        />

        {/* Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole={true} requiresProfile={true}>
              {userRole === 'patient' ? (
                <PatientDashboard />
              ) : userRole === 'doctor' ? (
                <DoctorDashboard />
              ) : (
                <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
                  <div className="text-center text-gray-800">
                    <h2 className="text-xl mb-4">Invalid Role or Role Not Set</h2>
                    <p>Current Role: {userRole || 'N/A'}</p>
                    <button
                      onClick={() => window.location.href = '/role-selection'}
                      className="mt-4 px-4 py-2 bg-teal-600 text-white rounded"
                    >
                      Select Role Again
                    </button>
                  </div>
                </div>
              )}
            </ProtectedRoute>
          }
        />

        {/* Specific Dashboard Routes */}
        <Route
          path="/patient-dashboard"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={true}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="doctor" requiresProfile={true}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Specific Routes */}
        <Route
          path="/patient-management"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="doctor" requiresProfile={true}>
              <PatientManagement />
            </ProtectedRoute>
          }
        />
  
        <Route
          path="/disease-analysis"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={true}>
              <DiseaseAnalysis />
            </ProtectedRoute>
          }
        />

        {/* Patient Medical Monitoring Routes */}
        {/* <Route
          path="/blood-pressure-monitor"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={true}>
              <BloodPressureMonitor />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/ecg-simulator"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={true}>
              <ECGSimulator />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/glucose-monitor"
          element={
            <ProtectedRoute requiresAuth={true} requiresRole="patient" requiresProfile={true}>
              <GlucoseMonitor />
            </ProtectedRoute>
          }
        /> */}

        {/* Default Route */}
        <Route
          path="/"
          element={
            loading ? (
              <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading...</p>
                </div>
              </div>
            ) : !user ? (
              <Navigate to="/login" replace />
            ) : !userRole ? (
              <Navigate to="/role-selection" replace />
            ) : !userProfile ? (
              userRole === 'patient' ? (
                <Navigate to="/patient-profile" replace />
              ) : (
                <Navigate to="/doctor-profile" replace />
              )
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
              <div className="text-center text-gray-800">
                <h2 className="text-xl mb-4">Page Not Found</h2>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
                >
                  Go Home
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </>
  );
};

// Main App component
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;