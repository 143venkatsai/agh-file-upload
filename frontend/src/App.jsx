import React from "react";
import { ThemeProvider, createGlobalStyle } from "styled-components";
import { LIGHT_THEME, DARK_THEME } from "./theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useSelector } from "react-redux";
import Home from "./pages/Home/Home";
import DocumentEditor from "./pages/DocumentEditor/DocumentEditor";
import SubmittedFiles from "./pages/SubmittedFiles/SubmittedFiles";
import AccessTable from "./pages/AccessTable/AccessTable";
import FileView from "./pages/FileView/FileView";

const GlobalStyle = createGlobalStyle`
  body {
    background: ${(props) => props.theme.body.primary.base};
    color: ${(props) => props.theme.text.primary};
     font-family: "Work Sans", sans-serif;
  }

.tooltip {
  position: relative;
  display: inline-block;
}

/* Tooltip text */
.tooltip .tooltiptext {
  visibility: hidden;
  width: 160px;
  background-color: ${(props) => props.theme.text.secondary};
  color: ${(props) => props.theme.body.primary.base};
  text-align: center;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;

  position: absolute;
  z-index: 1;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.25s ease-in-out;

  /* ✅ prevent overflow */
  white-space: normal;
  word-break: break-word;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%; /* arrow at bottom of tooltip */
  left: 50%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: ${(props) =>
    props.theme.text.secondary} transparent transparent transparent;
}

/* Show tooltip on hover */
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}

/* Fallbacks if too close to the edges */
.tooltip.left .tooltiptext {
  left: 0;
  transform: none;
}
.tooltip.left .tooltiptext::after {
  left: 10%; /* ✅ shift arrow near left */
  transform: none;
}

.tooltip.right .tooltiptext {
  right: 0;
  left: auto;
  transform: none;
}
.tooltip.right .tooltiptext::after {
  left: auto;
  right: 10%; /* ✅ shift arrow near right */
  transform: none;
}

.selected-day-class {
  background-color: tomato;
  color: white;
  border-radius: 50%;
}

.pod-calendar {
  padding: 1rem ;
  border-radius: 20px ;
  box-shadow: 0px 0px 20px -1px #00000014 ;
  background-color: ${({ theme }) => theme.body.primary.base};
  border: 1px solid ${({ theme }) => theme.border.primary};
  margin-top:0.5rem;
}

.rdp-root {
  --rdp-accent-color: ${({ theme }) => theme.text.primary} !important;
  --rdp-selected-border: : 2px solid var(--rdp-accent-color) !important;
}

.rdp-day:not(.rdp-disabled) button:hover {
  background-color: #cacaca;
}

.rdp-today button {
  background-color: #FC2947;
  border-radius: 50%;
  color: white;
}

.rdp-days button {
   position: relative;
}

.rdp-days .check_icon {
  position: absolute;
  inset:0;
  width: 100%;
  height:100%;
  border-radius: 50%;
  z-index: 2;
  color:green;
  background-color: ${({ theme }) => theme.body.primary.base};

}


.rdp-day[data-tooltip]:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

.rdp-day[data-tooltip]:hover::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: #333;
  z-index: 1000;
}

button {
   border:none;
   background-color: transparent;
}

 .line-clamp {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
 }


.clamp_2 {
-webkit-line-clamp: 2;
}

`;

function App() {
  const { name } = useSelector((state) => state.theme);
  return (
    <ThemeProvider theme={name === "LIGHT" ? LIGHT_THEME : DARK_THEME}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<SubmittedFiles />} />
          <Route path="/uploads" element={<Home />} />
          <Route path="/view-access/:id" element={<AccessTable />} />
          <Route path="/document-editor/:id" element={<DocumentEditor />} />
          <Route path="/file-view/:id" element={<FileView />} />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </ThemeProvider>
  );
}
export default App;
