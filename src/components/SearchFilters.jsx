import React from 'react'
import { EXPERIENCE_OPTIONS, JOB_TYPES } from '../utils/constants.js'
import './SearchFilters.css'


function SearchFilters({
  filters,
  onChange,
  onReset,
  showLocation = true,
  showExperience = true,
  showJobType = true,
  keywordPlaceholder = 'Job title, company or skill',
}) {
  return (
    <form className="searchfilters" onSubmit={(event) => event.preventDefault()}>
      <div className="searchfilters-field searchfilters-grow">
        <label htmlFor="sf-keyword">Search</label>
        <input
          id="sf-keyword"
          type="text"
          placeholder={keywordPlaceholder}
          value={filters.keyword}
          onChange={(event) => onChange('keyword', event.target.value)}
        />
      </div>

      {showLocation && (
        <div className="searchfilters-field">
          <label htmlFor="sf-location">Location</label>
          <input
            id="sf-location"
            type="text"
            placeholder="City or Remote"
            value={filters.location}
            onChange={(event) => onChange('location', event.target.value)}
          />
        </div>
      )}

      {showExperience && (
        <div className="searchfilters-field">
          <label htmlFor="sf-experience">Experience</label>
          <select
            id="sf-experience"
            value={filters.experience}
            onChange={(event) => onChange('experience', event.target.value)}
          >
            <option value="">Any experience</option>
            {EXPERIENCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {showJobType && (
        <div className="searchfilters-field">
          <label htmlFor="sf-jobtype">Job type</label>
          <select
            id="sf-jobtype"
            value={filters.jobType}
            onChange={(event) => onChange('jobType', event.target.value)}
          >
            <option value="">All types</option>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      )}

      <button type="button" className="searchfilters-reset" onClick={onReset}>
        Reset
      </button>
    </form>
  )
}

export default SearchFilters
