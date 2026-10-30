import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import './Navbar.css'

function Navbar() {
  const { role, candidate, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function closeMenu() {
    setMenuOpen(false)
  }

  function handleLogout() {
    logout()
    closeMenu()
    navigate('/')
  }

  
  const linkClass = ({ isActive }) => (isActive ? 'navbar-link active' : 'navbar-link')

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-mark">J</span>
          JobPortal
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={menuOpen ? 'navbar-menu open' : 'navbar-menu'}>
          <NavLink to="/" end className={linkClass} onClick={closeMenu}>
            Home
          </NavLink>
          <Link to="/#jobs" className="navbar-link" onClick={closeMenu}>
            Find Jobs
          </Link>

          {role === 'recruiter' && (
            <>
              <NavLink to="/recruiter" end className={linkClass} onClick={closeMenu}>
                Dashboard
              </NavLink>
              <NavLink to="/recruiter/jobs" className={linkClass} onClick={closeMenu}>
                Manage Jobs
              </NavLink>
              <NavLink to="/applications" className={linkClass} onClick={closeMenu}>
                Applications
              </NavLink>
            </>
          )}

          {role === 'candidate' && (
            <NavLink to="/my-applications" className={linkClass} onClick={closeMenu}>
              My Applications
            </NavLink>
          )}

          <div className="navbar-actions">
            {role === null && (
              <>
                <NavLink to="/login" className="navbar-btn navbar-btn-outline" onClick={closeMenu}>
                  Login
                </NavLink>
                <NavLink to="/register" className="navbar-btn navbar-btn-solid" onClick={closeMenu}>
                  Register
                </NavLink>
              </>
            )}

            {role !== null && (
              <>
                <span className="navbar-user">
                  {role === 'recruiter' ? 'Recruiter (demo)' : candidate.name}
                </span>
                <button type="button" className="navbar-btn navbar-btn-outline" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
