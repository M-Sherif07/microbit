import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import LabPage from "../../LabPage.jsx";
import { addPsKeywords } from "../../lib/highlight.js";
import * as lab from "./content.js";
import "../../styles.css";

addPsKeywords(lab.meta.psKeywords);
createRoot(document.getElementById("root")).render(<StrictMode><LabPage lab={lab} /></StrictMode>);
