import { useState } from "react";
import apiClient from "../api/axios";

function CreatePlaylistPage() {
  const [text, setText] = useState("");

  const handleSend = async () => {
    try {
      const response = await apiClient.post("/api/sendText", { text });
      console.log(response.data);
    } catch (error) {
      console.error(error); // Gestisci errori di rete o risposte con status code 4xx/5xx
    }
  };

  const handleReset = () => {
    setText("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          margin: "10px 0",
          boxSizing: "border-box"
        }}
        rows="4"
        placeholder="Inserisci il tuo testo qui..."
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleReset}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Reset
        </button>
        <button
          onClick={handleSend}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Invia
        </button>
      </div>
    </div>
  );
}

export default CreatePlaylistPage;
