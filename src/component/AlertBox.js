import React from 'react';

function AlertBox({ alert }) {
  return (
    <div className="alert-box">
      <div className="alert-content">
        <i className="fas fa-exclamation-circle alert-icon"></i>
        <div>
          <h3 className="alert-title">{alert.type} Alert!</h3>
          <p className="alert-message">{alert.message}</p>
        </div>
      </div>
    </div>
  );
}

export default AlertBox;