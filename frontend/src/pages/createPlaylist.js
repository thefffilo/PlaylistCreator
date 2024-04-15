import { useEffect, useState } from "react";
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

function CreatePlaylistPage() {
  const [spuser, setSpuser] = useState({});
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [genresFound, setGenresFound] = useState([
    "house",
    "tech house",
    "edm"
  ]);

  const handleSend = async () => {
    try {
      // const response = await apiClient.post("/genres", { text });
      // if (
      //   response.ok &&
      //   response.data.genres &&
      //   Array.isArray(response.data.genres)
      // ) {
      //   setGenresFound(response.data.genres);
      // }
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

  // const handleCreatePlaylist = async () => {
  //   const topTracks = await fetchWebApi(
  //     "v1/me/top/tracks?time_range=long_term&limit=25",
  //     "GET"
  //   );

  //   if (!topTracks.items) {
  //     return;
  //   }

  //   const tracksUri = topTracks.items.map(track => track.uri);

  //   const playlist = await fetchWebApi(
  //     `v1/users/${spuser.id}/playlists`,
  //     "POST",
  //     {
  //       name: "Playlist Creator",
  //       description: "Playlist creata da Playlist Creator. :)",
  //       public: false
  //     }
  //   );

  //   await fetchWebApi(
  //     `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
  //     "POST"
  //   );
  // };

  const handleCreatePlaylist = async () => {
    try {
      // Get brani raccomandati
      // const recommendedTracks = await fetchWebApi(
      //   "v1/me/top/tracks?time_range=short_term&limit=50",
      //   "GET"
      // );

      // Get brani piaciuti
      // const likedTracks = await fetchWebApi(
      //   "v1/me/tracks?market=IT&limit=50&offset=0",
      //   "GET"
      // );

      const likedTracks = [];
      // Get brani piaciuti
      for (let i = 0; i < 5; i++) {
        const tempTracks = await fetchWebApi(
          `v1/me/tracks?market=IT&limit=${50}&offset=${50 * i}`,
          "GET"
        );
        likedTracks.push(...tempTracks.items.map(i => i.track));
      }

      if (!likedTracks) {
        console.log(
          "Errore durante il recupero dei brani raccomandati e piaciuti."
        );
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

      // Aggiungi le tracce filtrate alla playlist
      // PUÒ CONTENERE MASSIMO 100 TRACCE
      await fetchWebApi(`v1/playlists/${playlist.id}/tracks`, "POST", {
        uris: filteredTracksUri.slice(0, 90),
        position: 0
      });

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
