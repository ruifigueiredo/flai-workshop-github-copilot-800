import React, { useState, useEffect } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/users/`;

  useEffect(() => {
    console.log('Users component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Users component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users component - Raw data received:', data);
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users component - Processed data:', usersData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Users component - Error fetching data:', error);
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
        <p className="mt-3">Loading users...</p>
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

  const getFitnessLevelBadge = (level) => {
    const levels = {
      'beginner': 'bg-info',
      'intermediate': 'bg-primary',
      'advanced': 'bg-success',
      'expert': 'bg-danger'
    };
    return levels[level?.toLowerCase()] || 'bg-secondary';
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>👤 Users</h2>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> {apiUrl}
      </div>
      
      {users.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No users found.</strong> Register to join the community!
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="badge bg-primary">Total Users: {users.length}</span>
          </div>
          <div className="row">
            {users.map((user) => (
              <div key={user.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card custom-card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-2">
                          <strong>@{user.username || 'No Username'}</strong>
                        </h5>
                        <p className="text-muted mb-0 h6">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : user.first_name || user.last_name || 'Name not provided'}
                        </p>
                      </div>
                      {user.fitness_level && (
                        <span className={`badge ${getFitnessLevelBadge(user.fitness_level)}`}>
                          {user.fitness_level}
                        </span>
                      )}
                    </div>
                    
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item">
                        <strong>📧 Email:</strong> {user.email || 'N/A'}
                      </li>
                      <li className="list-group-item">
                        <strong>📅 Joined:</strong> {new Date(user.date_joined).toLocaleDateString()}
                      </li>
                    </ul>
                    
                    <button className="btn btn-outline-primary btn-sm mt-3 w-100">
                      View Profile
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

export default Users;
