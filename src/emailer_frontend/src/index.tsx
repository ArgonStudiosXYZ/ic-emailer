import React from "react";
import { createRoot } from "react-dom/client";
import "./main.css";
import { Routes } from "./nav/Routes";
import { AuthProvider } from "./provider/AuthProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { KeyProvider } from "./provider/KeyProvider";

const App = () => {
  return (
    <KeyProvider>
      <AuthProvider>
        <Routes />
        <ToastContainer
          position="bottom-center"
          autoClose={500000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </KeyProvider>
  );
};

const root = createRoot(document.getElementById("app"));
root.render(<App />);
