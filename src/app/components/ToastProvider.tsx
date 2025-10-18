// components/ToastProvider.tsx

"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../../context/ThemeContext";

export default function ToastProvider() {
  const { theme: isDarkMode } = useTheme();
  const theme = isDarkMode ? "dark" : "light";

  return (
    <ToastContainer
      limit={3}
      progressClassName={theme === "dark" ? "toastProgressDark" : "toastProgress"}
      className={theme === "dark" ? "toastBodyDark" : "toastBody"}
      position="bottom-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
    />
  );
}