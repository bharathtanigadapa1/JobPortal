import React, { useState, useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { addApplication, getApplications, getJobById } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate, formatExperience, sameId } from '../utils/format.js'
import './JobDetails.css'

function JobDetails() {
  const { id } = useParams() 
  const location = useLocation()
  const { role, candidate } = useAuth()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')
  const [applyError, setApplyError] = useState('')

  
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

  
  useEffect(() => {
    let ignore = false

    async function checkApplied() {
      setAlreadyApplied(false)
      if (!candidate) return
      try {
        const applications = await getApplications()
        const found = applications.some(
          (app) => sameId(app.jobId, id) && sameId(app.candidateId, candidate.id)
        )
        if (!ignore) setAlreadyApplied(found)
      } catch (err) {
        
      }
    }

    checkApplied()
    return () => {
      ignore = true
    }
  }, [id, candidate])

  
  useEffect(() => {
    if (job && location.state && location.state.fromApply) {
      const box = document.getElementById('apply-section')
      if (box) box.scrollIntoView()
    }
  }, [job, location.state])

  async function handleApply(event) {
    event.preventDefault()
    setApplyError('')
    setSuccess('')

    try {
      setSubmitting(true)

      
      const applications = await getApplications()
      const duplicate = applications.some(
        (app) => sameId(app.jobId, job.id) && sameId(app.candidateId, candidate.id)
      )
      if (duplicate) {
        setAlreadyApplied(true)
        setApplyError('You have already applied for this job.')
        return
      }

      await addApplication({
        jobId: job.id,
        candidateId: candidate.id,
        appliedAt: new Date().toISOString(),
        status: 'Pending',
        coverLetter: coverLetter.trim(),
      })

      setAlreadyApplied(true)
      setCoverLetter('')
      setSuccess('Your application has been submitted successfully!')
    } catch (err) {
      setApplyError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="jobdetails">
        <div className="jobdetails-state">
          <div className="jobdetails-spinner" aria-hidden="true"></div>
          <p>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="jobdetails">
        <div className="jobdetails-state">
          <h2>Job not found</h2>
          <p>This job does not exist or has been removed.</p>
          <Link to="/" className="jobdetails-link-btn">
            Browse all jobs
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="jobdetails">
        <div className="jobdetails-state jobdetails-state-error">
          <p>⚠️ {error}</p>
          <Link to="/" className="jobdetails-link-btn">
            Back to jobs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="jobdetails">
      <Link to="/#jobs" className="jobdetails-back">
        ← Back to all jobs
      </Link>

      <div className="jobdetails-layout">
        {/* ---------- Main column ---------- */}
        <article className="jobdetails-main">
          <div className="jobdetails-header">
            <div className="jobdetails-logo">{job.company.charAt(0).toUpperCase()}</div>
            <div>
              <h1>{job.title}</h1>
              <p className="jobdetails-company">{job.company}</p>
            </div>
          </div>

          <ul className="jobdetails-facts">
            <li>
              <span>Location</span>
              <strong>📍 {job.location}</strong>
            </li>
            <li>
              <span>Salary</span>
              <strong>💰 {job.salary}</strong>
            </li>
            <li>
              <span>Experience</span>
              <strong>💼 {formatExperience(job.experience)}</strong>
            </li>
            <li>
              <span>Job type</span>
              <strong>🕒 {job.jobType}</strong>
            </li>
          </ul>

          <h2>Job description</h2>
          <p className="jobdetails-description">{job.description}</p>

          <h2>Skills required</h2>
          <div className="jobdetails-skills">
            {(job.skills || []).map((skill) => (
              <span key={skill} className="jobdetails-skill">
                {skill}
              </span>
            ))}
          </div>

          <p className="jobdetails-posted">Posted on {formatDate(job.createdAt)}</p>
        </article>

        {/* ---------- Apply column ---------- */}
        <aside className="jobdetails-side" id="apply-section">
          <h2>Apply for this job</h2>

          {success && <div className="jobdetails-alert jobdetails-alert-success">{success}</div>}
          {applyError && <div className="jobdetails-alert jobdetails-alert-error">{applyError}</div>}

          {role === 'recruiter' && (
            <p className="jobdetails-note">
              You are logged in as a recruiter. Only candidates can apply for jobs.
            </p>
          )}

          {role === null && (
            <>
              <p className="jobdetails-note">Please log in or register as a candidate to apply.</p>
              <div className="jobdetails-buttons">
                <Link to="/login" className="jobdetails-btn jobdetails-btn-solid">
                  Login
                </Link>
                <Link to="/register" className="jobdetails-btn jobdetails-btn-outline">
                  Register
                </Link>
              </div>
            </>
          )}

          {role === 'candidate' && alreadyApplied && (
            <div className="jobdetails-applied">
              <strong>✓ You have applied for this job.</strong>
              <Link to="/my-applications">Track your application</Link>
            </div>
          )}

          {role === 'candidate' && !alreadyApplied && (
            <form onSubmit={handleApply}>
              <p className="jobdetails-note">
                Applying as <strong>{candidate.name}</strong> ({candidate.email})
              </p>
              <label htmlFor="jd-cover">Cover letter (optional)</label>
              <textarea
                id="jd-cover"
                rows="5"
                placeholder="Tell the recruiter why you are a great fit"
                value={coverLetter}
                onChange={(event) => setCoverLetter(event.target.value)}
              />
              <button type="submit" className="jobdetails-btn jobdetails-btn-solid jobdetails-full" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Apply Now'}
              </button>
            </form>
          )}
        </aside>
      </div>
    </div>
  )
}

export default JobDetails
