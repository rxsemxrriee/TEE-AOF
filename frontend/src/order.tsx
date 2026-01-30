import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { Order_main } from "./App";
import { Nav } from "./App";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Nav/>
        <Order_main/>
    </StrictMode>
)