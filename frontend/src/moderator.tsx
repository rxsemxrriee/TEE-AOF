import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Topnavbar, Footer, Moderator_main } from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Topnavbar />
        <Moderator_main />
        <Footer />
    </StrictMode>,
)
