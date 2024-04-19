# PlaylistCreator

Progetto di Informatica Umanistica 2024

## Tecnologie:

Backend: Python
Frontend: React

## Use Cases:

### Creare playlist data una descrizione testuale dell'utente

Usare un LLM per 'capire' la frase data in input e associare i generi musicali presenti su Spotify all'input.
Tramite le API di Spotify creare la playlist e aggiungere i brani (tra i brani più famosi e tra quelli salvati)
SCEGLIERE IL MODELLO

### Upload di file audio ed estrapolare le info più interessanti

Usare un modello di intelligenza artificiale per estrarre dati interessanti sulla canzone caricata. (Dobbiamo trovare un modello adatto pre allenato).
SCEGLIERE IL MODELLO, USIAMO UN MODELLO ESTERNO TRAMITE API

## Come eseguirlo

- Esegui i notebook su Google Colab (oppure puoi eseguirli in locale se hai l'hardware necessario) (Per questioni di performance abbiamo diviso i due modelli in 2 due diversi notebook).
- Vai sul developers.spotify.com e crea una nuova app developer.
- Copia il Client ID e inseriscilo nell'app.
- Aggiungi l'url dell'app nei 'redirect url' nella dashboard di Spotify.
- Inizia a generare playlist!

## Altri dettagli

Generi riconosciuti su cui è stato allenato il modello:

["acoustic","afrobeat","alt-rock","alternative","ambient","anime","black-metal","blues","bossanova","brazil","breakbeat","british","children","chill","classical","club","comedy","country","dance","dancehall","death-metal","deep-house","disco","disney","drum-and-bass","dub","dubstep","edm","electro","electronic","emo","folk","french","funk","garage","german","gospel","goth","groove","grunge","guitar","happy","hard-rock","hardcore","hardstyle","heavy-metal","hip-hop","holidays","house","idm","indian","indie","indie-pop","industrial","j-pop","jazz","k-pop","kids","latin","latino","metal","metal-misc","metalcore","minimal-techno","movies","new-age","opera","party","piano","pop","pop-film","post-dubstep","power-pop","progressive-house","psych-rock","punk","punk-rock","r-n-b","rainy-day","reggae","reggaeton","road-trip","rock","rock-n-roll","rockabilly","romance","sad","salsa","samba","show-tunes","singer-songwriter","sleep","songwriter","soul","soundtracks","spanish","study","summer","swedish","synth-pop","tango","techno","trance","work-out","world-music"]
