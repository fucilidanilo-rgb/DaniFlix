const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// Elementi HTML
const formAuth = document.getElementById("authForm");
const inputNome = document.getElementById("nome");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const checkboxAccetto = document.getElementById("accetto");
const linkGeneraPassword = document.getElementById("generaPassword");

const erroreNome = document.getElementById("erroreNome");
const erroreEmail = document.getElementById("erroreEmail");
const errorePassword = document.getElementById("errorePassword");
const erroreAccetto = document.getElementById("erroreAccetto");
const messaggioSuccesso = document.getElementById("successo");

const erroreArchivio = document.getElementById("erroreArchivio");
const destinazione = new URLSearchParams(location.search).get("destinazione") === "piano"
    ? "piano.html"
    : "index.html";

const campoNome = document.getElementById("campoNome");
const tabAccedi = document.getElementById("tabAccedi");
const tabRegistrati = document.getElementById("tabRegistrati");
const formBadge = document.getElementById("formBadge");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");
const bottoneAuth = document.getElementById("bottoneAuth");
const notaAccesso = document.getElementById("notaAccesso");

let modalita = "login";

function leggiUtenti() {
    const utenti = leggiDatoLocale(CHIAVE_UTENTI);
    return Array.isArray(utenti) ? utenti : [];
}

function salvaUtenti(utenti) {
    localStorage.setItem(CHIAVE_UTENTI, JSON.stringify(utenti));
}

function cercaUtentePerEmail(email) {
    const utenti = leggiUtenti();
    return utenti.find(function (utente) {
        return typeof utente?.email === "string" && utente.email.toLowerCase() === email.toLowerCase();
    });
}

function mostraErrore(input, contenitoreErrore, messaggio) {
    contenitoreErrore.textContent = messaggio;

    if (input) {
        input.classList.add("input-error");
        input.setAttribute("aria-invalid", "true");
    }
}

function rimuoviErrore(input, contenitoreErrore) {
    contenitoreErrore.textContent = "";

    if (input) {
        input.classList.remove("input-error");
        input.removeAttribute("aria-invalid");
    }
}

function pulisciErrori() {
    rimuoviErrore(inputNome, erroreNome);
    rimuoviErrore(inputEmail, erroreEmail);
    rimuoviErrore(inputPassword, errorePassword);
    rimuoviErrore(checkboxAccetto, erroreAccetto);
    messaggioSuccesso.textContent = "";
}

function cambiaModalita(nuovaModalita) {
    modalita = nuovaModalita;
    pulisciErrori();

    erroreArchivio.textContent = "";
    tabAccedi.setAttribute("aria-pressed", String(modalita === "login"));
    tabRegistrati.setAttribute("aria-pressed", String(modalita === "registrazione"));

    if (modalita === "registrazione") {
        campoNome.classList.remove("nascosto");
        tabRegistrati.classList.add("tab-attiva");
        tabAccedi.classList.remove("tab-attiva");
        formBadge.textContent = "Crea il tuo profilo";
        authTitle.textContent = "Registrati";
        authSubtitle.textContent = "Salva il tuo account nel browser e poi accedi alla piattaforma.";
        bottoneAuth.textContent = "REGISTRATI";
        inputPassword.setAttribute("autocomplete", "new-password");
        notaAccesso.innerHTML = "Hai già un profilo? Clicca su <strong>Accedi</strong> e inserisci email e password.";
    } else {
        campoNome.classList.add("nascosto");
        tabAccedi.classList.add("tab-attiva");
        tabRegistrati.classList.remove("tab-attiva");
        formBadge.textContent = "Bentornato su DaniFlix";
        authTitle.textContent = "Accedi";
        authSubtitle.textContent = "Entra nel tuo profilo e continua a guardare i tuoi contenuti preferiti.";
        bottoneAuth.textContent = "ACCEDI";
        inputPassword.setAttribute("autocomplete", "current-password");
        notaAccesso.innerHTML = "Non hai ancora un profilo? Clicca su <strong>Registrati</strong>, salva l'account e poi fai <strong>Accedi</strong>.";
    }
}

