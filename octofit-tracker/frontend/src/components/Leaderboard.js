import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('total_points');

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

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedLeaderboard = [...leaderboard].sort((a, b) => {
    const aVal = a[sortBy] || a.points || 0;
    const bVal = b[sortBy] || b.points || 0;
    return bVal - aVal;
  });

  if (loading) return (
    <div className="content-container">
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading leaderboard...</p>
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

  const getRankBadgeClass = (index) => {
    if (index === 0) return 'rank-badge gold';
    if (index === 1) return 'rank-badge silver';
    if (index === 2) return 'rank-badge bronze';
    return 'rank-badge';
  };

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  return (
    <div className="content-container">
      <div className="page-header d-flex justify-content-between align-items-center flex-wrap">
        <h2 className="mb-0">🏆 Leaderboard</h2>
        <div className="d-flex align-items-center gap-2">
          <label htmlFor="sortSelect" className="form-label mb-0 text-muted">Sort by:</label>
          <select 
            id="sortSelect" 
            className="form-select form-select-sm" 
            style={{width: 'auto'}}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="total_points">Total Points</option>
            <option value="activity_count">Activities</option>
            <option value="total_duration">Duration</option>
            <option value="total_calories">Calories</option>
          </select>
        </div>
      </div>
      
      <div className="api-info">
        <strong>API Endpoint:</strong> <code>{apiUrl}</code>
      </div>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-info" role="alert">
          <h5 className="alert-heading">No leaderboard data found</h5>
          <p className="mb-0">Be the first to compete!</p>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-success rounded-pill fs-6">
              Total Competitors: {leaderboard.length}
            </span>
          </div>
          
          <div className="table-container table-responsive">
            <table className="table table-hover custom-table align-middle">
              <thead className="table-dark">
                <tr>
                  <th scope="col" style={{width: '80px'}}>Rank</th>
                  <th scope="col">User</th>
                  <th scope="col">Team</th>
                  <th scope="col" className="text-center">Total Points</th>
                  <th scope="col" className="text-center">Activities</th>
                  <th scope="col" className="text-center">Duration</th>
                  <th scope="col" className="text-center">Distance</th>
                  <th scope="col" className="text-center">Calories</th>
                </tr>
              </thead>
              <tbody>
                {sortedLeaderboard.map((entry, index) => (
                  <tr key={entry.id || index} className={index < 3 ? 'table-active' : ''}>
                    <td>
                      <div className={getRankBadgeClass(index)}>
                        {getRankIcon(index)}
                      </div>
                    </td>
                    <td>
                      <strong className="text-dark">{entry.user_name || entry.name || 'N/A'}</strong>
                    </td>
                    <td>
                      {entry.team_name ? (
                        <span className="badge bg-info text-dark">{entry.team_name}</span>
                      ) : (
                        <span className="text-muted fst-italic">No Team</span>
                      )}
                    </td>
                    <td className="text-center">
                      <span className="badge bg-warning text-dark fs-6 px-3">
                        {entry.total_points || entry.points || 0} pts
                      </span>
                    </td>
                    <td className="text-center">
                      <span className="badge bg-secondary">{entry.activity_count || 0}</span>
                    </td>
                    <td className="text-center">{entry.total_duration || 0} min</td>
                    <td className="text-center">{entry.total_distance || 0} km</td>
                    <td className="text-center">
                      <span className="badge bg-success">{entry.total_calories || 0} kcal</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Top 3 Highlight Cards */}
          {sortedLeaderboard.length >= 3 && (
            <div className="row mt-4">
              <div className="col-12">
                <h5 className="text-muted mb-3">🎖️ Top Performers</h5>
              </div>
              {sortedLeaderboard.slice(0, 3).map((entry, index) => (
                <div key={entry.id || index} className="col-md-4 mb-3">
                  <div className={`card custom-card ${index === 0 ? 'border-warning' : index === 1 ? 'border-secondary' : 'border-danger'}`} 
                       style={{borderWidth: '2px'}}>
                    <div className="card-body text-center">
                      <div className="display-4 mb-2">{getRankIcon(index)}</div>
                      <h5 className="card-title">{entry.user_name || entry.name || 'N/A'}</h5>
                      <p className="card-text">
                        <span className="badge bg-primary fs-5">
                          {entry.total_points || entry.points || 0} points
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
