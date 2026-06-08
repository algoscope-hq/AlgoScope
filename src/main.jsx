import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import { simple } from '@clerk/themes'
import './input.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  // Non-fatal: allow local/CI runs without Clerk configured
  console.warn(
    'VITE_CLERK_PUBLISHABLE_KEY not set — running in unauthenticated dev mode'
  )
}

if (PUBLISHABLE_KEY) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        localization={{
          signIn: {
            start: {
              title: 'Sign In to AlgoScope!',
              subtitle: 'Welcome!',
            },
          },
        }}
        afterSignOutUrl="/"
        appearance={{
          baseTheme: simple,
          variables: {
            colorPrimary: 'var(--clerk-primary)',
            colorText: 'var(--clerk-text)',
            colorTextSecondary: 'var(--clerk-text-secondary)',
            colorBackground: 'var(--clerk-bg)',
            colorInputText: 'var(--clerk-input-text)',
            borderRadius: '12px',
            colorBorder: 'var(--clerk-border)',
            colorPrimaryText: 'var(--clerk-text)',
            fontFamily: 'var(--clerk-font-family)',
            fontSize: '16px',
            spacingUnit: '1rem',
            colorInputBorder: 'var(--clerk-border)',
            colorInputPlaceholder: 'var(--clerk-input-placeholder)',
            shadowShimmer: 'var(--clerk-card-shadow)',
          },
          layout: {
            socialButtonsPlacement: 'top',
            socialButtonsVariant: 'iconButton',
            logoPlacement: 'inside',
          },
          elements: {
            card: {
              background: 'var(--clerk-card-bg)',
              backdropFilter: 'blur(12px)',
              boxShadow: 'var(--clerk-card-shadow)',
              border: '1px solid var(--clerk-border)',
            },

            formFieldInput: {
              background: 'var(--clerk-input-bg) !important',
              border: '1px solid var(--clerk-input-border) !important',
              color: 'var(--clerk-input-text) !important',
              backdropFilter: 'blur(8px)',
            },

            formFieldLabel: {
              color: 'var(--clerk-text)',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              flexWrap: 'nowrap',
              gap: '0.25rem',
            },

            headerTitle: {
              color: 'var(--clerk-text)',
            },
            headerSubtitle: {
              color: 'var(--clerk-text-secondary)',
            },

            dividerLine: {
              background: 'var(--clerk-border)',
            },
            dividerText: {
              color: 'var(--clerk-text-secondary)',
            },

            footer: {
              background: 'var(--clerk-footer-bg-solid) !important', // Solid dark background to fix transparency
              borderTop: '1px solid var(--clerk-border)',
              padding: '1.5rem',
            },

            footerAction: {
              background: 'transparent !important',
            },

            footerActionText: {
              color: 'var(--clerk-text-secondary)',
            },

            footerActionLink: {
              color: 'var(--clerk-primary)',
              '&:hover': {
                color: 'var(--clerk-text)',
              },
            },

            socialButtonsIconButton: {
              borderColor: 'var(--clerk-border)',
              background: 'var(--clerk-social-bg) !important', // White background so icons (especially Github) are clearly visible
              height: '48px',
              width: '100%',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'var(--clerk-social-hover) !important',
                transform: 'translateY(-1px)',
              },
            },

            socialButtonsBlockButtonText: {
              color: 'var(--clerk-text)',
              fontWeight: '600',
              fontSize: '16px',
            },

            userButtonPopoverActionButton: {
              color: 'var(--clerk-text) !important',
              background: 'transparent',

              '&:hover': {
                background: 'var(--clerk-hover-bg)',
                color: 'var(--clerk-text) !important',
              },

              '&:focus': {
                color: 'var(--clerk-text) !important',
              },

              '&:active': {
                color: 'var(--clerk-text) !important',
              },
            },

            userButtonPopoverActionButtonText: {
              color: 'var(--clerk-text) !important',
            },

            userButtonPopoverActionButtonIcon: {
              color: 'var(--clerk-primary) !important',
            },

            formButtonPrimary: {
              background: 'var(--clerk-button-bg) !important',
              borderColor: 'transparent',
              color: 'var(--clerk-text)',
              transition: 'all 0.2s ease-in-out',

              '&:focus': {
                boxShadow:
                  '0 0 0 2px var(--clerk-bg), 0 0 0 4px var(--clerk-primary) !important',
              },
              '&:hover': {
                background: 'var(--clerk-button-hover) !important',
                transform: 'translateY(-1px)',
              },
            },
          },
        }}
      >
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </ClerkProvider>
    </StrictMode>
  )
} else {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </StrictMode>
  )
}
