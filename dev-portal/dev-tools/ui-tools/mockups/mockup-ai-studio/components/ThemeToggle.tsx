import React from "react";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTheme } from "next-themes";

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  return (
    <button
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors focus:outline-none"
      aria-label="Cambiar tema"
      onClick={toggleTheme}
    >
      <FontAwesomeIcon
        icon={theme === "dark" ? faSun : faMoon}
        className={`text-xl text-gray-600 dark:text-gray-300 transition-transform duration-300 ${theme === "dark" ? "rotate-180" : ""}`}
      />
    </button>
  );
}; 