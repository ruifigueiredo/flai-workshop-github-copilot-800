import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/workouts/`;

  useEffect(() => {
    console.log('Workouts component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Workouts component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts component - Raw data received:', data);
        // Handle both paginated (.results) and plain array responses
        const workoutsData = data.results || data;
        console.log('Workouts component - Processed data:', workoutsData);
        setWorkouts(workoutsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  }, [apiUrl]);

  if (loading) return (
    <div className="content-container">
      <div className="loading-container">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading workouts...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="content-container">
      <div className="error-container">
        <h3>⚠️ Error Loading Data</h3>
        <p className="text-danger">{error}</p>
      </div>
    </div>
  );

  const getDifficultyBadge = (level) => {
    const levels = {
      'easy': 'bg-success',
      'beginner': 'bg-success',
      'intermediate': 'bg-warning text-dark',
      'moderate': 'bg-warning text-dark',
      'advanced': 'bg-danger',
      'hard': 'bg-danger',
      'expert': 'bg-dark'
    };
    return levels[level?.toLowerCase()] || 'bg-secondary';
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>💪 Workout Suggestions</h2>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> {apiUrl}
      </div>
      
      {workouts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No workout suggestions found.</strong> Check back later for personalized workouts!
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="badge bg-primary">Total Workouts: {workouts.length}</span>
          </div>
          <div className="row">
            {workouts.map((workout) => (
              <div key={workout.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card custom-card">
                  <div className="card-body">
                    <h5 className="card-title">{workout.name}</h5>
                    <h6 className="card-subtitle mb-3">
                      <span className="badge bg-info">{workout.activity_type}</span>
                      <span className={`badge ${getDifficultyBadge(workout.difficulty_level)} ms-2`}>
                        {workout.difficulty_level}
                      </span>
                    </h6>
                    <p className="card-text text-muted">{workout.description}</p>
                    
                    <ul className="list-group list-group-flush mt-3">
                      <li className="list-group-item">
                        <strong>⏱️ Duration:</strong> {workout.duration_minutes} minutes
                      </li>
                      <li className="list-group-item">
                        <strong>🔥 Est. Calories:</strong> 
                        <span className="badge bg-warning text-dark ms-2">
                          {workout.estimated_calories} kcal
                        </span>
                      </li>
                    </ul>
                    
                    <button className="btn btn-primary btn-sm mt-3 w-100">
                      Start Workout
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Workouts;
