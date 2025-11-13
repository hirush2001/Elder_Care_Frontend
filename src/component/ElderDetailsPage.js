import React from 'react';

function ElderDetailsPage({ elderDetails, setElderDetails, onNext }) {
  return (
    <div className="page page-1">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <div className="icon-box purple-gradient">
              <i className="fas fa-user"></i>
            </div>
            <div>
              <h1 className="card-title">Elder Details</h1>
              <p className="subtitle">Enter basic information</p>
            </div>
          </div>

          <div className="form-content">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                value={elderDetails.name}
                onChange={(e) => setElderDetails({...elderDetails, name: e.target.value})}
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={elderDetails.age}
                onChange={(e) => setElderDetails({...elderDetails, age: e.target.value})}
                placeholder="Enter age"
              />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input
                type="tel"
                value={elderDetails.contact}
                onChange={(e) => setElderDetails({...elderDetails, contact: e.target.value})}
                placeholder="Enter contact number"
              />
            </div>
          </div>

          <button onClick={onNext} className="btn btn-purple">
            Next: Health Details →
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElderDetailsPage;