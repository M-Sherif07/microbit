import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PlanCodeLab from "./PlanCodeLab.jsx";
import "../../styles.css";
import "./plan-code.css";

createRoot(document.getElementById("root")).render(<StrictMode><PlanCodeLab /></StrictMode>);
