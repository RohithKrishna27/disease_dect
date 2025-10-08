import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DiseaseAnalysis = () => {
  const { user, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    bmi: '',
    smokingStatus: 'Never',
    drinkingStatus: 'Never',
    medicalHistory: '',
    ecg: '',
    eeg: '',
    spo2: '',
    hrv: '',
    gaitSpeed: '',
    rrv: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: '',
    cholesterol: '',
    bloodSugar: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const analyzeWithGemini = async (patientData) => {
    try {
      const API_KEY = 'AIzaSyCFqQwXMbpFW7fNmgsfFVzXR6PVNeUyk1Y'; // Replace with your API key
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `As a medical AI assistant, analyze the following patient data and provide a comprehensive health risk assessment. Provide the response in a structured format with risk scores (0-1 scale), key findings, and recommendations.

Patient Data:
- Age: ${patientData.age}
- Gender: ${patientData.gender}
- BMI: ${patientData.bmi}
- Smoking Status: ${patientData.smokingStatus}
- Drinking Status: ${patientData.drinkingStatus}
- Medical History: ${patientData.medicalHistory}
- ECG: ${patientData.ecg}
- EEG: ${patientData.eeg}
- SpO2: ${patientData.spo2}%
- HRV: ${patientData.hrv}
- Gait Speed: ${patientData.gaitSpeed} m/s
- RRV: ${patientData.rrv}
- Blood Pressure: ${patientData.bloodPressureSystolic}/${patientData.bloodPressureDiastolic} mmHg
- Heart Rate: ${patientData.heartRate} bpm
- Cholesterol: ${patientData.cholesterol} mg/dL
- Blood Sugar: ${patientData.bloodSugar} mg/dL

Please provide:
1. Overall Health Risk Score (0-1)
2. Cardiovascular Risk Assessment
3. Respiratory Health Assessment
4. Neurological Health Assessment
5. Metabolic Health Assessment
6. Key Risk Factors Identified
7. Recommended Actions
8. Lifestyle Modifications Needed

Format the response clearly without using asterisks or markdown formatting.`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Analyze with Gemini AI
      const geminiAnalysis = await analyzeWithGemini(formData);

      // Parse the analysis result
      const analysisData = {
        patientId: user.uid,
        patientName: userProfile?.fullName,
        analysisDate: new Date().toISOString(),
        inputData: formData,
        aiAnalysis: geminiAnalysis,
        createdAt: serverTimestamp()
      };

      // Save to Firebase
      const docRef = await addDoc(collection(db, 'diseaseAnalysis'), analysisData);
      
      setAnalysisResult({
        id: docRef.id,
        ...analysisData,
        analysis: geminiAnalysis
      });

    } catch (error) {
      console.error('Error during analysis:', error);
      alert('Failed to analyze. Please check your API key and try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskBgColor = (score) => {
    if (score < 0.3) return 'bg-green-100';
    if (score < 0.6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/patient-dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Disease Risk Analysis</h1>
                <p className="text-sm text-gray-500">AI-powered health assessment</p>
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
        {!analysisResult ? (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔬</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Health Risk Assessment</h2>
              <p className="text-gray-600">Enter your health metrics for AI-powered analysis</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="45"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BMI</label>
                    <input
                      type="number"
                      step="0.1"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="21.8"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle Factors */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lifestyle Factors</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Smoking Status</label>
                    <select
                      name="smokingStatus"
                      value={formData.smokingStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="Never">Never</option>
                      <option value="Former">Former</option>
                      <option value="Current">Current</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Drinking Status</label>
                    <select
                      name="drinkingStatus"
                      value={formData.drinkingStatus}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="Never">Never</option>
                      <option value="Occasional">Occasional</option>
                      <option value="Regular">Regular</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Vital Signs</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="spo2"
                      value={formData.spo2}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="93.2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Heart Rate (bpm)</label>
                    <input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="72"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Sugar (mg/dL)</label>
                    <input
                      type="number"
                      name="bloodSugar"
                      value={formData.bloodSugar}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BP Systolic (mmHg)</label>
                    <input
                      type="number"
                      name="bloodPressureSystolic"
                      value={formData.bloodPressureSystolic}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="120"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">BP Diastolic (mmHg)</label>
                    <input
                      type="number"
                      name="bloodPressureDiastolic"
                      value={formData.bloodPressureDiastolic}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cholesterol (mg/dL)</label>
                    <input
                      type="number"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="180"
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Measurements */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Clinical Measurements</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ECG Reading</label>
                    <input
                      type="number"
                      step="0.01"
                      name="ecg"
                      value={formData.ecg}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="1.28"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">EEG Reading</label>
                    <input
                      type="number"
                      step="0.01"
                      name="eeg"
                      value={formData.eeg}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="3.21"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HRV (Heart Rate Variability)</label>
                    <input
                      type="number"
                      name="hrv"
                      value={formData.hrv}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="19"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gait Speed (m/s)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="gaitSpeed"
                      value={formData.gaitSpeed}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="0.89"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">RRV (Respiratory Rate Variability)</label>
                    <input
                      type="number"
                      name="rrv"
                      value={formData.rrv}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="22"
                    />
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Medical History</label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="e.g., Coronary Artery Disease, COPD, Diabetes..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing with AI...</span>
                  </>
                ) : (
                  <>
                    <span>🔬</span>
                    <span>Analyze Health Risk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Analysis Result Header */}
            <div className="bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-2">Health Risk Analysis Complete</h2>
              <p className="text-red-100">Analysis Date: {new Date(analysisResult.analysisDate).toLocaleDateString()}</p>
              <button
                onClick={() => setAnalysisResult(null)}
                className="mt-4 px-6 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition"
              >
                ← New Analysis
              </button>
            </div>

            {/* Analysis Results Display */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {analysisResult.analysis.split('\n').map((line, index) => {
                    // Remove asterisks and format headers
                    const cleanLine = line.replace(/\*\*/g, '').trim();
                    
                    if (cleanLine.match(/^\d+\./)) {
                      // Numbered sections
                      return (
                        <div key={index} className="mt-6 mb-3">
                          <h3 className="text-xl font-bold text-teal-700">{cleanLine}</h3>
                        </div>
                      );
                    } else if (cleanLine.includes(':') && cleanLine.length < 100) {
                      // Labels/headers
                      return (
                        <div key={index} className="mt-4 mb-2">
                          <p className="font-semibold text-gray-800">{cleanLine}</p>
                        </div>
                      );
                    } else if (cleanLine.startsWith('-')) {
                      // Bullet points
                      return (
                        <div key={index} className="ml-4 mb-2">
                          <p className="text-gray-700">• {cleanLine.substring(1).trim()}</p>
                        </div>
                      );
                    } else if (cleanLine) {
                      // Regular text
                      return (
                        <p key={index} className="mb-3 text-gray-700">
                          {cleanLine}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/medical-reports')}
                className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-semibold hover:bg-teal-600 transition"
              >
                View All Reports
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Print Report
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DiseaseAnalysis;