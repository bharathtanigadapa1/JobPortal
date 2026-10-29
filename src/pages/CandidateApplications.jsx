import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getApplications, getJobs } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { sameId } from '../utils/format.js'
import ApplicationCard from '../components/ApplicationCard.jsx'
import './CandidateApplications.css'

function CandidateApplications() {
  const { candidate } = useAuth()

  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let ignore = false

    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [applicationsData, jobsData] = await Promise.all([getApplications(), getJobs()])
        if (!ignore) {
          // Only keep the applications that belong to the logged-in candidate
          setApplications(applicationsData.filter((app) => sameId(app.candidateId, candidate.id)))
          setJobs(jobsData)
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
  }, [candidate.id, reloadCount])

  const rows = applications
    .map((app) => ({
      ...app,
      candidate: null,
      job: jobs.find((job) => sameId(job.id, app.jobId)) || null,
    }))
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  return (
    <div className="myapps">
      <div className="myapps-head">
        <h1>My Applications</h1>
        <p>Hello {candidate.name}, here is the status of every job you applied for.</p>
      </div>

      {loading && (
        <div className="myapps-state">
          <div className="myapps-spinner" aria-hidden="true"></div>
          <p>Loading your applications...</p>
        </div>
      )}

      {!loading && error && (
        <div className="myapps-state myapps-state-error">
          <p>⚠️ {error}</p>
          <button type="button" className="myapps-btn" onClick={() => setReloadCount(reloadCount + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div className="myapps-state">
          <div className="myapps-empty-icon">📝</div>
          <h3>You have not applied to any jobs yet</h3>
          <p>Browse open positions and apply to get started.</p>
          <Link to="/#jobs" className="myapps-btn">
            Find Jobs
          </Link>
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <div className="myapps-list">
          {rows.map((app) => (
            <ApplicationCard key={app.id} application={app} mode="candidate" />
          ))}
        </div>
      )}
    </div>
  )
}

export default CandidateApplications
