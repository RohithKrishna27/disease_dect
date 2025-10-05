import React, { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setError('Failed to sign in with Google. Please try again.');
      console.error('Error signing in with Google:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-400 to-blue-400 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Medical Icons */}
        <div className="absolute top-20 left-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <div className="w-8 h-10 bg-red-500 rounded-lg shadow-lg transform rotate-12 flex items-center justify-center text-white text-xl">
            +
          </div>
        </div>
        <div className="absolute top-32 right-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
          <div className="w-6 h-8 bg-teal-500 rounded-lg shadow-lg transform -rotate-12 flex items-center justify-center text-white">
            ❤️
          </div>
        </div>
        <div className="absolute bottom-40 left-20 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
          <div className="w-7 h-9 bg-blue-500 rounded-lg shadow-lg transform rotate-6 flex items-center justify-center text-white">
            🩺
          </div>
        </div>
        
        {/* Floating Medical Symbols */}
        <div className="absolute top-40 right-40 text-white text-2xl animate-pulse" style={{animationDelay: '0.5s'}}>
          ⚕️
        </div>
        <div className="absolute bottom-60 right-10 text-white text-xl animate-pulse" style={{animationDelay: '1.5s'}}>
          💊
        </div>
        <div className="absolute top-60 left-40 text-white text-lg animate-pulse" style={{animationDelay: '2.5s'}}>
          🏥
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-16 right-16 w-12 h-12 border-4 border-white border-opacity-30 rounded-full animate-spin" style={{animationDuration: '8s'}}></div>
        <div className="absolute bottom-20 left-32 w-8 h-8 bg-red-300 bg-opacity-40 transform rotate-45 animate-pulse"></div>
      </div>

      {/* Main Login Card */}
      <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 transform hover:scale-105 transition-all duration-300">
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd"/>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">
            HealthHub
          </h1>
          <p className="text-gray-600 text-lg">Your Complete Healthcare Platform</p>
          <div className="flex justify-center space-x-2 mt-3">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg animate-shake">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white py-4 px-6 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-50 transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="font-semibold">Connecting...</span>
            </div>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-semibold text-lg">Continue with Google</span>
            </>
          )}
        </button>

        {/* Healthcare Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-teal-50 rounded-xl">
            <div className="text-2xl font-bold text-teal-600">50K+</div>
            <div className="text-xs text-teal-500">Patients</div>
          </div>
          <div className="p-3 bg-cyan-50 rounded-xl">
            <div className="text-2xl font-bold text-cyan-600">1K+</div>
            <div className="text-xs text-cyan-500">Doctors</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">24/7</div>
            <div className="text-xs text-blue-500">Support</div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            🏥 Trusted healthcare platform for everyone
          </p>
          <p className="text-xs text-gray-400 mt-2">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>

      {/* Floating Action Elements */}
      <div className="absolute bottom-10 right-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-4 text-white animate-pulse">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
        </svg>
      </div>
    </div>
  );
};

export default LoginScreen;