import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './RoleGuard.css'
// This if for role based access

function RoleGuard({ role, children }) {
  const { role: currentRole } = useAuth()

  if (currentRole === role) {
    return children
  }

  return (
    <div className="roleguard">
      <div className="roleguard-card">
        <div className="roleguard-icon">🔒</div>
        <h2>{role === 'recruiter' ? 'Recruiter access only' : 'Candidate access only'}</h2>
        <p>
          {currentRole
            ? `You are logged in as a ${currentRole}. Please log out and sign in as a ${role} to open this page.`
            : `Please log in as a ${role} to open this page.`}
        </p>
        <Link to="/login" className="roleguard-btn">
          Go to Login
        </Link>
      </div>
    </div>
  )
}

export default RoleGuard
