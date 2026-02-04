import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import { Order_main } from "./App";
import { Topnavbar } from "./App";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Topnavbar/>
        <Order_main/>
    </StrictMode>
)