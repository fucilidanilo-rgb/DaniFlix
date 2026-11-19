const CHIAVE_UTENTI = "utentiRegistratiDaniFlix";
const CHIAVE_SESSIONE = "utenteLoggatoDaniFlix";
const CHIAVE_EMAIL = "emailPrecompilataDaniFlix";
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function leggiDatoLocale(chiave) {
    try {
        return JSON.parse(localStorage.getItem(chiave));
    } catch {
        return null;
    }
}

function leggiSessione() {
    const sessione = leggiDatoLocale(CHIAVE_SESSIONE);
    return sessione?.loggato === true && typeof sessione.nome === "string"
        ? sessione
        : null;
}
