import React from 'react';

function DoctorCard({ doctor, alertType }) {
  return (
    <div className="doctor-card">
      <div className="doctor-header">
        <div>
          <h3 className="doctor-name">{doctor.name}</h3>
          <p className="doctor-specialty">{doctor.specialty}</p>
        </div>
        <div className="badge">{alertType}</div>
      </div>
      
      <div className="doctor-info">
        <div className="info-row">
          <i className="fas fa-phone info-icon"></i>
          <span>{doctor.phone}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-envelope info-icon"></i>
          <span>{doctor.email}</span>
        </div>
        <div className="info-row">
          <i className="fas fa-map-marker-alt info-icon"></i>
          <span>{doctor.address}</span>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;