import React, { createContext, useContext, useState } from 'react'

// DEMO AUTHENTICATION
// The logged-in user is kept in sessionStorage so a page refresh does not log
// them out. JSON Server is NOT a secure backend, so this is only suitable for
// a classroom demo. The password is never stored in the session.

const AuthContext = createContext(null)
const STORAGE_KEY = 'jobportal_session'

function readSession() {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch (error) {
    return null
  }
}

export function AuthProvider({ children }) {
  // session looks like: { role: 'candidate', candidate: {id, name, email} } or { role: 'recruiter' }
  const [session, setSession] = useState(readSession)

  function saveSession(newSession) {
    setSession(newSession)
    if (newSession) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newSession))
    } else {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }

  function loginCandidate(candidate) {
    // Copy only the safe fields (no password)
    saveSession({
      role: 'candidate',
      candidate: { id: candidate.id, name: candidate.name, email: candidate.email },
    })
  }

  function loginRecruiter() {
    saveSession({ role: 'recruiter' })
  }

  function logout() {
    saveSession(null)
  }

  const value = {
    role: session ? session.role : null,
    candidate: session && session.role === 'candidate' ? session.candidate : null,
    loginCandidate,
    loginRecruiter,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return context
}
