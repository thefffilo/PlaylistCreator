import { useState } from "react";
import apiClient from "../api/axios";

function CreatePlaylistPage() {
  const [text, setText] = useState("");
  const [genresFound, setGenresFound] = useState([]);

  const handleSend = async () => {
    try {
      const response = await apiClient.post("/api/sendText", { text });
      if (response.data.genres && Array.isArray(response.data.genres)) {
        setGenresFound(response.data.genres);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReset = () => {
    setText("");
    setGenresFound([]);
  };

  const handleRemoveGenre = genreIndex => {
    const updatedGenres = [...genresFound];
    updatedGenres.splice(genreIndex, 1);
    setGenresFound(updatedGenres);
  };

  const handleCreatePlaylist = () => {};

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
      {genresFound.length > 0 && (
        <div>
          <p>We have found these genres in your phrase:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {genresFound.map((genre, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <span style={{ marginRight: "10px" }}>{genre}</span>
                <button onClick={() => handleRemoveGenre(index)}>Remove</button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCreatePlaylist}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              marginTop: "10px"
            }}
          >
            Create a playlist
          </button>
        </div>
      )}
    </div>
  );
}

export default CreatePlaylistPage;
