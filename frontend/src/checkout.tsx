import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { Topnavbar } from "./App";
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Topnavbar/>
    </StrictMode>
)