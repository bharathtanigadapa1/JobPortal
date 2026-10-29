// Small formatting helpers

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

// "React, Node , CSS" -> ["React", "Node", "CSS"]
export function parseSkills(text) {
  return text
    .split(',')
    .map((skill) => skill.trim())
    .filter(Boolean)
}

// JSON Server may return ids as numbers (v0.17) or strings (v1), so compare as strings
export function sameId(a, b) {
  return String(a) === String(b)
}
