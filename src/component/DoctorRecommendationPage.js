import React from 'react';
import AlertBox from './AlertBox';
import DoctorCard from './DoctorCard';

function DoctorRecommendationPage({ alerts, doctors, onBack }) {
  return (
    <div className="page page-3">
      <div className="container-large">
        <button onClick={onBack} className="back-btn">
          <i className="fas fa-arrow-left"></i> Back
        </button>

        {alerts.length > 0 && (
          <div className="alerts-container">
            {alerts.map((alert, idx) => (
              <AlertBox key={idx} alert={alert} />
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <div className="icon-box orange-gradient">
              <i className="fas fa-stethoscope"></i>
            </div>
            <div>
              <h1 className="card-title orange">Recommended Doctors</h1>
              <p className="subtitle">Specialists for your condition</p>
            </div>
          </div>

          {alerts.length === 0 ? (
            <div className="success-message">
              <div className="success-icon-box">
                <i className="fas fa-heart success-icon"></i>
              </div>
              <h3 className="success-title">All Values Normal!</h3>
              <p className="success-text">No immediate medical consultation needed.</p>
            </div>
          ) : (
            <div className="doctors-container">
              {alerts.map((alert, idx) => (
                <DoctorCard 
                  key={idx} 
                  doctor={doctors[alert.type]} 
                  alertType={alert.type} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorRecommendationPage;