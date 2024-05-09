import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import CreatePlaylistPage from "./pages/createPlaylist";
import ExtractInfo from "./pages/extractInfo";
import LanguageSelector from "./LanguageSelector";
import "./App.css";

function App() {
  // const CLIENT_ID = "08d52968d40a4cb999ddd47d784b5ac5";
  const [client_id, setClient_id] = useState("");
  const [inputClient_id, setInputClient_id] = useState("");
  const REDIRECT_URI = window.location.href;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPE = "user-top-read%20playlist-modify-private%20user-library-read";
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

  useEffect(() => {
    const client_id = window.sessionStorage.getItem("client_id");

    if (client_id) {
      setClient_id(client_id);
      setInputClient_id(client_id);
    }
  }, []);

  const logout = () => {
    setToken("");
    window.sessionStorage.clear();
  };

  const { t } = useTranslation();

  const handleClientIdInput = e => {
    setInputClient_id(e.target.value);
  };

  const submitClientId = () => {
    setClient_id(inputClient_id);
    window.sessionStorage.setItem("client_id", inputClient_id);
  };

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col>
            <header className="App-header">
              <div className="language-selector">
                <LanguageSelector />
              </div>
              <h1>{t("home.welcome")}</h1>

              {!client_id && (
                <div className="client-id-form">
                  <h3>Inserisci il tuo Client ID</h3>
                  <input
                    type="text"
                    className="client-id-input"
                    placeholder={"Client ID"}
                    value={inputClient_id}
                    onChange={handleClientIdInput}
                  />
                  <button className="submit-button" onClick={submitClientId}>
                    Continua.
                  </button>
                </div>
              )}

              {client_id && (
                <div className="box">
                  <div className="tab-selector">
                    <span
                      className={`title-label ${
                        selectedTab === "playlist" ? "active" : ""
                      }`}
                      onClick={() => setSelectedTab("playlist")}
                    >
                      {t("home.playlist")}
                    </span>
                    <span
                      className={`title-label ${
                        selectedTab === "extract" ? "active" : ""
                      }`}
                      onClick={() => setSelectedTab("extract")}
                    >
                      {t("home.extract")}
                    </span>
                  </div>

                  {selectedTab === "playlist" && (
                    <>
                      {!token ? (
                        <div className="login-prompt">
                          <a
                            href={`${AUTH_ENDPOINT}?client_id=${client_id}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
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
              )}
              {token && (
                <button className="logout-button" onClick={logout}>
                  {t("home.logout")}
                </button>
              )}
            </header>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
