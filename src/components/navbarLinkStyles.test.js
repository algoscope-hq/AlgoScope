import { describe, expect, it } from 'vitest'
import { getNavLinkClasses } from './navbarLinkStyles'

describe('getNavLinkClasses', () => {
  it('returns active-state styling for the current link', () => {
    const classes = getNavLinkClasses({ isActive: true })

    expect(classes).toContain('bg-indigo-500/10')
    expect(classes).toContain('text-indigo-600')
    expect(classes).toContain('rounded-full')
    expect(classes).toContain('before:scale-x-100')
  })

  it('returns hover styling for inactive links', () => {
    const classes = getNavLinkClasses({ isActive: false })

    expect(classes).toContain('hover:bg-white/70')
    expect(classes).toContain('text-slate-600')
    expect(classes).toContain('hover:-translate-y-0.5')
  })
})
