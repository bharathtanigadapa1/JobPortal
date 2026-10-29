// Values shared by several components

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote']

export const APPLICATION_STATUSES = ['Pending', 'Shortlisted', 'Rejected', 'Hired']

// Candidate-friendly experience filter: show jobs that need UP TO this many years
export const EXPERIENCE_OPTIONS = [
  { value: '0', label: 'Fresher (0 years)' },
  { value: '1', label: 'Up to 1 year' },
  { value: '2', label: 'Up to 2 years' },
  { value: '3', label: 'Up to 3 years' },
  { value: '5', label: 'Up to 5 years' },
]

// DEMO ONLY: the recruiter "login" is a shared passcode. This is NOT real security.
export const RECRUITER_DEMO_PASSCODE = 'recruiter123'
