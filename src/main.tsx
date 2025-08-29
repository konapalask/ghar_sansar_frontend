// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { InteriorProvider } from "./context/InteriorContext"; // ✅ import provider

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <InteriorProvider>
      <App />
    </InteriorProvider>
  </React.StrictMode>
);
