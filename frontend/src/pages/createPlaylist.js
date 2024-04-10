import { useState } from "react";
import apiClient from "../api/axios";
import { useTranslation } from "react-i18next";

async function fetchWebApi(endpoint, method, body) {
  const token = sessionStorage.getItem("token");
  console.log("endpoint", endpoint);
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks() {
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (
    await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=5", "GET")
  ).items;
}

// const tracksUri = [
//   "spotify:track:5SFCEkybGYmmzKqewtDEaN",
//   "spotify:track:4Fqm5rqB0WMx0hPOwgRjFr",
//   "spotify:track:5w9upngVRHNjdZcRC7Xxr2",
//   "spotify:track:25jTLospI6eYVZ5TDDQN7V",
//   "spotify:track:0iB5f04XdJ2tcfhoVkeLV8",
//   "spotify:track:4obJRBmV1AnO09jj03zIqk",
//   "spotify:track:1CtKHwDqsH3ctcCCI18N0g",
//   "spotify:track:0LMwmV37RCmBO2so0szAFs",
//   "spotify:track:4yhGkvdYU5bi4950r80FRo",
//   "spotify:track:1pFqJGm5J5GlWOYmEUee30"
// ];

async function createPlaylist(tracksUri) {
  const { id: user_id } = await fetchWebApi("v1/me", "GET");

  const playlist = await fetchWebApi(`v1/users/${user_id}/playlists`, "POST", {
    name: "PlaylistDel",
    description: "Playlist created by the tutorial on developer.spotify.com",
    public: false
  });

  await fetchWebApi(
    `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
    "POST"
  );

  return playlist;
}

function CreatePlaylistPage() {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [genresFound, setGenresFound] = useState([]);

  const handleSend = async () => {
    try {
      // const response = await apiClient.post("/sendText", { text });
      // if (response.data.genres && Array.isArray(response.data.genres)) {
      //   setGenresFound(response.data.genres);
      // }

      const topTracks = await getTopTracks();

      const tracksUri = topTracks.map(track => track.uri);
      createPlaylist(tracksUri);
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
