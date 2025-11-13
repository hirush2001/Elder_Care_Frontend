import React from 'react';

function HealthMonitoringPage({ healthData, setHealthData, onBack, onSubmit }) {
  return (
    <div className="page page-2">
      <div className="container">
        <button onClick={onBack} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div className="card">
          <div className="card-header">
            <div className="icon-box teal-gradient">
              <i className="fas fa-heart"></i>
            </div>
            <div>
              <h1 className="card-title teal">Health Monitoring</h1>
              <p className="subtitle">Enter current health readings</p>
            </div>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Blood Sugar Level (mg/dL)</label>
              <input
                type="number"
                value={healthData.sugarLevel}
                onChange={(e) => setHealthData({...healthData, sugarLevel: e.target.value})}
                placeholder="Normal: 70-100 (fasting)"
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Systolic BP (mmHg)</label>
                <input
                  type="number"
                  value={healthData.bloodPressureSystolic}
                  onChange={(e) => setHealthData({...healthData, bloodPressureSystolic: e.target.value})}
                  placeholder="Top number"
                />
              </div>
              <div className="form-group">
                <label>Diastolic BP (mmHg)</label>
                <input
                  type="number"
                  value={healthData.bloodPressureDiastolic}
                  onChange={(e) => setHealthData({...healthData, bloodPressureDiastolic: e.target.value})}
                  placeholder="Bottom number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Heart Rate (bpm)</label>
              <input
                type="number"
                value={healthData.heartRate}
                onChange={(e) => setHealthData({...healthData, heartRate: e.target.value})}
                placeholder="Normal: 60-100"
              />
            </div>
          </div>

          <button onClick={onSubmit} className="btn btn-teal">
            Check Health Status →
          </button>
        </div>
      </div>
    </div>
  );
}

export default HealthMonitoringPage;