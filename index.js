const areaUtente = document.getElementById("areaUtente");
const form = document.getElementById("form-abbonamento");
const emailInput = document.getElementById("email");
const erroreEmail = document.getElementById("erroreEmail");
const btnAbbonati = document.getElementById("abbonati");
let sessione = leggiSessione();

function aggiornaBottoneAbbonati() {
    const altezzaScorribile = document.documentElement.scrollHeight - window.innerHeight;
    btnAbbonati.classList.toggle("mostra",
        !sessione && altezzaScorribile > 0 && window.scrollY >= altezzaScorribile / 4);
}

function aggiornaAreaUtente() {
    areaUtente.replaceChildren();
    form.classList.toggle("nascosto-login", Boolean(sessione));

    if (sessione) {
        const saluto = document.createElement("span");
        saluto.className = "nome-utente";
        saluto.textContent = `Ciao, ${sessione.nome}`;

        const logout = document.createElement("button");
        logout.id = "Logout";
        logout.type = "button";
        logout.textContent = "Logout";
        logout.addEventListener("click", () => {
            localStorage.removeItem(CHIAVE_SESSIONE);
            sessione = null;
            aggiornaAreaUtente();
            document.getElementById("Accedi").focus();
        });
        areaUtente.append(saluto, logout);
    } else {
        const accesso = document.createElement("a");
        accesso.id = "Accedi";
        accesso.href = "form.html";
        accesso.textContent = "Accedi";
        areaUtente.append(accesso);
    }
    aggiornaBottoneAbbonati();
}

form.addEventListener("submit", (evento) => {
    evento.preventDefault();
    const email = emailInput.value.trim();
    if (!regexEmail.test(email)) {
        erroreEmail.textContent = "Inserisci un indirizzo email valido.";
        emailInput.setAttribute("aria-invalid", "true");
        emailInput.focus();
        return;
    }

    erroreEmail.textContent = "";
    emailInput.removeAttribute("aria-invalid");
    try {
        localStorage.setItem(CHIAVE_EMAIL, email);
        location.href = "form.html";
    } catch {
        erroreEmail.textContent = "Il browser non consente di salvare l’email per il passaggio al form.";
    }
});

window.addEventListener("scroll", aggiornaBottoneAbbonati, { passive: true });
window.addEventListener("resize", aggiornaBottoneAbbonati);
window.addEventListener("storage", (evento) => {
    if (evento.key === CHIAVE_SESSIONE || evento.key === null) {
        sessione = leggiSessione();
        aggiornaAreaUtente();
    }
});
aggiornaAreaUtente();

const video = document.querySelector("#preview-container video");
const playButton = document.getElementById("playButton");
const muteButton = document.getElementById("mute");

function aggiornaPlay() {
    playButton.textContent = video.paused ? "▶ Guarda" : "⏸ Pausa";
}

function avviaVideo(elemento) {
    // Se il browser blocca l’autoplay, resta disponibile il comando manuale.
    elemento.play().catch(() => {});
}

playButton.addEventListener("click", () => {
    if (video.paused) avviaVideo(video);
    else video.pause();
});
for (const evento of ["play", "pause", "ended"]) {
    video.addEventListener(evento, aggiornaPlay);
}
aggiornaPlay();

muteButton.addEventListener("click", () => {
    video.muted = !video.muted;
    muteButton.textContent = video.muted ? "🔇 Attiva audio" : "🔊 Disattiva audio";
});

const gallery = document.querySelector(".gallery");

function showStranger(stagione) {
    for (const gruppo of gallery.querySelectorAll(".item")) {
        gruppo.style.display = gruppo.id === stagione ? "flex" : "none";
    }
    gallery.scrollTo({ left: 0, behavior: "instant" });
}
showStranger(document.getElementById("strangerSelect").value);

function collegaFrecce(contenitore, sinistra, destra) {
    document.getElementById(sinistra).addEventListener("click", () => {
        contenitore.scrollBy({ left: -contenitore.clientWidth * 0.8, behavior: "smooth" });
    });
    document.getElementById(destra).addEventListener("click", () => {
        contenitore.scrollBy({ left: contenitore.clientWidth * 0.8, behavior: "smooth" });
    });
}

collegaFrecce(gallery, "btn-sinistro", "btn-destro");
collegaFrecce(document.querySelector(".category-container"), "btn-left", "btn-right");
collegaFrecce(document.getElementById("trailer-slider"), "prev-trailer", "next-trailer");

const listaVideo = [
    "trailer/videotrailer1.mp4",
    "trailer/videotrailer2.mp4",
    "trailer/videotrailer3.mp4",
    "trailer/videotrailer4.mp4",
    "trailer/videotrailer5.mp4",
];
const modale = document.getElementById("videoModal");
const player = document.getElementById("player");
let riprendiAnteprima = false;

function apriVideo(indice) {
    if (!listaVideo[indice] || modale.open) return;

    riprendiAnteprima = !video.paused;
    video.pause();
    player.src = listaVideo[indice];
    modale.showModal();
    avviaVideo(player);
}

modale.querySelector(".close-btn").addEventListener("click", () => modale.close());
modale.addEventListener("click", (evento) => {
    if (evento.target !== modale) return;
    const { left, right, top, bottom } = modale.getBoundingClientRect();
    if (evento.clientX < left || evento.clientX > right ||
        evento.clientY < top || evento.clientY > bottom) {
        modale.close();
    }
});
modale.addEventListener("close", () => {
    player.pause();
    player.removeAttribute("src");
    player.load();
    if (riprendiAnteprima) avviaVideo(video);
});
