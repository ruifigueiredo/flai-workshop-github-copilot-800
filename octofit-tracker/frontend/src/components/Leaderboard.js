import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

  useEffect(() => {
    console.log('Leaderboard component - Fetching from:', apiUrl);
    
    fetch(apiUrl)
      .then(response => {
        console.log('Leaderboard component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard component - Raw data received:', data);
        // Handle both paginated (.results) and plain array responses
        const leaderboardData = data.results || data;
        console.log('Leaderboard component - Processed data:', leaderboardData);
        setLeaderboard(leaderboardData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard component - Error fetching data:', error);
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
        <p className="mt-3">Loading leaderboard...</p>
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

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-badge gold';
    if (index === 1) return 'rank-badge silver';
    if (index === 2) return 'rank-badge bronze';
    return 'rank-badge';
  };

  return (
    <div className="content-container">
      <div className="page-header">
        <h2>🏆 Leaderboard</h2>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> {apiUrl}
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <strong>No leaderboard data found.</strong> Be the first to compete!
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="badge bg-success">Total Competitors: {leaderboard.length}</span>
          </div>
          <div className="table-container">
            <table className="table table-hover custom-table">
              <thead>
                <tr>
                  <th style={{width: '80px'}}>Rank</th>
                  <th>User</th>
                  <th>Team</th>
                  <th>Total Points</th>
                  <th>Activities</th>
                  <th>Duration</th>
                  <th>Distance</th>
                  <th>Calories</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id || index}>
                    <td>
                      <div className={getRankBadgeClass(index)}>
                        {index + 1}
                      </div>
                    </td>
                    <td><strong>{entry.user_name || entry.name || 'N/A'}</strong></td>
                    <td>
                      {entry.team_name ? (
                        <span className="badge bg-info">{entry.team_name}</span>
                      ) : (
                        <span className="text-muted">No Team</span>
                      )}
                    </td>
                    <td>
                      <h5 className="mb-0">
                        <span className="badge bg-warning text-dark">
                          {entry.total_points || entry.points || 0} pts
                        </span>
                      </h5>
                    </td>
                    <td>{entry.activity_count || 0}</td>
                    <td>{entry.total_duration || 0} min</td>
                    <td>{entry.total_distance || 0} km</td>
                    <td><strong>{entry.total_calories || 0}</strong> kcal</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
