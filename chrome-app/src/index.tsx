import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.createElement("feedback-solver");
rootElement.id = "feedbackSolver";
document.body.appendChild(rootElement);

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
