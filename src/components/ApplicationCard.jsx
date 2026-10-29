import React from 'react'
import { Link } from 'react-router-dom'
import { APPLICATION_STATUSES } from '../utils/constants.js'
import { formatDate } from '../utils/format.js'
import './ApplicationCard.css'

function ApplicationCard({ application, mode = 'candidate', onStatusChange, updating = false }) {
  const { candidate, job } = application
  const statusClass = `appcard-status appcard-status-${application.status.toLowerCase()}`
  const resumeUrl = candidate?.resumeUrl || ''

  return (
    <article className="appcard">
      <div className="appcard-top">
        <div>
          <h3 className="appcard-title">
            {job ? <Link to={`/jobs/${job.id}`}>{job.title}</Link> : 'Job no longer available'}
          </h3>
          <p className="appcard-sub">
            {job ? job.company : 'This job posting was removed'}
            {mode === 'candidate' && job ? ` · 📍 ${job.location}` : ''}
          </p>
        </div>
        <span className={statusClass}>{application.status}</span>
      </div>

      {mode === 'recruiter' && (
        <div className="appcard-candidate">
          <div className="appcard-avatar">{candidate ? candidate.name.charAt(0).toUpperCase() : '?'}</div>
          <div>
            <strong>{candidate ? candidate.name : 'Candidate removed'}</strong>
            <div className="appcard-email">{candidate ? candidate.email : '—'}</div>
          </div>
        </div>
      )}

      {application.coverLetter && (
        <p className="appcard-letter">“{application.coverLetter}”</p>
      )}

      {mode === 'recruiter' && (
        <div className="appcard-resume">
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="appcard-resume-link"
            >
              📄 View Resume
            </a>
          ) : (
            <span className="appcard-resume-missing">No resume uploaded</span>
          )}
        </div>
      )}

      <div className="appcard-bottom">
        <span className="appcard-date">Applied on {formatDate(application.appliedAt)}</span>

        {mode === 'recruiter' && (
          <label className="appcard-select-wrap">
            <span>Status</span>
            <select
              value={application.status}
              disabled={updating}
              onChange={(event) => onStatusChange(application.id, event.target.value)}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
    </article>
  )
}

export default ApplicationCard