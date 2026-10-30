import React from 'react'
import { formatDate, formatExperience } from '../utils/format.js'
import './JobCard.css'


function JobCard({ job, applied = false, onViewDetails, onApply }) {
  const skills = job.skills || []

  return (
    <article className="jobcard">
      <div className="jobcard-header">
        <div className="jobcard-logo">{job.company.charAt(0).toUpperCase()}</div>
        <div>
          <h3 className="jobcard-title">{job.title}</h3>
          <p className="jobcard-company">{job.company}</p>
        </div>
        <span className="jobcard-type">{job.jobType}</span>
      </div>

      <ul className="jobcard-meta">
        <li>📍 {job.location}</li>
        <li>💼 {formatExperience(job.experience)}</li>
        <li>💰 {job.salary}</li>
      </ul>

      {skills.length > 0 && (
        <div className="jobcard-skills">
          {skills.slice(0, 4).map((skill) => (
            <span key={skill} className="jobcard-skill">
              {skill}
            </span>
          ))}
          {skills.length > 4 && <span className="jobcard-skill">+{skills.length - 4}</span>}
        </div>
      )}

      <div className="jobcard-footer">
        <span className="jobcard-date">Posted {formatDate(job.createdAt)}</span>
        <div className="jobcard-actions">
          <button type="button" className="jobcard-btn jobcard-btn-outline" onClick={() => onViewDetails(job)}>
            View Details
          </button>
          {applied ? (
            <span className="jobcard-applied">✓ Applied</span>
          ) : (
            <button type="button" className="jobcard-btn jobcard-btn-solid" onClick={() => onApply(job)}>
              Apply Now
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default JobCard
