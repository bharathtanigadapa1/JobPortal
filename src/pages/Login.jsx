import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCandidates } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { RECRUITER_DEMO_PASSCODE } from '../utils/constants.js'
import './Login.css'

// Two demo roles share this page:
//   Candidate -> email + password checked against the /candidates resource
//   Recruiter -> a documented demo passcode (there is no recruiter registration)
function Login() {
  const navigate = useNavigate()
  const { loginCandidate, loginRecruiter } = useAuth()

  const [tab, setTab] = useState('candidate')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function switchTab(newTab) {
    setTab(newTab)
    setError('')
  }

  async function handleCandidateLogin(event) {
    event.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setLoading(true)
      const candidates = await getCandidates()
      const match = candidates.find(
        (person) =>
          person.email.toLowerCase() === email.trim().toLowerCase() && person.password === password
      )

      if (!match) {
        setError('Incorrect email or password.')
        return
      }

      loginCandidate(match)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleRecruiterLogin(event) {
    event.preventDefault()
    setError('')

    if (passcode !== RECRUITER_DEMO_PASSCODE) {
      setError('Incorrect recruiter passcode.')
      return
    }

    loginRecruiter()
    navigate('/recruiter')
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1>Welcome back</h1>
        <p className="login-sub">Choose how you want to sign in.</p>

        <div className="login-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'candidate'}
            className={tab === 'candidate' ? 'login-tab active' : 'login-tab'}
            onClick={() => switchTab('candidate')}
          >
            Candidate
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'recruiter'}
            className={tab === 'recruiter' ? 'login-tab active' : 'login-tab'}
            onClick={() => switchTab('recruiter')}
          >
            Recruiter (demo)
          </button>
        </div>

        {error && <div className="login-alert">{error}</div>}

        {tab === 'candidate' && (
          <form onSubmit={handleCandidateLogin} noValidate>
            <div className="login-field">
              <label htmlFor="lg-email">Email</label>
              <input id="lg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="username" />
            </div>
            <div className="login-field">
              <label htmlFor="lg-password">Password</label>
              <input id="lg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
            </div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
            <p className="login-switch">
              New here? <Link to="/register">Create a candidate account</Link>
            </p>
            <div className="login-hint">
              <strong>Demo candidate:</strong> priya@example.com / demo123
            </div>
          </form>
        )}

        {tab === 'recruiter' && (
          <form onSubmit={handleRecruiterLogin} noValidate>
            <div className="login-field">
              <label htmlFor="lg-passcode">Recruiter passcode</label>
              <input id="lg-passcode" type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} />
            </div>
            <button type="submit" className="login-submit">
              Enter Recruiter Dashboard
            </button>
            <div className="login-hint">
              <strong>Demo passcode:</strong> {RECRUITER_DEMO_PASSCODE}
            </div>
          </form>
        )}

        <p className="login-note">
          <strong>Security note:</strong> JSON Server is not a secure authentication backend. This
          login is a classroom demo only and must not be used for real accounts or passwords.
        </p>
      </div>
    </div>
  )
}

export default Login
