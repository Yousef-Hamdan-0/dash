export function getNextProjectId(projects: { id: string }[]): string {
  const highest = projects.reduce((max, project) => {
    const match = project.id.match(/^p(\d+)$/i)
    if (!match) return max

    const value = Number(match[1])
    return Number.isFinite(value) ? Math.max(max, value) : max
  }, 0)

  return `P${highest + 1}`
}
