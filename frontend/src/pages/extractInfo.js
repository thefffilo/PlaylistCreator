import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        marginTop: "20px"
      }}
    >
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        style={{
          padding: "10px",
          cursor: "pointer",
          color: selectedFile ? "black" : "gray",
          width: "fit-content",
          margin: "10px auto",
          border: "1px solid",
          borderRadius: "5px"
        }}
        disabled={!selectedFile}
      >
        {t("extractInfo.confirm")}
      </button>
      {genre && (
        <div>
          <t1>{genre}</t1>
        </div>
      )}
    </div>
  );
};

export default ExtractInfo;
