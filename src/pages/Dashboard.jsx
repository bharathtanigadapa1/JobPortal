import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApplications, getCandidates, getJobs } from '../services/api.js'
import './Dashboard.css'

function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [candidates, setCandidates] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  // Fetch all three resources in parallel. Statistics are recalculated from this
  // data every time the page opens, so they always match db.json.
  useEffect(() => {
    let ignore = false

    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [jobsData, candidatesData, applicationsData] = await Promise.all([
          getJobs(),
          getCandidates(),
          getApplications(),
        ])
        if (!ignore) {
          setJobs(jobsData)
          setCandidates(candidatesData)
          setApplications(applicationsData)
        }
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadData()
    return () => {
      ignore = true
    }
  }, [reloadCount])

  // Dashboard calculations
  const countByStatus = (status) => applications.filter((app) => app.status === status).length

  const stats = [
    { label: 'Total Jobs', value: jobs.length, icon: '💼', tone: 'blue' },
    { label: 'Total Candidates', value: candidates.length, icon: '👥', tone: 'blue' },
    { label: 'Total Applications', value: applications.length, icon: '📄', tone: 'blue' },
    { label: 'Pending', value: countByStatus('Pending'), icon: '⏳', tone: 'amber' },
    { label: 'Shortlisted', value: countByStatus('Shortlisted'), icon: '⭐', tone: 'indigo' },
    { label: 'Hired', value: countByStatus('Hired'), icon: '✅', tone: 'green' },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-head">
        <div>
          <h1>Recruiter Dashboard</h1>
          <p>Overview of jobs, candidates and applications.</p>
        </div>
        <div className="dashboard-links">
          <Link to="/recruiter/jobs" className="dashboard-btn dashboard-btn-solid">
            Manage Jobs
          </Link>
          <Link to="/applications" className="dashboard-btn dashboard-btn-outline">
            Review Applications
          </Link>
        </div>
      </div>

      {loading && (
        <div className="dashboard-state">
          <div className="dashboard-spinner" aria-hidden="true"></div>
          <p>Loading statistics...</p>
        </div>
      )}

      {!loading && error && (
        <div className="dashboard-state dashboard-state-error">
          <p>⚠️ {error}</p>
          <button type="button" className="dashboard-btn dashboard-btn-solid" onClick={() => setReloadCount(reloadCount + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="dashboard-stats">
            {stats.map((stat) => (
              <div key={stat.label} className={`dashboard-stat dashboard-stat-${stat.tone}`}>
                <span className="dashboard-stat-icon">{stat.icon}</span>
                <div>
                  <div className="dashboard-stat-value">{stat.value}</div>
                  <div className="dashboard-stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {applications.length === 0 ? (
            <div className="dashboard-state">
              <div className="dashboard-empty-icon">📭</div>
              <h3>No applications yet</h3>
              <p>Applications will appear here once candidates start applying.</p>
            </div>
          ) : (
            <div className="dashboard-panel">
              <h2>Application pipeline</h2>
              {['Pending', 'Shortlisted', 'Rejected', 'Hired'].map((status) => {
                const count = countByStatus(status)
                const percent = Math.round((count / applications.length) * 100)
                return (
                  <div key={status} className="dashboard-bar-row">
                    <span className="dashboard-bar-label">{status}</span>
                    <div className="dashboard-bar">
                      <div
                        className={`dashboard-bar-fill dashboard-bar-${status.toLowerCase()}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="dashboard-bar-count">
                      {count} ({percent}%)
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
