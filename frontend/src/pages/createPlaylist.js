import { useState } from "react";
import apiClient from "../api/axios";
import { useTranslation } from "react-i18next";
function CreatePlaylistPage() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [genresFound, setGenresFound] = useState([]);

  const handleSend = async () => {
    try {
      const response = await apiClient.post("/sendText", { text });
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
        placeholder={t("createPlaylist.insertYourTextHere")}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          onClick={handleReset}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {t("createPlaylist.reset")}
        </button>
        <button
          onClick={handleSend}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          {t("createPlaylist.send")}
        </button>
      </div>
      {genresFound.length > 0 && (
        <div>
          <p>{t("createPlaylist.foundGenres")}:</p>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {genresFound.map((genre, index) => (
              <li key={index} style={{ marginBottom: "5px" }}>
                <span style={{ marginRight: "10px" }}>{genre}</span>
                <button onClick={() => handleRemoveGenre(index)}>
                  {t("createPlaylist.remove")}
                </button>
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
            {t("createPlaylist.createPlaylist")}
          </button>
        </div>
      )}
    </div>
  );
}

export default CreatePlaylistPage;
