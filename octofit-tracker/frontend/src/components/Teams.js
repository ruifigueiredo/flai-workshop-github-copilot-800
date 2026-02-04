import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;

  useEffect(() => {
    console.log('Teams component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Teams component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams component - Raw data received:', data);
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams component - Processed data:', teamsData);
        setTeams(teamsData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Teams component - Error fetching data:', error);
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
        <p className="mt-3">Loading teams...</p>
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

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>👥 Teams</h2>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> {apiUrl}
      </div>
      
      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No teams found.</strong> Create your first team to get started!
        </div>
      ) : (
        <>
          <div className="mb-4">
            <span className="badge bg-primary">Total Teams: {teams.length}</span>
          </div>
          <div className="row">
            {teams.map((team) => (
              <div key={team.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card custom-card">
                  <div className="card-body">
                    <h5 className="card-title">{team.name}</h5>
                    <p className="card-text text-muted">{team.description}</p>
                    <ul className="list-group list-group-flush mt-3">
                      <li className="list-group-item">
                        <strong>👥 Members:</strong>
                        <span className="badge bg-success ms-2">
                          {team.member_count || team.members?.length || 0}
                        </span>
                      </li>
                      <li className="list-group-item">
                        <strong>📅 Created:</strong> {new Date(team.created_at).toLocaleDateString()}
                      </li>
                    </ul>
                    <button className="btn btn-outline-primary btn-sm mt-3 w-100">
                      View Details
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

export default Teams;
