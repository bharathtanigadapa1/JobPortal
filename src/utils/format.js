

export function formatDate(isoString) {
  if (!isoString) return '—'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatExperience(years) {
  const value = Number(years)
  if (!value) return 'Fresher'
  return value === 1 ? '1 year' : `${value} years`
}


export function parseSkills(text) {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}


export function sameId(a, b) {
  return String(a) === String(b)
}
