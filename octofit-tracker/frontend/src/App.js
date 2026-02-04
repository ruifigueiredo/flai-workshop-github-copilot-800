import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
          <div className="container-fluid">
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img 
                src="/octofitapp-logo.png" 
                alt="OctoFit Logo" 
                className="navbar-logo me-2"
              />
              <span>OctoFit Tracker</span>
            </Link>
            <button 
              className="navbar-toggler" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#navbarNav" 
              aria-controls="navbarNav" 
              aria-expanded="false" 
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/activities">📊 Activities</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leaderboard">🏆 Leaderboard</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/teams">👥 Teams</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/users">👤 Users</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/workouts">💪 Workouts</NavLink>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={
            <div className="content-container welcome-container">
              <h1>Welcome to OctoFit Tracker</h1>
              <p className="lead">Track your fitness activities, compete with your team, and achieve your goals!</p>
              <hr />
              
              <div className="row mt-5 mb-4">
                <div className="col-md-4 mb-4">
                  <Link to="/activities" className="text-decoration-none">
                    <div className="card custom-card home-card">
                      <div className="card-body text-center">
                        <div className="home-card-icon">📊</div>
                        <h3 className="card-title mt-3">Activities</h3>
                        <p className="card-text">Track your daily workouts and exercise sessions</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4 mb-4">
                  <Link to="/leaderboard" className="text-decoration-none">
                    <div className="card custom-card home-card">
                      <div className="card-body text-center">
                        <div className="home-card-icon">🏆</div>
                        <h3 className="card-title mt-3">Leaderboard</h3>
                        <p className="card-text">See who's leading the fitness challenge</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-4 mb-4">
                  <Link to="/users" className="text-decoration-none">
                    <div className="card custom-card home-card">
                      <div className="card-body text-center">
                        <div className="home-card-icon">👤</div>
                        <h3 className="card-title mt-3">Users</h3>
                        <p className="card-text">View all members of the community</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="row mt-3">
                <div className="col-md-6 mb-4">
                  <Link to="/teams" className="text-decoration-none">
                    <div className="card custom-card home-card">
                      <div className="card-body text-center">
                        <div className="home-card-icon">👥</div>
                        <h3 className="card-title mt-3">Teams</h3>
                        <p className="card-text">Join or create teams for group challenges</p>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-md-6 mb-4">
                  <Link to="/workouts" className="text-decoration-none">
                    <div className="card custom-card home-card">
                      <div className="card-body text-center">
                        <div className="home-card-icon">💪</div>
                        <h3 className="card-title mt-3">Workouts</h3>
                        <p className="card-text">Discover personalized workout suggestions</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="mt-5">
                <Link to="/activities" className="btn btn-primary btn-lg me-3">Get Started</Link>
                <Link to="/leaderboard" className="btn btn-outline-primary btn-lg">View Leaderboard</Link>
              </div>
            </div>
          } />
          <Route path="/activities" element={<Activities />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users" element={<Users />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
