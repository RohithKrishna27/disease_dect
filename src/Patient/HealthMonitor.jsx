import React, { useState, useEffect, useRef } from 'react';
import { Activity, Heart, Droplet, Wind, Thermometer, Brain, AlertTriangle, CheckCircle, User, Calendar, Weight, FileText } from 'lucide-react';

// xAI Grok API Key
const XAI_API_KEY = 'xai-LKR0za8b0rlGSXhn9kKYKTiWdbtDwGJKqnWd098V6YLbq1FMh1oUtFTcjOyf05xcMxONKRtu7CUu7BEg';

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
    bloodPressureSys: 0,
    bloodPressureDia: 0,
    oxygenLevel: 0,
    temperature: 0,
    respiratoryRate: 0,
    glucoseLevel: 0
  });

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [alertLevel, setAlertLevel] = useState('normal');
  const [isConnected, setIsConnected] = useState(false);
  const [history, setHistory] = useState([]);
  const intervalRef = useRef(null);

  const diseases = [
    'Cardiac Arrest',
    'Respiratory Failure',
    'Sepsis',
    'Stroke',
    'Diabetes Complications'
  ];

  const generateVitalSigns = (disease) => {
    const baseVariation = () => (Math.random() - 0.5) * 2;
    
    let vitals = {};
    
    switch(disease) {
      case 'Cardiac Arrest':
        vitals = {
          heartRate: Math.floor(45 + Math.random() * 40 + baseVariation() * 15),
          bloodPressureSys: Math.floor(90 + Math.random() * 40 + baseVariation() * 20),
          bloodPressureDia: Math.floor(60 + Math.random() * 20 + baseVariation() * 10),
          oxygenLevel: Math.floor(88 + Math.random() * 10 + baseVariation() * 3),
          temperature: parseFloat((36.5 + Math.random() * 1.5 + baseVariation() * 0.5).toFixed(1)),
          respiratoryRate: Math.floor(16 + Math.random() * 8 + baseVariation() * 4),
          glucoseLevel: Math.floor(90 + Math.random() * 40 + baseVariation() * 10)
        };
        break;
      case 'Respiratory Failure':
        vitals = {
          heartRate: Math.floor(80 + Math.random() * 40 + baseVariation() * 15),
          bloodPressureSys: Math.floor(100 + Math.random() * 40 + baseVariation() * 15),
          bloodPressureDia: Math.floor(65 + Math.random() * 20 + baseVariation() * 10),
          oxygenLevel: Math.floor(82 + Math.random() * 12 + baseVariation() * 5),
          temperature: parseFloat((37 + Math.random() * 2 + baseVariation() * 0.5).toFixed(1)),
          respiratoryRate: Math.floor(24 + Math.random() * 16 + baseVariation() * 6),
          glucoseLevel: Math.floor(95 + Math.random() * 35 + baseVariation() * 10)
        };
        break;
      case 'Sepsis':
        vitals = {
          heartRate: Math.floor(100 + Math.random() * 40 + baseVariation() * 20),
          bloodPressureSys: Math.floor(80 + Math.random() * 30 + baseVariation() * 20),
          bloodPressureDia: Math.floor(50 + Math.random() * 20 + baseVariation() * 10),
          oxygenLevel: Math.floor(88 + Math.random() * 8 + baseVariation() * 4),
          temperature: parseFloat((38 + Math.random() * 3 + baseVariation() * 0.8).toFixed(1)),
          respiratoryRate: Math.floor(22 + Math.random() * 18 + baseVariation() * 6),
          glucoseLevel: Math.floor(140 + Math.random() * 80 + baseVariation() * 20)
        };
        break;
      case 'Stroke':
        vitals = {
          heartRate: Math.floor(70 + Math.random() * 50 + baseVariation() * 15),
          bloodPressureSys: Math.floor(150 + Math.random() * 40 + baseVariation() * 25),
          bloodPressureDia: Math.floor(90 + Math.random() * 30 + baseVariation() * 15),
          oxygenLevel: Math.floor(90 + Math.random() * 8 + baseVariation() * 3),
          temperature: parseFloat((36.8 + Math.random() * 1.5 + baseVariation() * 0.4).toFixed(1)),
          respiratoryRate: Math.floor(14 + Math.random() * 10 + baseVariation() * 4),
          glucoseLevel: Math.floor(110 + Math.random() * 60 + baseVariation() * 15)
        };
        break;
      case 'Diabetes Complications':
        vitals = {
          heartRate: Math.floor(75 + Math.random() * 35 + baseVariation() * 12),
          bloodPressureSys: Math.floor(110 + Math.random() * 50 + baseVariation() * 20),
          bloodPressureDia: Math.floor(70 + Math.random() * 25 + baseVariation() * 10),
          oxygenLevel: Math.floor(92 + Math.random() * 6 + baseVariation() * 2),
          temperature: parseFloat((36.5 + Math.random() * 1.8 + baseVariation() * 0.5).toFixed(1)),
          respiratoryRate: Math.floor(14 + Math.random() * 10 + baseVariation() * 4),
          glucoseLevel: Math.floor(180 + Math.random() * 150 + baseVariation() * 40)
        };
        break;
      default:
        vitals = {
          heartRate: Math.floor(70 + Math.random() * 30),
          bloodPressureSys: Math.floor(110 + Math.random() * 30),
          bloodPressureDia: Math.floor(70 + Math.random() * 20),
          oxygenLevel: Math.floor(95 + Math.random() * 5),
          temperature: parseFloat((36.5 + Math.random() * 1).toFixed(1)),
          respiratoryRate: Math.floor(14 + Math.random() * 6),
          glucoseLevel: Math.floor(90 + Math.random() * 30)
        };
    }
    
    return vitals;
  };

  const analyzeWithGrok = async (vitals, patientInfo) => {
    const analysis = generateFallbackAnalysis(vitals, patientInfo);
    setAiAnalysis(analysis);
  };

  const generateFallbackAnalysis = (vitals, patientInfo) => {
    const concerns = [];
    let status = 'Stable';
    
    if (vitals.heartRate < 60 || vitals.heartRate > 100) {
      concerns.push(`Heart Rate ${vitals.heartRate < 60 ? 'Low' : 'Elevated'} (${vitals.heartRate} bpm)`);
      status = vitals.heartRate < 40 || vitals.heartRate > 140 ? 'Critical' : 'Caution';
    }
    
    if (vitals.bloodPressureSys < 90 || vitals.bloodPressureSys > 140) {
      concerns.push(`Blood Pressure ${vitals.bloodPressureSys < 90 ? 'Low' : 'High'} (${vitals.bloodPressureSys}/${vitals.bloodPressureDia})`);
      status = vitals.bloodPressureSys < 80 || vitals.bloodPressureSys > 180 ? 'Critical' : status === 'Stable' ? 'Caution' : status;
    }
    
    if (vitals.oxygenLevel < 95) {
      concerns.push(`Oxygen Saturation Low (${vitals.oxygenLevel}%)`);
      status = vitals.oxygenLevel < 90 ? 'Critical' : status === 'Stable' ? 'Caution' : status;
    }
    
    if (vitals.temperature < 36.5 || vitals.temperature > 37.5) {
      concerns.push(`Temperature ${vitals.temperature < 36.5 ? 'Low' : 'Elevated'} (${vitals.temperature}°C)`);
      status = vitals.temperature < 35 || vitals.temperature > 39 ? 'Critical' : status === 'Stable' ? 'Caution' : status;
    }
    
    if (vitals.respiratoryRate < 12 || vitals.respiratoryRate > 20) {
      concerns.push(`Respiratory Rate ${vitals.respiratoryRate < 12 ? 'Low' : 'Elevated'} (${vitals.respiratoryRate}/min)`);
      status = vitals.respiratoryRate < 8 || vitals.respiratoryRate > 30 ? 'Critical' : status === 'Stable' ? 'Caution' : status;
    }
    
    if (vitals.glucoseLevel < 70 || vitals.glucoseLevel > 140) {
      concerns.push(`Blood Glucose ${vitals.glucoseLevel < 70 ? 'Low' : 'Elevated'} (${vitals.glucoseLevel} mg/dL)`);
    }
    
    if (status === 'Critical') {
      setAlertLevel('critical');
    } else if (status === 'Caution') {
      setAlertLevel('warning');
    } else {
      setAlertLevel('normal');
    }
    
    let analysis = `Current Status: ${status}\n\n`;
    
    if (concerns.length > 0) {
      analysis += `Key Concerns:\n${concerns.map(c => `• ${c}`).join('\n')}\n\n`;
      analysis += `Recommendations:\n`;
      if (status === 'Critical') {
        analysis += `• Immediate medical intervention required\n`;
        analysis += `• Notify attending physician immediately\n`;
        analysis += `• Prepare emergency equipment\n`;
      } else {
        analysis += `• Continue close monitoring\n`;
        analysis += `• Document all readings\n`;
        analysis += `• Alert medical staff if condition worsens\n`;
      }
    } else {
      analysis += `All vital signs within normal ranges.\n\n`;
      analysis += `Recommendations:\n• Continue routine monitoring\n• Maintain current treatment plan\n`;
    }
    
    analysis += `\nRisk Assessment: Patient with ${patientInfo.disease} requires continuous monitoring. ${concerns.length > 0 ? 'Current abnormalities should be addressed promptly.' : 'Condition currently stable.'}`;
    
    return analysis;
  };

  const handleRegister = () => {
    if (patientData.name && patientData.age && patientData.weight && patientData.disease) {
      setStage('connecting');
      setTimeout(() => {
        setIsConnected(true);
        setStage('monitoring');
      }, 2000);
    }
  };

  useEffect(() => {
    if (stage === 'monitoring' && isConnected) {
      const newVitals = generateVitalSigns(patientData.disease);
      setVitalSigns(newVitals);
      analyzeWithGrok(newVitals, patientData);

      intervalRef.current = setInterval(() => {
        const updatedVitals = generateVitalSigns(patientData.disease);
        setVitalSigns(updatedVitals);
        
        setHistory(prev => [...prev.slice(-19), {
          time: new Date().toLocaleTimeString(),
          ...updatedVitals
        }]);

        analyzeWithGrok(updatedVitals, patientData);
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [stage, isConnected, patientData.disease]);

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
              <p className="text-gray-600">AI-Powered Patient Monitoring System</p>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Connecting to ICU Equipment</h2>
          <p className="text-gray-600">Establishing secure connection...</p>
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
                AI based ICU Patient Monitor
              </h1>
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">{patientData.name}</span> • 
                {patientData.age} years • {patientData.weight} kg • 
                <span className="font-medium text-red-600 ml-1">{patientData.disease}</span>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${
              alertLevel === 'critical' ? 'bg-red-100 text-red-700' :
              alertLevel === 'warning' ? 'bg-yellow-100 text-yellow-700' :
              'bg-green-100 text-green-700'
            }`}>
              {alertLevel === 'critical' ? '🚨 CRITICAL' :
               alertLevel === 'warning' ? '⚠️ CAUTION' :
               '✓ STABLE'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <VitalCard
            icon={<Heart className="w-6 h-6" />}
            title="Heart Rate"
            value={vitalSigns.heartRate}
            unit="bpm"
            normal="60-100"
            color="red"
          />
          <VitalCard
            icon={<Droplet className="w-6 h-6" />}
            title="Blood Pressure"
            value={`${vitalSigns.bloodPressureSys}/${vitalSigns.bloodPressureDia}`}
            unit="mmHg"
            normal="120/80"
            color="purple"
          />
          <VitalCard
            icon={<Wind className="w-6 h-6" />}
            title="Oxygen Level"
            value={vitalSigns.oxygenLevel}
            unit="%"
            normal="95-100"
            color="blue"
          />
          <VitalCard
            icon={<Thermometer className="w-6 h-6" />}
            title="Temperature"
            value={vitalSigns.temperature}
            unit="°C"
            normal="36.5-37.5"
            color="orange"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <VitalCard
            icon={<Activity className="w-6 h-6" />}
            title="Respiratory Rate"
            value={vitalSigns.respiratoryRate}
            unit="breaths/min"
            normal="12-20"
            color="teal"
          />
          <VitalCard
            icon={<Brain className="w-6 h-6" />}
            title="Blood Glucose"
            value={vitalSigns.glucoseLevel}
            unit="mg/dL"
            normal="70-140"
            color="indigo"
          />
        </div>

        <div className={`rounded-lg shadow-md p-6 mb-6 ${
          alertLevel === 'critical' ? 'bg-red-50 border-2 border-red-300' :
          alertLevel === 'warning' ? 'bg-yellow-50 border-2 border-yellow-300' :
          'bg-white'
        }`}>
          <div className="flex items-start">
            <div className={`p-3 rounded-lg mr-4 ${
              alertLevel === 'critical' ? 'bg-red-100' :
              alertLevel === 'warning' ? 'bg-yellow-100' :
              'bg-blue-100'
            }`}>
              {alertLevel === 'critical' ? (
                <AlertTriangle className="w-6 h-6 text-red-600" />
              ) : alertLevel === 'warning' ? (
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                AI Analysis & Recommendations
              </h3>
              <div className="text-sm text-gray-700 whitespace-pre-line">
                {aiAnalysis || 'Analyzing patient data...'}
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
                  <th className="text-left py-2 px-2">BP</th>
                  <th className="text-left py-2 px-2">SpO2</th>
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
                    <td className="py-2 px-2">{record.bloodPressureSys}/{record.bloodPressureDia}</td>
                    <td className="py-2 px-2">{record.oxygenLevel}%</td>
                    <td className="py-2 px-2">{record.temperature}°C</td>
                    <td className="py-2 px-2">{record.respiratoryRate}</td>
                    <td className="py-2 px-2">{record.glucoseLevel}</td>
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

const VitalCard = ({ icon, title, value, unit, normal, color }) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
    indigo: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
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