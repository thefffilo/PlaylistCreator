import React, { useState } from "react";

const ExtractInfo = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = event => {
    const file = event.target.files[0];
    // Verifica se il file è un audio
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
      fetch("URL_dell_API", {
        method: "POST",
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          console.log("Risposta dall'API:", data);
          setSelectedFile(null);
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
        Conferma
      </button>
    </div>
  );
};

export default ExtractInfo;
