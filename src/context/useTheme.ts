import { useContext } from 'react'
import { THEME_STORAGE_KEY, ThemeContext, ThemeContextType } from './theme'

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider')
  }

  return context
}
