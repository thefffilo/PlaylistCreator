# PlaylistCreator

Progetto di Informatica Umanistica 2024

## Tecnologie:

- Backend: Python
- Frontend: React
- LLM: mistral 7b

## Use Cases:

### Creare playlist data una descrizione testuale dell'utente

Usiamo un LLM per 'estrarre' i generi musicali dalla descrizione dell'utente.
Usiamo i genere trovati e le api di Spotify per creare una playlist che rispecchia i gusti dell'utente e la descrizione data, direttamente sulĺ'account dell'utente.

### Upload di file audio ed estrapolare le info più interessanti

Upload di file .mp3 e tramite modello AI mostriamo all'utente qual'è il genere musicale a cui appartiene.

## Come eseguirlo

- Esegui i notebook su Google Colab (oppure puoi eseguirli in locale se hai l'hardware necessario) (Per questioni di performance abbiamo diviso i due modelli in 2 due diversi notebook).
- Vai sul developers.spotify.com e crea una nuova app developer.
- Copia il Client ID e inseriscilo nell'app.
- Aggiungi l'url dell'app nei 'redirect url' nella dashboard di Spotify.
- Inizia a generare playlist!

## Altri dettagli

Generi su cui è stato allenato il modello:

["acoustic","afrobeat","alt-rock","alternative","ambient","anime","black-metal","blues","bossanova","brazil","breakbeat","british","children","chill","classical","club","comedy","country","dance","dancehall","death-metal","deep-house","disco","disney","drum-and-bass","dub","dubstep","edm","electro","electronic","emo","folk","french","funk","garage","german","gospel","goth","groove","grunge","guitar","happy","hard-rock","hardcore","hardstyle","heavy-metal","hip-hop","holidays","house","idm","indian","indie","indie-pop","industrial","j-pop","jazz","k-pop","kids","latin","latino","metal","metal-misc","metalcore","minimal-techno","movies","new-age","opera","party","piano","pop","pop-film","post-dubstep","power-pop","progressive-house","psych-rock","punk","punk-rock","r-n-b","rainy-day","reggae","reggaeton","road-trip","rock","rock-n-roll","rockabilly","romance","sad","salsa","samba","show-tunes","singer-songwriter","sleep","songwriter","soul","soundtracks","spanish","study","summer","swedish","synth-pop","tango","techno","trance","work-out","world-music"]