function validaCampiBase() {
    let valido = true;

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    if (!regexEmail.test(email)) {
        mostraErrore(inputEmail, erroreEmail, "Inserisci un indirizzo email valido");
        valido = false;
    } else {
        rimuoviErrore(inputEmail, erroreEmail);
    }

    if (!regexPassword.test(password)) {
        mostraErrore(inputPassword, errorePassword, "La password deve avere almeno 8 caratteri, una maiuscola, una minuscola e un numero");
        valido = false;
    } else {
        rimuoviErrore(inputPassword, errorePassword);
    }

    if (!checkboxAccetto.checked) {
        mostraErrore(checkboxAccetto, erroreAccetto, "Devi accettare le condizioni di utilizzo");
        valido = false;
    } else {
        rimuoviErrore(checkboxAccetto, erroreAccetto);
    }

    return valido;
}

function registraUtente() {
    messaggioSuccesso.textContent = "";

    const nome = inputNome.value.trim();
    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    let valido = validaCampiBase();

    if (nome.length < 2) {
        mostraErrore(inputNome, erroreNome, "Inserisci almeno 2 caratteri");
        valido = false;
    } else {
        rimuoviErrore(inputNome, erroreNome);
    }

    if (!valido) {
        return;
    }

    const utenteEsistente = cercaUtentePerEmail(email);

    if (utenteEsistente) {
        mostraErrore(inputEmail, erroreEmail, "Questa email è già registrata. Vai su Accedi.");
        return;
    }

    const utenti = leggiUtenti();

    const nuovoUtente = {
        nome: nome,
        email: email,
        password: password
    };

    utenti.push(nuovoUtente);
    salvaUtenti(utenti);

    // Dopo la registrazione porto l'utente nella schermata Accedi
    cambiaModalita("login");
    inputEmail.value = email;
    inputPassword.value = "";
    checkboxAccetto.checked = false;
    messaggioSuccesso.textContent = "Registrazione completata! Ora inserisci la password e clicca su Accedi.";
}

function accediUtente() {
    messaggioSuccesso.textContent = "";

    const email = inputEmail.value.trim();
    const password = inputPassword.value.trim();

    const valido = validaCampiBase();

    if (!valido) {
        return;
    }

    const utente = cercaUtentePerEmail(email);

    if (!utente || utente.password !== password) {
        mostraErrore(inputPassword, errorePassword, "Email o password non corretti. Prima registrati oppure controlla i dati.");
        return;
    }

    const sessioneUtente = {
        nome: utente.nome,
        email: utente.email,
        loggato: true
    };

    localStorage.setItem(CHIAVE_SESSIONE, JSON.stringify(sessioneUtente));
    messaggioSuccesso.textContent = "Accesso effettuato con successo!";

    bottoneAuth.disabled = true;
    setTimeout(function () {
        window.location.href = destinazione;
    }, 900);
}

linkGeneraPassword.addEventListener("click", function (e) {
    e.preventDefault();

    const maiuscole = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const minuscole = "abcdefghijklmnopqrstuvwxyz";
    const numeri = "0123456789";
    const simboli = "!@#$%^&*()";
    const tuttiCaratteri = maiuscole + minuscole + numeri + simboli;

    let password =
        maiuscole[Math.floor(Math.random() * maiuscole.length)] +
        minuscole[Math.floor(Math.random() * minuscole.length)] +
        numeri[Math.floor(Math.random() * numeri.length)];

    for (let i = password.length; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * tuttiCaratteri.length);
        password += tuttiCaratteri[randomIndex];
    }

    password = password.split("").sort(function () {
        return Math.random() - 0.5;
    }).join("");

    inputPassword.value = password;
    rimuoviErrore(inputPassword, errorePassword);
    messaggioSuccesso.textContent = "Password generata correttamente";
});

tabAccedi.addEventListener("click", function () {
    cambiaModalita("login");
});

tabRegistrati.addEventListener("click", function () {
    cambiaModalita("registrazione");
});

formAuth.addEventListener("submit", function (e) {
    e.preventDefault();

    erroreArchivio.textContent = "";
    try {
        if (modalita === "registrazione") {
            registraUtente();
        } else {
            accediUtente();
        }
    } catch {
        erroreArchivio.textContent = "Il browser non consente di salvare i dati locali.";
    }
});


// L’email della home viene consumata una sola volta.
cambiaModalita("login");
try {
    const emailPrecompilata = localStorage.getItem(CHIAVE_EMAIL);
    if (emailPrecompilata) {
        inputEmail.value = emailPrecompilata;
        localStorage.removeItem(CHIAVE_EMAIL);
    }
} catch {
    erroreArchivio.textContent = "L’archivio locale non è disponibile.";
}
