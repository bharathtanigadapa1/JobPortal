import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { addCandidate, getCandidates } from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { parseSkills } from '../utils/format.js'
import './Register.css'

const initialValues = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  experience: '',
  skills: '',
  resumeUrl: '',
}

function Register() {
  const navigate = useNavigate()
  const { loginCandidate } = useAuth()

  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)

  // After a successful registration, wait a moment and go to the home page
  useEffect(() => {
    if (!success) return undefined
    const timer = setTimeout(() => navigate('/'), 1500)
    return () => clearTimeout(timer)
  }, [success, navigate])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  function validate() {
    const newErrors = {}
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phonePattern = /^[6-9]\d{9}$/ // 10-digit Indian mobile number

    if (!values.name.trim()) newErrors.name = 'Full name is required.'

    if (!values.email.trim()) newErrors.email = 'Email is required.'
    else if (!emailPattern.test(values.email.trim())) newErrors.email = 'Enter a valid email address.'

    if (!values.phone.trim()) newErrors.phone = 'Phone number is required.'
    else if (!phonePattern.test(values.phone.trim())) {
      newErrors.phone = 'Enter a valid 10-digit mobile number.'
    }

    if (!values.password) newErrors.password = 'Password is required.'
    else if (values.password.length < 6) newErrors.password = 'Password must be at least 6 characters.'

    if (!values.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.'
    else if (values.confirmPassword !== values.password) {
      newErrors.confirmPassword = 'Passwords do not match.'
    }

    if (values.experience.trim() === '') newErrors.experience = 'Experience is required (use 0 for fresher).'
    else if (Number.isNaN(Number(values.experience)) || Number(values.experience) < 0) {
      newErrors.experience = 'Enter a valid number of years.'
    }

    if (parseSkills(values.skills).length === 0) newErrors.skills = 'Enter at least one skill.'

    if (values.resumeUrl.trim() && !/^https?:\/\/\S+$/i.test(values.resumeUrl.trim())) {
      newErrors.resumeUrl = 'Resume link must start with http:// or https://'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setSuccess('')

    if (!validate()) return

    try {
      setSaving(true)

      // Prevent duplicate email registration
      const candidates = await getCandidates()
      const emailTaken = candidates.some(
        (person) => person.email.toLowerCase() === values.email.trim().toLowerCase()
      )
      if (emailTaken) {
        setErrors({ email: 'This email is already registered. Please log in instead.' })
        return
      }

      const saved = await addCandidate({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone.trim(),
        password: values.password, // DEMO ONLY - see the note on this page
        experience: Number(values.experience),
        skills: parseSkills(values.skills),
        resumeUrl: values.resumeUrl.trim(),
      })

      loginCandidate(saved) // log the new candidate in straight away
      setSuccess('Registration successful! Redirecting you to the home page...')
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="register">
      <div className="register-card">
        <h1>Create your candidate account</h1>
        <p className="register-sub">Register once and apply to jobs in one click.</p>

        {success && <div className="register-alert register-alert-success">{success}</div>}
        {submitError && <div className="register-alert register-alert-error">{submitError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="register-grid">
            <div className="register-field register-full">
              <label htmlFor="rg-name">Full name *</label>
              <input id="rg-name" name="name" value={values.name} onChange={handleChange} placeholder="e.g. Priya Sharma" />
              {errors.name && <span className="register-error">{errors.name}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-email">Email *</label>
              <input id="rg-email" name="email" type="email" value={values.email} onChange={handleChange} placeholder="you@example.com" />
              {errors.email && <span className="register-error">{errors.email}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-phone">Phone number *</label>
              <input id="rg-phone" name="phone" value={values.phone} onChange={handleChange} placeholder="10-digit mobile number" maxLength="10" />
              {errors.phone && <span className="register-error">{errors.phone}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-password">Password *</label>
              <input id="rg-password" name="password" type="password" value={values.password} onChange={handleChange} autoComplete="new-password" />
              {errors.password && <span className="register-error">{errors.password}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-confirm">Confirm password *</label>
              <input id="rg-confirm" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} autoComplete="new-password" />
              {errors.confirmPassword && <span className="register-error">{errors.confirmPassword}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-experience">Experience (years) *</label>
              <input id="rg-experience" name="experience" type="number" min="0" value={values.experience} onChange={handleChange} placeholder="0 for fresher" />
              {errors.experience && <span className="register-error">{errors.experience}</span>}
            </div>

            <div className="register-field">
              <label htmlFor="rg-skills">Skills * (comma separated)</label>
              <input id="rg-skills" name="skills" value={values.skills} onChange={handleChange} placeholder="React, JavaScript, CSS" />
              {errors.skills && <span className="register-error">{errors.skills}</span>}
            </div>

            <div className="register-field register-full">
              <label htmlFor="rg-resume">Resume link (optional)</label>
              <input id="rg-resume" name="resumeUrl" value={values.resumeUrl} onChange={handleChange} placeholder="https://drive.google.com/..." />
              {errors.resumeUrl && <span className="register-error">{errors.resumeUrl}</span>}
            </div>
          </div>

          <button type="submit" className="register-submit" disabled={saving || Boolean(success)}>
            {saving ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="register-switch">
          Already registered? <Link to="/login">Log in</Link>
        </p>


      </div>
    </div>
  )
}

export default Register
