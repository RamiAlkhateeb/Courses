import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import { i18nReady } from './i18n'
import { Providers } from './app/providers'
import { reloadOnStaleChunks } from './app/chunkReload'
import { registerServiceWorker } from './app/serviceWorker'
import { router } from './app/router'
import { initAuth } from './state/auth'
import { listenForInstall } from './state/install'
import { startTheme } from './state/theme'
import { startSync } from './state/sync'

startTheme() // light or dark before anything is drawn
reloadOnStaleChunks()
registerServiceWorker()
listenForInstall()
startSync() // listens for sign-in; does nothing unless accounts are configured
void initAuth()

// First render once the saved language is loaded (Arabic is fetched on demand), so nothing flashes in English.
void i18nReady.finally(() =>
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Providers>
        <RouterProvider router={router} />
      </Providers>
    </StrictMode>,
  ),
)
