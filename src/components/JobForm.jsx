import React, { useState, useEffect } from 'react'
import { addJob, updateJob } from '../services/api.js'
import { JOB_TYPES } from '../utils/constants.js'
import { parseSkills } from '../utils/format.js'
import './JobForm.css'

const emptyForm = {
  title: '',
  company: '',
  location: '',
  experience: '',
  salary: '',
  description: '',
  skills: '',
  jobType: 'Full-time',
}


function toFormValues(job) {
  return {
    title: job.title || '',
    company: job.company || '',
    location: job.location || '',
    experience: String(job.experience ?? ''),
    salary: job.salary || '',
    description: job.description || '',
    skills: (job.skills || []).join(', '),
    jobType: job.jobType || 'Full-time',
  }
}


function JobForm({ initialData = null, onSaved, onCancel }) {
  const isEdit = Boolean(initialData)
  const [values, setValues] = useState(initialData ? toFormValues(initialData) : emptyForm)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)


  useEffect(() => {
    setValues(initialData ? toFormValues(initialData) : emptyForm)
    setErrors({})
    setSubmitError('')
  }, [initialData])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    // Clear the error of the field being edited
    setErrors((previous) => ({ ...previous, [name]: '' }))
  }

  function validate() {
    const newErrors = {}

    if (!values.title.trim()) newErrors.title = 'Job title is required.'
    if (!values.company.trim()) newErrors.company = 'Company name is required.'
    if (!values.location.trim()) newErrors.location = 'Location is required.'
    if (!values.salary.trim()) newErrors.salary = 'Salary is required.'

    if (values.experience.trim() === '') {
      newErrors.experience = 'Experience is required.'
    } else if (Number.isNaN(Number(values.experience)) || Number(values.experience) < 0) {
      newErrors.experience = 'Enter a valid number of years (0 or more).'
    } else if (Number(values.experience) > 40) {
      newErrors.experience = 'Experience cannot be more than 40 years.'
    }

    if (values.description.trim().length < 20) {
      newErrors.description = 'Description must be at least 20 characters.'
    }

    if (parseSkills(values.skills).length === 0) {
      newErrors.skills = 'Enter at least one skill (separate with commas).'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')

    if (!validate()) return

    const jobData = {
      title: values.title.trim(),
      company: values.company.trim(),
      location: values.location.trim(),
      experience: Number(values.experience),
      salary: values.salary.trim(),
      description: values.description.trim(),
      skills: parseSkills(values.skills),
      jobType: values.jobType,
    }

    try {
      setSaving(true)
      let savedJob

      if (isEdit) {
       
        savedJob = await updateJob(initialData.id, { ...initialData, ...jobData })
      } else {
        savedJob = await addJob({ ...jobData, createdAt: new Date().toISOString() })
      }

      if (onSaved) onSaved(savedJob, isEdit)
      if (!isEdit) setValues(emptyForm)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="jobform" onSubmit={handleSubmit} noValidate>
      <h3 className="jobform-title">{isEdit ? 'Edit Job' : 'Post a New Job'}</h3>

      {submitError && <div className="jobform-alert">{submitError}</div>}

      <div className="jobform-grid">
        <div className="jobform-field">
          <label htmlFor="jf-title">Job title *</label>
          <input id="jf-title" name="title" value={values.title} onChange={handleChange} placeholder="e.g. Frontend Developer" />
          {errors.title && <span className="jobform-error">{errors.title}</span>}
        </div>

        <div className="jobform-field">
          <label htmlFor="jf-company">Company *</label>
          <input id="jf-company" name="company" value={values.company} onChange={handleChange} placeholder="e.g. TechNova Solutions" />
          {errors.company && <span className="jobform-error">{errors.company}</span>}
        </div>

        <div className="jobform-field">
          <label htmlFor="jf-location">Location *</label>
          <input id="jf-location" name="location" value={values.location} onChange={handleChange} placeholder="e.g. Hyderabad or Remote" />
          {errors.location && <span className="jobform-error">{errors.location}</span>}
        </div>

        <div className="jobform-field">
          <label htmlFor="jf-experience">Experience required (years) *</label>
          <input id="jf-experience" name="experience" type="number" min="0" step="1" value={values.experience} onChange={handleChange} placeholder="e.g. 2" />
          {errors.experience && <span className="jobform-error">{errors.experience}</span>}
        </div>

        <div className="jobform-field">
          <label htmlFor="jf-salary">Salary *</label>
          <input id="jf-salary" name="salary" value={values.salary} onChange={handleChange} placeholder="e.g. ₹6 – 10 LPA" />
          {errors.salary && <span className="jobform-error">{errors.salary}</span>}
        </div>

        <div className="jobform-field">
          <label htmlFor="jf-jobtype">Job type *</label>
          <select id="jf-jobtype" name="jobType" value={values.jobType} onChange={handleChange}>
            {JOB_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="jobform-field jobform-full">
          <label htmlFor="jf-skills">Skills * (comma separated)</label>
          <input id="jf-skills" name="skills" value={values.skills} onChange={handleChange} placeholder="React, JavaScript, CSS" />
          {errors.skills && <span className="jobform-error">{errors.skills}</span>}
        </div>

        <div className="jobform-field jobform-full">
          <label htmlFor="jf-description">Description *</label>
          <textarea id="jf-description" name="description" rows="5" value={values.description} onChange={handleChange} placeholder="Describe the role and responsibilities" />
          {errors.description && <span className="jobform-error">{errors.description}</span>}
        </div>
      </div>

      <div className="jobform-actions">
        {onCancel && (
          <button type="button" className="jobform-btn jobform-btn-outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
        )}
        <button type="submit" className="jobform-btn jobform-btn-solid" disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Update Job' : 'Post Job'}
        </button>
      </div>
    </form>
  )
}

export default JobForm
