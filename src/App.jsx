import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import RoleGuard from './components/RoleGuard.jsx'
import Home from './pages/Home.jsx'
import JobDetails from './pages/JobDetails.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ManageJobs from './pages/ManageJobs.jsx'
import EditJob from './pages/EditJob.jsx'
import Applications from './pages/Applications.jsx'
import CandidateApplications from './pages/CandidateApplications.jsx'


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/recruiter"
              element={
                <RoleGuard role="recruiter">
                  <Dashboard />
                </RoleGuard>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <RoleGuard role="recruiter">
                  <ManageJobs />
                </RoleGuard>
              }
            />
            <Route
              path="/recruiter/jobs/:id/edit"
              element={
                <RoleGuard role="recruiter">
                  <EditJob />
                </RoleGuard>
              }
            />
            <Route
              path="/applications"
              element={
                <RoleGuard role="recruiter">
                  <Applications />
                </RoleGuard>
              }
            />
            <Route
              path="/my-applications"
              element={
                <RoleGuard role="candidate">
                  <CandidateApplications />
                </RoleGuard>
              }
            />

            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
                  <h1>Page not found</h1>
                  <p>The page you are looking for does not exist.</p>
                  <Link to="/">Back to Home</Link>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
