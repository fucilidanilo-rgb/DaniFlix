# DaniFlix

Landing page interattiva dedicata a *Stranger Things*, realizzata come progetto didattico con **HTML, CSS e JavaScript puro**. La demo combina un’anteprima video, gallerie di contenuti, una pagina piani e un flusso di registrazione e accesso salvato nel browser.

## Avvio in locale

Apri la cartella del progetto in VS Code e avvia `index.html` con Live Server. In alternativa, se hai Python installato, apri il terminale nella cartella del progetto ed esegui:

```bash
python -m http.server 8000
```

Visita [http://localhost:8000](http://localhost:8000). Usa sempre lo stesso indirizzo e la stessa porta durante la prova, perché `localStorage` è separato per origine. Servire i file via HTTP mantiene lo stesso archivio locale tra home, form e piani. Il progetto non richiede dipendenze JavaScript, build o database.

## Come funziona la pagina

| Sezione | Comportamento |
| --- | --- |
| Navigazione | Il logo DaniFlix, l’area account e il video condividono i margini della pagina. I link portano a episodi, trailer, altri titoli e piani. Su mobile i link passano su una riga sotto il logo e l’area account. |
| Anteprima | Un video HTML5 prova ad avviarsi senza audio. **Guarda / Pausa** controlla la riproduzione e il secondo pulsante controlla l’audio. Se l’autoplay è disabilitato, il video si può avviare manualmente. |
| Riepilogo | Mostra titolo, descrizione, genere, stagioni, cast e autori. Le colonne si impilano su schermi stretti. |
| Episodi | Il selettore mostra una stagione alla volta e riporta la galleria all’inizio a ogni cambio. La galleria si scorre con le frecce o con il gesto orizzontale. |
| Trailer | Cinque card aprono il video associato in una finestra modale. L’anteprima si ferma all’apertura. La chiusura con **×**, **Esc** o clic all’esterno ferma il trailer e riprende l’anteprima se era in riproduzione. |
| Altri titoli | La galleria di locandine si scorre con le frecce o con il gesto orizzontale. Le locandine hanno funzione espositiva. |
| Piani | La home presenta tre piani dimostrativi. Aprendo una scheda si va a `piano.html` se si è già entrati oppure al form, che riporta ai piani dopo il login. Prezzi e schede sono a scopo illustrativo. |
| Banner e footer | Il banner apre la newsroom di Netflix. I link segnaposto del footer e il selettore lingua hanno funzione espositiva. |

## Flusso di accesso e registrazione

1. **Partenza dalla home.** Clicca **Accedi** per aprire il form. In alternativa compila il campo email nella hero e premi **Abbonati ora**. Il JavaScript controlla il formato, mostra un errore se necessario e passa l’email al form di accesso. Il pulsante flottante **Abbonati ora** compare dopo un quarto dello scorrimento disponibile e riporta al campo email.
2. **Registrazione.** Nel form seleziona **Registrati**. Il nome deve avere almeno due caratteri, l’email deve avere un formato valido e la password deve contenere almeno otto caratteri, una maiuscola, una minuscola e un numero. Per inviare il form occorre spuntare le condizioni di utilizzo. Il controllo dei duplicati ignora maiuscole e minuscole dell’email.
3. **Generatore demo.** Il comando **Genera password demo** riempie il campo con 12 caratteri, includendo almeno una maiuscola, una minuscola e una cifra. Usa `Math.random()` per la simulazione.
4. **Dopo la registrazione.** Il profilo viene salvato nel browser e il form torna alla modalità **Accedi**. L’email resta compilata. La password e la spunta vengono cancellate.
5. **Login.** Il form verifica il formato dell’email, la password e la spunta anche in modalità Accedi. Confronta quindi le credenziali con il profilo salvato. Se sono corrette, registra lo stato di accesso e torna alla home oppure ai piani, a seconda del percorso di partenza.
6. **Sessione e logout.** La home mostra **Ciao, nome** e **Logout** e nasconde entrambi i comandi di abbonamento. La sessione resta dopo un ricaricamento. **Logout** rimuove la sessione e ripristina il pulsante Accedi e il form della home. Il profilo salvato resta disponibile per un nuovo login.

Per provare il flusso usa dati fittizi, per esempio `demo@example.test` e `Demo1234`.

### Dati in localStorage

| Chiave | Contenuto | Durata |
| --- | --- | --- |
| `utentiRegistratiDaniFlix` | Elenco JSON dei profili con nome, email e password demo in chiaro | Resta dopo il logout. Si rimuove cancellando i dati del sito. |
| `utenteLoggatoDaniFlix` | Oggetto JSON con nome, email e indicatore `loggato` | Rimosso al logout. |
| `emailPrecompilataDaniFlix` | Email digitata nella home | Rimossa appena letta dal form. |

Il login e il controllo di accesso ai piani sono **simulazioni lato client**. I dati e lo stato di accesso sono modificabili dal browser. La demo non invia dati a un server, non gestisce pagamenti e va usata esclusivamente con credenziali fittizie.

## Struttura del progetto

| File | Ruolo |
| --- | --- |
| `index.html`, `style.css`, `index.js` | Home, layout responsive, gallerie, controlli video, modale e area account |
| `form.html`, `form.css`, `form.js` | Accesso, registrazione, validazione e generatore demo |
| `storage.js` | Chiavi di archiviazione, lettura JSON e controllo dello stato di accesso |
| `piano.html`, `piano.css` | Confronto dei piani e ritorno alla home |
| Cartelle multimediali | Logo, sfondi, locandine, immagini degli episodi e video |

## Crediti

DaniFlix è un progetto didattico indipendente ispirato alle piattaforme di streaming. Marchi, immagini e video di terze parti appartengono ai rispettivi titolari. Pubblica i materiali multimediali per i quali hai il diritto di redistribuzione.
