import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getApplications,
  getCandidates,
  getJobs,
  updateApplication,
} from '../services/api.js'
import { APPLICATION_STATUSES } from '../utils/constants.js'
import { sameId } from '../utils/format.js'
import ApplicationCard from '../components/ApplicationCard.jsx'
import './Applications.css'

function Applications() {
  const [applications, setApplications] = useState([])
  const [candidates, setCandidates] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [updatingId, setUpdatingId] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  const [statusFilter, setStatusFilter] = useState('')
  const [jobFilter, setJobFilter] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadData() {
      try {
        setLoading(true)
        setError('')
        const [applicationsData, candidatesData, jobsData] = await Promise.all([
          getApplications(),
          getCandidates(),
          getJobs(),
        ])
        if (!ignore) {
          setApplications(applicationsData)
          setCandidates(candidatesData)
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
  }, [reloadCount])

  // PUT /applications/:id  (the whole record is sent with the new status)
  async function handleStatusChange(applicationId, newStatus) {
    const original = applications.find((app) => sameId(app.id, applicationId))
    if (!original) return

    try {
      setUpdatingId(applicationId)
      setMessage({ type: '', text: '' })
      const saved = await updateApplication(applicationId, { ...original, status: newStatus })
      setApplications((previous) =>
        previous.map((app) => (sameId(app.id, applicationId) ? saved : app))
      )
      setMessage({ type: 'success', text: `Application status changed to ${newStatus}.` })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setUpdatingId(null)
    }
  }

  // Join the three resources using their ids. A missing record becomes null
  // and ApplicationCard shows a friendly fallback instead of crashing.
  const combined = applications
    .map((app) => ({
      ...app,
      candidate: candidates.find((person) => sameId(person.id, app.candidateId)) || null,
      job: jobs.find((job) => sameId(job.id, app.jobId)) || null,
    }))
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))

  const visible = combined.filter((app) => {
    if (statusFilter && app.status !== statusFilter) return false
    if (jobFilter && !sameId(app.jobId, jobFilter)) return false
    return true
  })

  const filtersActive = statusFilter !== '' || jobFilter !== ''

  return (
    <div className="applications">
      <div className="applications-head">
        <div>
          <h1>Applications</h1>
          <p>Review candidates and update their hiring status.</p>
        </div>
        <Link to="/recruiter" className="applications-back">
          ← Dashboard
        </Link>
      </div>

      <div className="applications-filters">
        <div className="applications-field">
          <label htmlFor="ap-status">Status</label>
          <select id="ap-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All statuses</option>
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="applications-field applications-grow">
          <label htmlFor="ap-job">Job title</label>
          <select id="ap-job" value={jobFilter} onChange={(event) => setJobFilter(event.target.value)}>
            <option value="">All jobs</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="applications-reset"
          onClick={() => {
            setStatusFilter('')
            setJobFilter('')
          }}
        >
          Reset
        </button>
      </div>

      {message.text && (
        <div className={`applications-alert applications-alert-${message.type}`}>{message.text}</div>
      )}

      {loading && (
        <div className="applications-state">
          <div className="applications-spinner" aria-hidden="true"></div>
          <p>Loading applications...</p>
        </div>
      )}

      {!loading && error && (
        <div className="applications-state applications-state-error">
          <p>⚠️ {error}</p>
          <button type="button" className="applications-reset" onClick={() => setReloadCount(reloadCount + 1)}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="applications-state">
          <h3>No applications found</h3>
          <p>
            {filtersActive
              ? 'No applications match the selected filters.'
              : 'No candidate has applied yet.'}
          </p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <>
          <p className="applications-count">
            Showing {visible.length} of {combined.length} applications
          </p>
          <div className="applications-list">
            {visible.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                mode="recruiter"
                onStatusChange={handleStatusChange}
                updating={sameId(updatingId, app.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Applications
