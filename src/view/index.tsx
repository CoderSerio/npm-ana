import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const rootDOM = window.document.getElementById("root");

ReactDOM.createRoot(rootDOM).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
