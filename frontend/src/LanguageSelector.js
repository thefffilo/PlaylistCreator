import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
function LanguageSelector() {
  const { i18n } = useTranslation();

  const changeLanguage = language => {
    i18n.changeLanguage(language);
  };

  return (
    <select
      value={i18n.language}
      onChange={e => changeLanguage(e.target.value)}
      style={{ fontSize: "30px", padding: "3px" }}
    >
      <option value="en">🇬🇧</option>
      <option value="it">🇮🇹</option>
      <option value="es">🇪🇸</option>
      <option value="fr">🇫🇷</option>
    </select>
  );
}

export default LanguageSelector;
