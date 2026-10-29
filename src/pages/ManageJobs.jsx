import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { deleteJob, getJobs } from '../services/api.js'
import { formatDate, formatExperience } from '../utils/format.js'
import SearchFilters from '../components/SearchFilters.jsx'
import JobForm from '../components/JobForm.jsx'
import './ManageJobs.css'

const emptyFilters = { keyword: '', location: '', experience: '', jobType: '' }

function ManageJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const location = useLocation()
  // EditJob navigates back here with a success message in the router state
  const [message, setMessage] = useState(
    location.state && location.state.message
      ? { type: 'success', text: location.state.message }
      : { type: '', text: '' }
  )
  const [filters, setFilters] = useState(emptyFilters)
  const [reloadCount, setReloadCount] = useState(0)

  // formMode: 'closed' | 'add'  (only used for posting a new job)
  const [formMode, setFormMode] = useState('closed')

  // GET /jobs - runs on first load and again whenever reloadCount changes
  useEffect(() => {
    let ignore = false

    async function loadJobs() {
      try {
        setLoading(true)
        setError('')
        const data = await getJobs()
        if (!ignore) setJobs(data)
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadJobs()
    return () => {
      ignore = true
    }
  }, [reloadCount])

  function refreshJobs() {
    setReloadCount((count) => count + 1)
  }

  function openAddForm() {
    setFormMode('add')
    setMessage({ type: '', text: '' })
  }

  function closeForm() {
    setFormMode('closed')
  }

  // Called by JobForm after a successful POST (editing happens on /recruiter/jobs/:id/edit)
  function handleSaved(savedJob) {
    setMessage({ type: 'success', text: `"${savedJob.title}" was posted.` })
    closeForm()
    refreshJobs()
  }

  async function handleDelete(job) {
    const confirmed = window.confirm(`Delete "${job.title}" at ${job.company}? Applications for this job will also be removed. This cannot be undone.`)
    if (!confirmed) return

    try {
      await deleteJob(job.id)
      setMessage({ type: 'success', text: `"${job.title}" was deleted.` })
      refreshJobs()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  function handleFilterChange(field, value) {
    setFilters((previous) => ({ ...previous, [field]: value }))
  }

  const keyword = filters.keyword.trim().toLowerCase()
  const locationText = filters.location.trim().toLowerCase()

  const filteredJobs = jobs.filter((job) => {
    const searchable = [job.title, job.company, ...(job.skills || [])].join(' ').toLowerCase()
    if (keyword && !searchable.includes(keyword)) return false
    if (locationText && !job.location.toLowerCase().includes(locationText)) return false
    if (filters.experience !== '' && Number(job.experience) > Number(filters.experience)) return false
    if (filters.jobType && job.jobType !== filters.jobType) return false
    return true
  })

  return (
    <div className="managejobs">
      <div className="managejobs-head">
        <div>
          <h1>Manage Jobs</h1>
          <p>Post, edit and remove job vacancies.</p>
        </div>
        <div className="managejobs-head-actions">
          <Link to="/recruiter" className="managejobs-btn managejobs-btn-outline">
            ← Dashboard
          </Link>
          <button type="button" className="managejobs-btn managejobs-btn-solid" onClick={openAddForm}>
            + Post New Job
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`managejobs-alert managejobs-alert-${message.type}`}>{message.text}</div>
      )}

      {formMode !== 'closed' && (
        <div className="managejobs-form">
          <JobForm onSaved={handleSaved} onCancel={closeForm} />
        </div>
      )}

      <SearchFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(emptyFilters)}
        keywordPlaceholder="Search posted jobs"
      />

      {loading && (
        <div className="managejobs-state">
          <div className="managejobs-spinner" aria-hidden="true"></div>
          <p>Loading jobs...</p>
        </div>
      )}

      {!loading && error && (
        <div className="managejobs-state managejobs-state-error">
          <p>⚠️ {error}</p>
          <button type="button" className="managejobs-btn managejobs-btn-solid" onClick={refreshJobs}>
            Try again
          </button>
        </div>
      )}

      {!loading && !error && filteredJobs.length === 0 && (
        <div className="managejobs-state">
          <h3>No jobs to show</h3>
          <p>{jobs.length === 0 ? 'Post your first job to get started.' : 'No jobs match your filters.'}</p>
        </div>
      )}

      {!loading && !error && filteredJobs.length > 0 && (
        <div className="managejobs-table-wrap">
          <table className="managejobs-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Type</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id}>
                  <td data-label="Title">
                    <strong>{job.title}</strong>
                    <div className="managejobs-salary">{job.salary}</div>
                  </td>
                  <td data-label="Company">{job.company}</td>
                  <td data-label="Location">{job.location}</td>
                  <td data-label="Experience">{formatExperience(job.experience)}</td>
                  <td data-label="Type">
                    <span className="managejobs-badge">{job.jobType}</span>
                  </td>
                  <td data-label="Posted">{formatDate(job.createdAt)}</td>
                  <td data-label="Actions">
                    <div className="managejobs-row-actions">
                      <Link to={`/jobs/${job.id}`} className="managejobs-small">
                        View
                      </Link>
                      <Link to={`/recruiter/jobs/${job.id}/edit`} className="managejobs-small">
                        Edit
                      </Link>
                      <button type="button" className="managejobs-small managejobs-small-danger" onClick={() => handleDelete(job)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageJobs
