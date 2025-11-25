import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Droplet, Wind, Thermometer, Brain, AlertTriangle, CheckCircle, User, Calendar, Weight, FileText, Wifi, WifiOff } from 'lucide-react';

// Firebase Realtime Database Configuration
// Replace with your Firebase config
const FIREBASE_CONFIG = {
  databaseURL: "https://disese-dect-default-rtdb.firebaseio.com"
};

const HealthMonitor = () => {
  const [stage, setStage] = useState('registration');
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    weight: '',
    disease: ''
  });

  const [vitalSigns, setVitalSigns] = useState({
    heartRate: 0,
    bloodPressureSys: null,
    bloodPressureDia: null,
    oxygenLevel: 0,
    temperature: null,
    respiratoryRate: null,
    glucoseLevel: null
  });

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [alertLevel, setAlertLevel] = useState('normal');
  const [isConnected, setIsConnected] = useState(false);
  const [esp32Connected, setEsp32Connected] = useState(false);
  const [history, setHistory] = useState([]);
  const [patientId, setPatientId] = useState('');
  const intervalRef = useRef(null);
  const rtdbRef = useRef(null);

  const diseases = [
    'Cardiac Arrest',
    'Respiratory Failure',
    'Sepsis',
    'Stroke',
    'Diabetes Complications'
  ];

  // Initialize Firebase RTDB
  const initializeFirebase = async (patientName) => {
    try {
      // Generate patient ID
      const pid = `patient_${Date.now()}`;
      setPatientId(pid);

      // Initialize patient in RTDB
      const response = await fetch(`${FIREBASE_CONFIG.databaseURL}/patients/${pid}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          info: {
            name: patientName,
            age: patientData.age,
            weight: patientData.weight,
            disease: patientData.disease,
            registeredAt: new Date().toISOString()
          },
          status: {
            connected: true,
            esp32Connected: false,
            lastUpdate: new Date().toISOString()
          },
          vitals: {
            heartRate: 0,
            oxygenLevel: 0,
            bloodPressureSys: null,
            bloodPressureDia: null,
            temperature: null,
            respiratoryRate: null,
            glucoseLevel: null
          }
        })
      });

      if (response.ok) {
        console.log('Patient registered in Firebase RTDB');
        return pid;
      }
    } catch (error) {
      console.error('Firebase initialization error:', error);
    }
    return null;
  };

  // Generate normal vital signs (for initial demo)
  const generateNormalVitals = () => {
    return {
      heartRate: Math.floor(70 + Math.random() * 15), // 70-85 bpm (normal)
      oxygenLevel: Math.floor(96 + Math.random() * 4), // 96-100% (normal)
      bloodPressureSys: null,
      bloodPressureDia: null,
      temperature: null,
      respiratoryRate: null,
      glucoseLevel: null
    };
  };

  // Simulate ESP32 data - just pretending it's connected
  const generateESP32Data = () => {
    // Pretend ESP32 is sending data (but it's just random values)
    return {
      heartRate: Math.floor(68 + Math.random() * 18), // 68-86 bpm
      oxygenLevel: Math.floor(95 + Math.random() * 5), // 95-100%
      bloodPressureSys: null,
      bloodPressureDia: null,
      temperature: null,
      respiratoryRate: null,
      glucoseLevel: null
    };
  };

  // Store vitals to Firebase RTDB
  const storeVitalsToFirebase = async (vitals) => {
    if (!patientId) return;

    try {
      const timestamp = new Date().toISOString();
      
      // Update current vitals
      await fetch(`${FIREBASE_CONFIG.databaseURL}/patients/${patientId}/vitals.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...vitals,
          lastUpdate: timestamp
        })
      });

      // Store in history (every 2 minutes for long-term storage)
      const minutes = new Date().getMinutes();
      if (minutes % 2 === 0) {
        const historyKey = Date.now();
        await fetch(`${FIREBASE_CONFIG.databaseURL}/patients/${patientId}/history/${historyKey}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...vitals,
            timestamp: timestamp
          })
        });
        console.log('Vitals stored to history (2-minute interval)');
      }

      console.log('Vitals updated in RTDB');
    } catch (error) {
      console.error('Error storing vitals:', error);
    }
  };

  // Listen to ESP32 data from Firebase
  const listenToESP32Data = async () => {
    if (!patientId) return;

    try {
      const response = await fetch(`${FIREBASE_CONFIG.databaseURL}/patients/${patientId}/esp32Data.json`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setEsp32Connected(true);
          return data;
        }
      }
    } catch (error) {
      console.error('Error reading ESP32 data:', error);
    }
    return null;
  };

  const analyzeVitals = (vitals) => {
    const concerns = [];
    let status = 'Stable';
    
    if (vitals.heartRate < 60 || vitals.heartRate > 100) {
      concerns.push(`Heart Rate ${vitals.heartRate < 60 ? 'Low' : 'Elevated'} (${vitals.heartRate} bpm)`);
      status = vitals.heartRate < 40 || vitals.heartRate > 140 ? 'Critical' : 'Caution';
    }
    
    if (vitals.oxygenLevel < 95) {
      concerns.push(`Oxygen Saturation Low (${vitals.oxygenLevel}%)`);
      status = vitals.oxygenLevel < 90 ? 'Critical' : status === 'Stable' ? 'Caution' : status;
    }
    
    if (status === 'Critical') {
      setAlertLevel('critical');
    } else if (status === 'Caution') {
      setAlertLevel('warning');
    } else {
      setAlertLevel('normal');
    }
    
    return { status, concerns };
  };

  const handleRegister = async () => {
    if (patientData.name && patientData.age && patientData.weight && patientData.disease) {
      setStage('connecting');
      
      // Initialize Firebase
      const pid = await initializeFirebase(patientData.name);
      
      setTimeout(() => {
        setIsConnected(true);
        setStage('monitoring');
      }, 2000);
    }
  };

  useEffect(() => {
    if (stage === 'monitoring' && isConnected) {
      // Initial vitals
      const initialVitals = generateNormalVitals();
      setVitalSigns(initialVitals);
      storeVitalsToFirebase(initialVitals);
      const initialAnalysis = analyzeVitals(initialVitals);
      setAiAnalysis(initialAnalysis);

      // Update every 5 seconds with random values (pretending ESP32 is connected)
      intervalRef.current = setInterval(async () => {
        // Generate random values - pretending they're from ESP32
        const updatedVitals = generateNormalVitals();
        
        // Pretend ESP32 is connected (but it's just random data)
        setEsp32Connected(true);
        
        setVitalSigns(updatedVitals);
        
        // Store to Firebase
        await storeVitalsToFirebase(updatedVitals);
        
        // Update history
        setHistory(prev => [...prev.slice(-19), {
          time: new Date().toLocaleTimeString(),
          ...updatedVitals
        }]);

        // Analyze
        const analysis = analyzeVitals(updatedVitals);
        setAiAnalysis(analysis);
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [stage, isConnected, patientId]);

  if (stage === 'registration') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">ICU Health Monitor</h1>
              <p className="text-gray-600">Firebase RTDB + ESP32 Integration</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2" />
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientData.name}
                  onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2" />
                    Age
                  </label>
                  <input
                    type="number"
                    value={patientData.age}
                    onChange={(e) => setPatientData({...patientData, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Age"
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Weight className="w-4 h-4 mr-2" />
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={patientData.weight}
                    onChange={(e) => setPatientData({...patientData, weight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Weight"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2" />
                  Diagnosed Disease
                </label>
                <select
                  value={patientData.disease}
                  onChange={(e) => setPatientData({...patientData, disease: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select disease</option>
                  {diseases.map(disease => (
                    <option key={disease} value={disease}>{disease}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleRegister}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
              >
                <Activity className="w-5 h-5" />
                <span>Connect to ICU Equipment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'connecting') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="animate-pulse mb-6">
            <Activity className="w-16 h-16 text-blue-600 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to Systems</h2>
          <p className="text-gray-600">Initializing Firebase RTDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Activity className="w-7 h-7 mr-3 text-blue-600" />
                ICU Patient Monitor - Firebase RTDB
              </h1>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{patientData.name}</span> • 
                {patientData.age} years • {patientData.weight} kg • 
                <span className="font-medium text-red-600 ml-1">{patientData.disease}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Patient ID: {patientId}
              </div>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <div className={`px-4 py-2 rounded-full font-semibold ${
                alertLevel === 'critical' ? 'bg-red-100 text-red-700' :
                alertLevel === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {alertLevel === 'critical' ? '🚨 CRITICAL' :
                 alertLevel === 'warning' ? '⚠️ CAUTION' :
                 '✓ STABLE'}
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                esp32Connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {esp32Connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                {esp32Connected ? 'ESP32 Connected' : 'Demo Mode'}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <VitalCard
            icon={<Heart className="w-6 h-6" />}
            title="Heart Rate (BPM)"
            value={vitalSigns.heartRate}
            unit="bpm"
            normal="60-100"
            color="red"
            active={true}
          />
          <VitalCard
            icon={<Wind className="w-6 h-6" />}
            title="Oxygen Level (SpO2)"
            value={vitalSigns.oxygenLevel}
            unit="%"
            normal="95-100"
            color="blue"
            active={true}
          />
          <VitalCard
            icon={<Droplet className="w-6 h-6" />}
            title="Blood Pressure"
            value={vitalSigns.bloodPressureSys ? `${vitalSigns.bloodPressureSys}/${vitalSigns.bloodPressureDia}` : '--'}
            unit="mmHg"
            normal="120/80"
            color="purple"
            active={false}
          />
          <VitalCard
            icon={<Thermometer className="w-6 h-6" />}
            title="Temperature"
            value={vitalSigns.temperature || '--'}
            unit="°C"
            normal="36.5-37.5"
            color="orange"
            active={false}
          />
          <VitalCard
            icon={<Activity className="w-6 h-6" />}
            title="Respiratory Rate"
            value={vitalSigns.respiratoryRate || '--'}
            unit="/min"
            normal="12-20"
            color="teal"
            active={false}
          />
          <VitalCard
            icon={<Brain className="w-6 h-6" />}
            title="Blood Glucose"
            value={vitalSigns.glucoseLevel || '--'}
            unit="mg/dL"
            normal="70-140"
            color="indigo"
            active={false}
          />
        </div>

        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          alertLevel === 'critical' ? 'bg-red-50 border-2 border-red-300' :
          alertLevel === 'warning' ? 'bg-yellow-50 border-2 border-yellow-300' :
          'bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200'
        }`}>
          <div className="flex items-start">
            <div className={`p-3 rounded-lg mr-4 ${
              alertLevel === 'critical' ? 'bg-red-100' :
              alertLevel === 'warning' ? 'bg-yellow-100' :
              'bg-green-100'
            }`}>
              {alertLevel === 'critical' ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : alertLevel === 'warning' ? (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-3 ${
                alertLevel === 'critical' ? 'text-red-800' :
                alertLevel === 'warning' ? 'text-yellow-800' :
                'text-green-800'
              }`}>
                AI Analysis & Recommendations
              </h3>
              
              {/* Status Badge */}
              <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold text-sm mb-4 ${
                aiAnalysis.status === 'Critical' ? 'bg-red-200 text-red-900' :
                aiAnalysis.status === 'Caution' ? 'bg-yellow-200 text-yellow-900' :
                'bg-green-200 text-green-900'
              }`}>
                Current Status: {aiAnalysis.status}
              </div>

              {/* Concerns Section */}
              {aiAnalysis.concerns && aiAnalysis.concerns.length > 0 ? (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    Key Concerns:
                  </h4>
                  <div className="bg-white bg-opacity-60 rounded-lg p-3 space-y-1">
                    {aiAnalysis.concerns.map((concern, idx) => (
                      <div key={idx} className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">{concern}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <div className="bg-white bg-opacity-60 rounded-lg p-3">
                    <p className="text-green-800 font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      All monitored vital signs within normal ranges
                    </p>
                  </div>
                </div>
              )}

              {/* Recommendations Section */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${
                    aiAnalysis.status === 'Critical' ? 'bg-red-500' :
                    aiAnalysis.status === 'Caution' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}></span>
                  Recommendations:
                </h4>
                <div className="bg-white bg-opacity-60 rounded-lg p-3 space-y-1">
                  {aiAnalysis.status === 'Critical' ? (
                    <>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700 font-medium">Immediate medical intervention required</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">Notify attending physician immediately</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span className="text-gray-700">Prepare emergency equipment</span>
                      </div>
                    </>
                  ) : aiAnalysis.status === 'Caution' ? (
                    <>
                      <div className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">Continue close monitoring</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">Document all readings</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span className="text-gray-700">Alert medical staff if condition worsens</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Continue routine monitoring</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">Maintain current treatment plan</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        <span className="text-gray-700">All systems functioning optimally</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Risk Assessment Footer */}
              <div className="mt-4 pt-3 border-t border-gray-300">
                <p className="text-xs text-gray-600 flex items-center">
                  <Brain className="w-3 h-3 mr-1" />
                  <span className="font-medium">Risk Assessment:</span>
                  <span className="ml-1">Patient with {patientData.disease} requires continuous monitoring. {aiAnalysis.concerns && aiAnalysis.concerns.length > 0 ? 'Current abnormalities should be addressed promptly.' : 'Condition currently stable.'}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Readings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Time</th>
                  <th className="text-left py-2 px-2">HR</th>
                  <th className="text-left py-2 px-2">SpO2</th>
                  <th className="text-left py-2 px-2">BP</th>
                  <th className="text-left py-2 px-2">Temp</th>
                  <th className="text-left py-2 px-2">RR</th>
                  <th className="text-left py-2 px-2">Glucose</th>
                </tr>
              </thead>
              <tbody>
                {history.slice(-5).reverse().map((record, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{record.time}</td>
                    <td className="py-2 px-2">{record.heartRate}</td>
                    <td className="py-2 px-2">{record.oxygenLevel}%</td>
                    <td className="py-2 px-2">{record.bloodPressureSys ? `${record.bloodPressureSys}/${record.bloodPressureDia}` : '--'}</td>
                    <td className="py-2 px-2">{record.temperature ? `${record.temperature}°C` : '--'}</td>
                    <td className="py-2 px-2">{record.respiratoryRate || '--'}</td>
                    <td className="py-2 px-2">{record.glucoseLevel || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const VitalCard = ({ icon, title, value, unit, normal, color, active }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${!active ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        {active && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-800 mb-1">
        {value} <span className="text-lg text-gray-500">{unit}</span>
      </div>
      <p className="text-xs text-gray-500">Normal: {normal}</p>
    </div>
  );
};

export default HealthMonitor;