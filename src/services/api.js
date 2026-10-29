

const API_URL = "https://jobportal-xbvf.onrender.com";
async function request(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    })
  } catch (networkError) {
    // fetch() only throws when the server cannot be reached at all
    throw new Error(
      'Cannot reach the server. Start JSON Server with: npx json-server db.json --port 3000'
    )
  }

  if (!response.ok) {
    const error = new Error(
      response.status === 404
        ? 'The requested record was not found (404).'
        : `Request failed with status ${response.status}.`
    )
    error.status = response.status
    throw error
  }

  return response.json()
}

// Small helpers that build the options object for POST / PUT / DELETE
const post = (data) => ({ method: 'POST', body: JSON.stringify(data) })
const put = (data) => ({ method: 'PUT', body: JSON.stringify(data) })
const remove = () => ({ method: 'DELETE' })

/* ---------------------------- Jobs ---------------------------- */

export async function getJobs() {
  return request('/jobs')
}

export async function getJobById(id) {
  return request(`/jobs/${id}`)
}

export async function addJob(job) {
  return request('/jobs', post(job))
}

export async function updateJob(id, job) {
  return request(`/jobs/${id}`, put(job))
}

export async function deleteJob(id) {
  return request(`/jobs/${id}`, remove())
}

/* -------------------------- Candidates ------------------------- */

export async function getCandidates() {
  return request('/candidates')
}

export async function getCandidateById(id) {
  return request(`/candidates/${id}`)
}

export async function addCandidate(candidate) {
  return request('/candidates', post(candidate))
}

export async function updateCandidate(id, candidate) {
  return request(`/candidates/${id}`, put(candidate))
}

export async function deleteCandidate(id) {
  return request(`/candidates/${id}`, remove())
}

/* ------------------------- Applications ------------------------ */

export async function getApplications() {
  return request('/applications')
}

export async function getApplicationById(id) {
  return request(`/applications/${id}`)
}

export async function addApplication(application) {
  return request('/applications', post(application))
}

export async function updateApplication(id, application) {
  return request(`/applications/${id}`, put(application))
}

export async function deleteApplication(id) {
  return request(`/applications/${id}`, remove())
}
