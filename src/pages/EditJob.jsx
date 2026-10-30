import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getJobById } from '../services/api.js'
import JobForm from '../components/JobForm.jsx'
import './EditJob.css'


function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let ignore = false

    async function loadJob() {
      try {
        setLoading(true)
        setError('')
        setNotFound(false)
        const data = await getJobById(id)
        if (!ignore) setJob(data)
      } catch (err) {
        if (!ignore) {
          if (err.status === 404) setNotFound(true)
          else setError(err.message)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadJob()
    return () => {
      ignore = true
    }
  }, [id])

  function handleSaved(savedJob) {
    navigate('/recruiter/jobs', { state: { message: `"${savedJob.title}" was updated.` } })
  }

  return (
    <div className="editjob">
      <Link to="/recruiter/jobs" className="editjob-back">
        ← Back to Manage Jobs
      </Link>

      {loading && (
        <div className="editjob-state">
          <div className="editjob-spinner" aria-hidden="true"></div>
          <p>Loading job...</p>
        </div>
      )}

      {!loading && notFound && (
        <div className="editjob-state">
          <h2>Job not found</h2>
          <p>This job does not exist or was already deleted.</p>
        </div>
      )}

      {!loading && error && (
        <div className="editjob-state editjob-state-error">
          <p>⚠️ {error}</p>
        </div>
      )}

      {!loading && job && (
        <JobForm initialData={job} onSaved={handleSaved} onCancel={() => navigate('/recruiter/jobs')} />
      )}
    </div>
  )
}

export default EditJob
