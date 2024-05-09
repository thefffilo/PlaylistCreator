import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import "./extractInfo.css";

const ExtractInfo = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [genre, setGenre] = useState("");
  const { t } = useTranslation();

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file?.type.startsWith("audio/")) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert("Si prega di selezionare un file audio.");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setGenre("");
      const formData = new FormData();
      formData.append("audio", selectedFile);
      fetch("/uploadSong", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log("Risposta dall'API:", data);
          setGenre(data.genre);
        })
        .catch(error => {
          console.error("Errore durante l'upload:", error);
        });
    } else {
      alert("Si prega di selezionare un file audio prima di confermare.");
    }
  };

  return (
    <div className="extract-container">
      <input
        type="file"
        accept="audio/*"
        className="file-input"
        onChange={handleFileChange}
      />
      <button
        onClick={handleUpload}
        className={`upload-button ${selectedFile ? "active" : "disabled"}`}
        disabled={!selectedFile}
      >
        {t("extractInfo.confirm")}
      </button>
      {genre && (
        <div className="genre-display">
          <p>{genre}</p>
        </div>
      )}
    </div>
  );
};

export default ExtractInfo;
