import React from "react";
import { EmailForm } from "../components/EmailForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Home = () => {
  return (
    <>
      <EmailForm />
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
    </>
  );
};
