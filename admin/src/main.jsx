import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AdminContextProvider from "./context/AdminContext.jsx"; // Correct import
import DoctorContextProvider from "./context/DoctorContext.jsx";
import AppContextProvider from "./context/AppContext.jsx"; // Fixed this import

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppContextProvider>
        {" "}
        {/* AppContextProvider should wrap everything */}
        <AdminContextProvider>
          <DoctorContextProvider>
            <App />
          </DoctorContextProvider>
        </AdminContextProvider>
      </AppContextProvider>
    </BrowserRouter>
  </StrictMode>
);
