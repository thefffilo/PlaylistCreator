import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";
import CreatePlaylistPage from "./pages/createPlaylist";
import ExtractInfo from "./pages/extractInfo";
import LanguageSelector from "./LanguageSelector";
import "./App.css"; // Importa il foglio di stile CSS

function App() {
  const CLIENT_ID = "08d52968d40a4cb999ddd47d784b5ac5";
  const REDIRECT_URI = window.location.href;
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";

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
              <LanguageSelector />
              <h1>{t("home.welcome")}</h1>
              <div className="box">
                <div>
                  <span
                    style={{ cursor: "pointer", marginRight: "10px" }}
                    onClick={() => setSelectedTab("playlist")}
                    className="title-label"
                  >
                    {t("home.playlist")}
                  </span>
                  <span
                    style={{ cursor: "pointer" }}
                    onClick={() => setSelectedTab("extract")}
                    className="title-label"
                  >
                    {t("home.extract")}
                  </span>
                </div>
                {selectedTab === "playlist" && (
                  <>
                    {!token ? (
                      <a
                        href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
                      >
                        {t("home.login")}
                      </a>
                    ) : (
                      <CreatePlaylistPage />
                    )}
                  </>
                )}
                {selectedTab === "extract" && <ExtractInfo />}
                {token && (
                  <div className="button-container">
                    <button onClick={logout}>{t("home.logout")}</button>
                  </div>
                )}
              </div>
            </header>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
