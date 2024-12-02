import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./Settings.css";

function Settings() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    // Save the selected language in localStorage
    localStorage.setItem("language", lang);
  };

  return (
    <div className="settings-container">
      <p className="settings-welcome-text">{i18n.t("changeLanguage")}</p>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("en")}
      >
        English
      </button>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("hi")}
      >
        Hindi
      </button>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("ta")}
      >
        Tamil
      </button>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("te")}
      >
        Telugu
      </button>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("kn")}
      >
        Kannada
      </button>
      <button
        className="language-button"
        onClick={() => handleLanguageChange("ml")}
      >
        Malayalam
      </button>
    </div>
  );
}

export default Settings;
