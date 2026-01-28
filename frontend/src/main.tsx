import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Main } from './App.tsx'
import { Nav } from './App.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav />
    <Main />
  </StrictMode>,
)
