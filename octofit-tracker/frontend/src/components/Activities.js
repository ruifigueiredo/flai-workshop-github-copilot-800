import React, { useState, useEffect } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;

  useEffect(() => {
    console.log('Activities component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Activities component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities component - Raw data received:', data);
        const activitiesData = data.results || data;
        console.log('Activities component - Processed data:', activitiesData);
        setActivities(activitiesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  const handleViewDetails = (activity) => {
    setSelectedActivity(activity);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedActivity(null);
  };

  if (loading) return (
    <div className="content-container">
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading activities...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="content-container">
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">⚠️ Error Loading Data</h4>
          <p className="mb-0">{error}</p>
        </div>
        <button className="btn btn-primary mt-3" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="content-container">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap">
        <h2 className="mb-0">📊 Activities</h2>
        <button className="btn btn-primary">
          <span className="me-2">+</span> Log Activity
        </button>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> <code>{apiUrl}</code>
      </div>
      
      {activities.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <h5 className="alert-heading">No activities found</h5>
          <p className="mb-0">Start tracking your workouts!</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <span className="badge bg-primary rounded-pill fs-6">
              Total Activities: {activities.length}
            </span>
            <div className="btn-group" role="group" aria-label="View options">
              <button type="button" className="btn btn-outline-secondary btn-sm active">
                Table View
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm">
                Card View
              </button>
            </div>
          </div>
          
          <div className="table-container table-responsive">
            <table className="table table-hover table-striped custom-table align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col">User</th>
                  <th scope="col">Activity Type</th>
                  <th scope="col">Duration</th>
                  <th scope="col">Distance</th>
                  <th scope="col">Calories</th>
                  <th scope="col">Date</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>
                      <strong className="text-dark">{activity.user_name || activity.user || 'N/A'}</strong>
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">{activity.activity_type}</span>
                    </td>
                    <td>{activity.duration} min</td>
                    <td>{activity.distance} km</td>
                    <td>
                      <span className="badge bg-warning text-dark">{activity.calories_burned} kcal</span>
                    </td>
                    <td>{new Date(activity.date).toLocaleDateString()}</td>
                    <td className="text-center">
                      <div className="btn-group btn-group-sm" role="group">
                        <button 
                          className="btn btn-outline-primary"
                          onClick={() => handleViewDetails(activity)}
                          title="View Details"
                        >
                          View
                        </button>
                        <button className="btn btn-outline-secondary" title="Edit">
                          Edit
                        </button>
                        <button className="btn btn-outline-danger" title="Delete">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Activity Details Modal */}
      {showModal && selectedActivity && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Activity Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="card border-0">
                  <div className="card-body">
                    <h5 className="card-title">{selectedActivity.activity_type}</h5>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>User:</strong>
                        <span>{selectedActivity.user_name || selectedActivity.user || 'N/A'}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Duration:</strong>
                        <span>{selectedActivity.duration} minutes</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Distance:</strong>
                        <span>{selectedActivity.distance} km</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Calories Burned:</strong>
                        <span className="badge bg-success">{selectedActivity.calories_burned} kcal</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <strong>Date:</strong>
                        <span>{new Date(selectedActivity.date).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>Close</button>
                <button type="button" className="btn btn-primary">Edit Activity</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Activities;
