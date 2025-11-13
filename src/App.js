import React, { useState } from 'react';
import './App.css';
import ElderDetailsPage from './component/ElderDetailsPage';
import HealthMonitoringPage from './component/HealthMonitoringPage';
import DoctorRecommendationPage from './component/DoctorRecommendationPage';

function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [elderDetails, setElderDetails] = useState({
    name: '',
    age: '',
    contact: ''
  });
  const [healthData, setHealthData] = useState({
    sugarLevel: '',
    bloodPressureSystolic: '',
    bloodPressureDiastolic: '',
    heartRate: ''
  });
  const [alerts, setAlerts] = useState([]);

  const doctors = {
    'Sugar Level': {
      name: 'Dr. Sarah Martinez',
      specialty: 'Endocrinologist',
      phone: '+1 (555) 123-4567',
      email: 'dr.martinez@healthcare.com',
      address: '123 Medical Plaza, Suite 400'
    },
    'Blood Pressure': {
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      phone: '+1 (555) 234-5678',
      email: 'dr.wilson@healthcare.com',
      address: '456 Heart Center, Floor 2'
    },
    'Heart Rate': {
      name: 'Dr. James Wilson',
      specialty: 'Cardiologist',
      phone: '+1 (555) 234-5678',
      email: 'dr.wilson@healthcare.com',
      address: '456 Heart Center, Floor 2'
    }
  };

  const checkHealthLevels = () => {
    const newAlerts = [];
    
    if (healthData.sugarLevel) {
      const sugar = parseFloat(healthData.sugarLevel);
      if (sugar > 140) {
        newAlerts.push({
          type: 'Sugar Level',
          message: 'Blood sugar level is HIGH! Normal fasting level is 70-100 mg/dL',
          severity: 'high'
        });
      }
    }
    
    if (healthData.bloodPressureSystolic && healthData.bloodPressureDiastolic) {
      const systolic = parseFloat(healthData.bloodPressureSystolic);
      const diastolic = parseFloat(healthData.bloodPressureDiastolic);
      if (systolic > 140 || diastolic > 90) {
        newAlerts.push({
          type: 'Blood Pressure',
          message: 'Blood pressure is HIGH! Normal range is 120/80 mmHg or lower',
          severity: 'high'
        });
      }
    }
    
    if (healthData.heartRate) {
      const hr = parseFloat(healthData.heartRate);
      if (hr > 100 || hr < 60) {
        newAlerts.push({
          type: 'Heart Rate',
          message: hr > 100 ? 'Heart rate is HIGH!' : 'Heart rate is LOW!',
          severity: 'high'
        });
      }
    }
    
    setAlerts(newAlerts);
    setCurrentPage(3);
  };

  return (
    <div className="App">
      {currentPage === 1 && (
        <ElderDetailsPage
          elderDetails={elderDetails}
          setElderDetails={setElderDetails}
          onNext={() => setCurrentPage(2)}
        />
      )}
      {currentPage === 2 && (
        <HealthMonitoringPage
          healthData={healthData}
          setHealthData={setHealthData}
          onBack={() => setCurrentPage(1)}
          onSubmit={checkHealthLevels}
        />
      )}
      {currentPage === 3 && (
        <DoctorRecommendationPage
          alerts={alerts}
          doctors={doctors}
          onBack={() => setCurrentPage(2)}
        />
      )}
    </div>
  );
}

export default App;
