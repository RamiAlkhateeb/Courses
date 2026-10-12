import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import './i18n'
import { Providers } from './app/providers'
import { reloadOnStaleChunks } from './app/chunkReload'
import { router } from './app/router'

reloadOnStaleChunks()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </StrictMode>,
)
