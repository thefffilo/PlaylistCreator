import { useEffect, useState } from "react";
import apiClient from "../api/axios";
import { TrashFill } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import "./createPlaylist.css";

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

function CreatePlaylistPage() {
  const [spuser, setSpuser] = useState({});
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [genresFound, setGenresFound] = useState([]);
  const [loading, setLoading] = useState(false);

  const [playlistId, setPlaylistId] = useState("");

  const handleSend = async () => {
    console.log(window.location.href.split(".com")[0] + ".com/genres");

    setLoading(true);

    fetch(window.location.href.split(".com")[0] + ".com/genres", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text })
    })
      .then(response => response.json()) // Converte la risposta in JSON
      .then(data => {
        setGenresFound(data.text.split(" "));
        setLoading(false);
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false);
      });
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

  const handleCreatePlaylist = async () => {
    try {
      // Get brani raccomandati
      const recommendedTracks = await fetchWebApi(
        `v1/me/top/tracks?time_range=short_term&limit=50&min_popularity=70&genres=${genresFound.join(
          ","
        )}`,
        "GET"
      );

      const likedTracks = [...recommendedTracks.items];

      // Get brani piaciuti
      for (let i = 0; i < 10; i++) {
        const tempTracks = await fetchWebApi(
          `v1/me/tracks?market=IT&limit=${50}&offset=${50 * i}`,
          "GET"
        );
        likedTracks.push(...tempTracks.items.map(i => i.track));
      }
      console.log(likedTracks);

      if (!likedTracks) {
        console.log(
          "Errore durante il recupero dei brani raccomandati e piaciuti."
        );
        alert("Errore");
        return;
      }

      const artists = likedTracks
        .map(i => i.artists)
        .flat()
        .map(i => i.id);

      let uniqueArtists = [...new Set(artists)]; //rimuovo gli artisti duplicati

      const uniqueArtistsDivided = [];
      for (let i = 0; i < uniqueArtists.length; i += 50) {
        let chunk = uniqueArtists.slice(i, i + 50);
        uniqueArtistsDivided.push(chunk);
      }

      // ottengo tutti i genere degli artisti
      const baseUrl = "v1/artists?ids=";
      const artitsWithGenres = [];

      const promises = uniqueArtistsDivided.map(async artists => {
        let url = baseUrl + artists.join(",");
        const resp = await fetchWebApi(url, "GET");
        return resp.artists;
      });

      // Attendi che tutte le promesse siano completate e poi elabora i risultati
      const results = await Promise.all(promises);
      results.forEach(artists => artitsWithGenres.push(...artists));

      // console.log("artisti con genere", artitsWithGenres);

      //filtro artisti per il genere
      const filteredArtist = artitsWithGenres.filter(artist =>
        artist.genres.some(genre => genresFound.includes(genre))
      );
      const filteredArtistName = filteredArtist.map(el => el.name);
      // console.log("artisti filtrati", filteredArtistName);

      // Controlla se ci sono artisti
      if (filteredArtistName.length === 0) {
        console.log("Nessuna traccia corrisponde ai generi selezionati.");
        alert("Nessun brano adatto trovato");
        return;
      }

      const filteredTracksUri = [];

      // per ogni traccia controllo se almeno uno degli artisti compare tra quelli che ho selezionato, se compare aggiungo il brano all'array
      likedTracks.forEach(track => {
        if (
          track.artists.some(artist => filteredArtistName.includes(artist.name))
        )
          filteredTracksUri.push(track.uri);
      });

      // Crea una nuova playlist
      const playlist = await fetchWebApi(
        `v1/users/${spuser.id}/playlists`,
        "POST",
        {
          name: "Playlist Filtrata per Genere",
          description:
            "Playlist creata con brani raccomandati e piaciuti filtrati per genere.",
          public: false
        }
      );
      const uniqueTracks = [...new Set(filteredTracksUri)]; //rimuovo gli artisti duplicati
      // Aggiungi le tracce filtrate alla playlist
      // PUÒ CONTENERE MASSIMO 100 TRACCE
      await fetchWebApi(`v1/playlists/${playlist.id}/tracks`, "POST", {
        uris: uniqueTracks.slice(0, 90),
        position: 0
      });
      setTimeout(() => {
        setPlaylistId(playlist.id);
      }, 2000);

      console.log("Playlist creata con successo.");
    } catch (error) {
      console.error("Errore durante la creazione della playlist:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResult = await fetchWebApi("v1/me", "GET");

        if (userResult) {
          setSpuser(userResult);
        }
      } catch (error) {
        console.error("Failed to fetch:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="playlist-container">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        className="text-input"
        rows="4"
        placeholder={t("createPlaylist.insertYourTextHere")}
      />
      <div className="button-container">
        <button onClick={handleReset} className="reset-button">
          {t("createPlaylist.reset")}
        </button>
        <button onClick={handleSend} className="send-button">
          {t("createPlaylist.send")}
        </button>

        <div className="d-flex justify-content-center align-items-center">
          {loading && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="2em"
              height="2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
              />
              <rect
                width="2"
                height="7"
                x="11"
                y="6"
                fill="currentColor"
                rx="1"
              >
                <animateTransform
                  attributeName="transform"
                  dur="9s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </rect>
              <rect
                width="2"
                height="9"
                x="11"
                y="11"
                fill="currentColor"
                rx="1"
              >
                <animateTransform
                  attributeName="transform"
                  dur="0.75s"
                  repeatCount="indefinite"
                  type="rotate"
                  values="0 12 12;360 12 12"
                />
              </rect>
            </svg>
          )}
        </div>
      </div>
      {genresFound.length > 0 && (
        <div className="genre-list-container">
          <p>{t("createPlaylist.foundGenres")}</p>
          <ul className="genre-list">
            {genresFound.map((genre, index) => (
              <li key={index} className="genre-item">
                <span className="genre-name">{genre}</span>
                <button
                  onClick={() => handleRemoveGenre(index)}
                  className="remove-genre-button"
                >
                  <TrashFill />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={handleCreatePlaylist}
            className="create-playlist-button"
          >
            {t("createPlaylist.createPlaylist")}
          </button>
        </div>
      )}

      {playlistId && (
        <iframe
          src={`https://open.spotify.com/embed/playlist/${playlistId}?theme=black&show_tracklist=true`}
          className="playlist-iframe"
        ></iframe>
      )}
    </div>
  );
}

export default CreatePlaylistPage;
