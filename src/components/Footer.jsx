import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-about">
          <h3 className="footer-brand">JobPortal</h3>
          <p>
            A simple recruitment portal where candidates discover opportunities and recruiters
            hire the right talent.
          </p>
        </div>

        <div className="footer-links">
          <h4>Candidates</h4>
          <Link to="/#jobs">Find Jobs</Link>
          <Link to="/register">Register</Link>
          <Link to="/my-applications">My Applications</Link>
        </div>

        <div className="footer-links">
          <h4>Recruiters</h4>
          <Link to="/login">Recruiter Login</Link>
          <Link to="/recruiter/jobs">Manage Jobs</Link>
          <Link to="/applications">Applications</Link>
        </div>
      </div>

      <div className="footer-bottom">© {year} JobPortal. Academic capstone project.</div>
    </footer>
  )
}

export default Footer
