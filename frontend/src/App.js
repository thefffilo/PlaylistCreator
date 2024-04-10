import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import CreatePlaylistPage from "./pages/createPlaylist";
import ExtractInfo from "./pages/extractInfo";
import LanguageSelector from "./LanguageSelector";
import "./App.css";

function App() {
  const CLIENT_ID = "08d52968d40a4cb999ddd47d784b5ac5";
  const REDIRECT_URI = window.location.href;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE =
    // "user-read-private%20playlist-read-private%20playlist-modify-public%20app-remote-control%20user-library-read%20user-read-playback-state%20user-read-recently-played%20user-top-read";
    "user-top-read%20playlist-modify-private";

  const [token, setToken] = useState("");
  const [selectedTab, setSelectedTab] = useState("playlist");

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

  const { t } = useTranslation();

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col>
            <header className="App-header">
              <div className="language-selector">
                <LanguageSelector className="language-selector" />
              </div>
              <h1>{t("home.welcome")}</h1>
              <div className="box">
                <div>
                  <span
                    style={{
                      cursor: "pointer",
                      marginRight: "10px",
                      fontWeight: selectedTab === "playlist" ? "bold" : "normal"
                    }}
                    onClick={() => setSelectedTab("playlist")}
                    className="title-label"
                  >
                    {t("home.playlist")}
                  </span>
                  <span
                    style={{
                      cursor: "pointer",
                      fontWeight: selectedTab === "extract" ? "bold" : "normal"
                    }}
                    onClick={() => setSelectedTab("extract")}
                    className="title-label"
                  >
                    {t("home.extract")}
                  </span>
                </div>
                {selectedTab === "playlist" && (
                  <>
                    {!token ? (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: "20px"
                        }}
                      >
                        <a
                          href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                        >
                          {t("home.login")}
                        </a>
                      </div>
                    ) : (
                      <CreatePlaylistPage />
                    )}
                  </>
                )}
                {selectedTab === "extract" && <ExtractInfo />}
              </div>
              {token && (
                <div
                  style={{
                    color: "white",
                    padding: "10px",
                    height: "fit-content"
                  }}
                >
                  <button onClick={logout}>{t("home.logout")}</button>
                </div>
              )}
            </header>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
