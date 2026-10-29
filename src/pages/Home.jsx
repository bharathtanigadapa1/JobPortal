import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { getApplications, getJobs } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { sameId } from '../utils/format.js'
import SearchFilters from '../components/SearchFilters.jsx'
import JobCard from '../components/JobCard.jsx'
import './Home.css'

const emptyFilters = { keyword: '', location: '', experience: '', jobType: '' }

function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const { candidate } = useAuth()

  const [jobs, setJobs] = useState([])
  const [appliedJobIds, setAppliedJobIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [reloadCount, setReloadCount] = useState(0)

  // Load all jobs from JSON Server
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

  // If a candidate is logged in, remember which jobs they already applied to
  useEffect(() => {
    let ignore = false

    async function loadApplied() {
      if (!candidate) {
        setAppliedJobIds([])
        return
      }
      try {
        const applications = await getApplications()
        if (!ignore) {
          setAppliedJobIds(
            applications.filter((app) => sameId(app.candidateId, candidate.id)).map((app) => app.jobId)
          )
        }
      } catch (err) {
        // The "Applied" badge is a nice extra, so a failure here is not shown
      }
    }

    loadApplied()
    return () => {
      ignore = true
    }
  }, [candidate])

  // Scroll to the jobs section when the URL is /#jobs (the "Find Jobs" link)
  useEffect(() => {
    if (location.hash === '#jobs' && !loading) {
      const section = document.getElementById('jobs')
      if (section) section.scrollIntoView()
    }
  }, [location.hash, loading])

  function handleFilterChange(field, value) {
    setFilters((previous) => ({ ...previous, [field]: value }))
  }

  function handleReset() {
    setFilters(emptyFilters)
  }

  // Filtering runs on the jobs that were loaded from the API
  const keyword = filters.keyword.trim().toLowerCase()
  const locationText = filters.location.trim().toLowerCase()

  const filteredJobs = jobs
    .filter((job) => {
      const searchable = [job.title, job.company, ...(job.skills || [])].join(' ').toLowerCase()
      if (keyword && !searchable.includes(keyword)) return false
      if (locationText && !job.location.toLowerCase().includes(locationText)) return false
      if (filters.experience !== '' && Number(job.experience) > Number(filters.experience)) return false
      if (filters.jobType && job.jobType !== filters.jobType) return false
      return true
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first

  const filtersActive = Object.values(filters).some((value) => value !== '')

  function viewDetails(job) {
    navigate(`/jobs/${job.id}`)
  }

  function applyNow(job) {
    // The application itself is submitted on the details page
    navigate(`/jobs/${job.id}`, { state: { fromApply: true } })
  }

  return (
    <div className="home">
      {/* ---------- Hero ---------- */}
      <section className="home-hero">
        <div className="home-hero-inner">
          <h1>Find Your Dream Job</h1>
          <p>
            Discover thousands of opportunities from growing companies, apply in a few clicks and
            track every application in one place.
          </p>
          <SearchFilters filters={filters} onChange={handleFilterChange} onReset={handleReset} />
        </div>
      </section>

      {/* ---------- Job listings ---------- */}
      <section className="home-section" id="jobs">
        <div className="home-section-head">
          <h2>{filtersActive ? 'Search results' : 'Recently posted jobs'}</h2>
          {!loading && !error && (
            <span className="home-count">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </span>
          )}
        </div>

        {loading && (
          <div className="home-state">
            <div className="home-spinner" aria-hidden="true"></div>
            <p>Loading jobs...</p>
          </div>
        )}

        {!loading && error && (
          <div className="home-state home-state-error">
            <p>⚠️ {error}</p>
            <button type="button" className="home-btn home-btn-solid" onClick={() => setReloadCount(reloadCount + 1)}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && filteredJobs.length === 0 && (
          <div className="home-state">
            <div className="home-empty-icon">🔍</div>
            <h3>No jobs found</h3>
            <p>
              {filtersActive
                ? 'Try changing or clearing your filters.'
                : 'No jobs have been posted yet. Please check back soon.'}
            </p>
            {filtersActive && (
              <button type="button" className="home-btn home-btn-outline" onClick={handleReset}>
                Clear filters
              </button>
            )}
          </div>
        )}

        {!loading && !error && filteredJobs.length > 0 && (
          <div className="home-grid">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                applied={appliedJobIds.some((id) => sameId(id, job.id))}
                onViewDetails={viewDetails}
                onApply={applyNow}
              />
            ))}
          </div>
        )}
      </section>

      {/* ---------- How it works ---------- */}
      <section className="home-section home-how">
        <h2 className="home-center">How JobPortal works</h2>
        <div className="home-steps">
          <div className="home-step">
            <div className="home-step-number">1</div>
            <h3>Create your profile</h3>
            <p>Register as a candidate with your experience and skills in under a minute.</p>
          </div>
          <div className="home-step">
            <div className="home-step-number">2</div>
            <h3>Search and apply</h3>
            <p>Filter jobs by title, location and experience, then apply with one click.</p>
          </div>
          <div className="home-step">
            <div className="home-step-number">3</div>
            <h3>Track your status</h3>
            <p>Follow every application as recruiters shortlist, reject or hire.</p>
          </div>
        </div>
      </section>

      {/* ---------- Recruiter call-to-action ---------- */}
      <section className="home-section">
        <div className="home-cta">
          <div>
            <h2>Hiring? Reach the right candidates.</h2>
            <p>Post vacancies, manage job listings and review applications from one dashboard.</p>
          </div>
          <Link to="/login" className="home-cta-btn">
            Recruiter Login
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
