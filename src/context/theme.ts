import { createContext } from 'react'

export const THEME_STORAGE_KEY = 'algoscope-theme'

export interface ThemeContextType {
  theme: string
  isDark: boolean
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextType | null>(null)
