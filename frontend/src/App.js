import "./App.css";
import { useState, useEffect } from "react";
import CreatePlaylistPage from "./pages/createPlaylist";

function App() {
  const CLIENT_ID = "08d52968d40a4cb999ddd47d784b5ac5";
  const REDIRECT_URI = window.location.href;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromSessionStorage = window.sessionStorage.getItem("token");

    if (!token && tokenFromSessionStorage) {
      setToken(tokenFromSessionStorage);
    }

    const hash = window.location.hash.substring(1);
    const hashParams = new URLSearchParams(hash);
    const accessToken = hashParams.get("access_token");

    if (accessToken && !tokenFromSessionStorage) {
      setToken(accessToken);
      window.sessionStorage.setItem("token", accessToken);
    }
  }, []);

  const logout = () => {
    setToken("");
    window.sessionStorage.clear();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Spotify React</h1>
        {!token ? (
          <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
          >
            Login to Spotify
          </a>
        ) : (
          <>
            <CreatePlaylistPage></CreatePlaylistPage>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
