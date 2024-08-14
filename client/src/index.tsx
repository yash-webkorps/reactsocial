import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

// Add a type check to ensure the container is not null
if (container) {
  const root = createRoot(container);

  root.render(
    <BrowserRouter>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  );
} else {
  console.error("Root container not found");
}
