import React, { useState, useEffect } from 'react';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateTeam = (e) => {
    e.preventDefault();
    console.log('Creating team:', newTeam);
    setShowCreateModal(false);
    setNewTeam({ name: '', description: '' });
  };

  if (loading) return (
    <div className="content-container">
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading teams...</p>
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
        <h2 className="mb-0">👥 Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          <span className="me-2">+</span> Create Team
        </button>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> <code>{apiUrl}</code>
      </div>
      
      {teams.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <h5 className="alert-heading">No teams found</h5>
          <p className="mb-0">Create your first team to get started!</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <span className="badge bg-primary rounded-pill fs-6">
              Total Teams: {teams.length}
            </span>
            <div className="input-group" style={{maxWidth: '300px'}}>
              <span className="input-group-text bg-white border-end-0">
                🔍
              </span>
              <input 
                type="text" 
                className="form-control border-start-0" 
                placeholder="Search teams..."
              />
            </div>
          </div>
          
          <div className="row">
            {teams.map((team) => (
              <div key={team.id} className="col-md-6 col-lg-4 mb-4">
                <div className="card custom-card h-100">
                  <div className="card-header bg-primary text-white">
                    <h5 className="card-title mb-0">{team.name}</h5>
                  </div>
                  <div className="card-body">
                    <p className="card-text text-muted">{team.description || 'No description available'}</p>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span><strong>👥 Members:</strong></span>
                        <span className="badge bg-success rounded-pill">
                          {team.member_count || team.members?.length || 0}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        <span><strong>📅 Created:</strong></span>
                        <span>{new Date(team.created_at).toLocaleDateString()}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="card-footer bg-white border-top-0">
                    <div className="d-grid gap-2">
                      <button className="btn btn-outline-primary btn-sm">
                        View Details
                      </button>
                      <button className="btn btn-success btn-sm">
                        Join Team
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Create New Team</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <form onSubmit={handleCreateTeam}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="teamName" className="form-label">Team Name</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="teamName" 
                      name="name"
                      value={newTeam.name}
                      onChange={handleInputChange}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="teamDescription" className="form-label">Description</label>
                    <textarea 
                      className="form-control" 
                      id="teamDescription" 
                      name="description"
                      value={newTeam.description}
                      onChange={handleInputChange}
                      rows="3" 
                      placeholder="Enter team description"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Team
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
