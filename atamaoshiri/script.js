// --- GLOBALS & ELEMENTS ---
const startLetterEl = document.getElementById("start-letter");
const endLetterEl = document.getElementById("end-letter");
const wordInputArea = document.querySelector(".word-input-area");
const hiddenInput = document.getElementById("hidden-input");
const submitButton = document.getElementById("submit-button");
const passButton = document.getElementById("pass-button");
const resultEl = document.getElementById("result");
const discordEl = document.getElementById("discord");
const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const averageEl = document.getElementById("average");
const accentedButtons = document.querySelectorAll(".accented-letters button");
const rulesModal = document.getElementById("rules-modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeRulesBtn = document.getElementById("close-rules");
const container = document.querySelector(".container");

let startLetter = "", endLetter = "";
let score = 0, rounds = 1;
let enteredLetters = [];

const SCORE_MAP = {
    a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8,
    k: 10, l: 1, m: 2, n: 1, o: 1, p: 3, q: 8, r: 1, s: 1, t: 1,
    u: 1, v: 4, w: 10, x: 10, y: 10, z: 10,
    é: 1, è: 1, ê: 1, à: 1, ç: 3, ï: 1
};

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function validateWord(midLetters) {
    if (!midLetters) return false;
    const full = (startLetter + midLetters + endLetter).toLowerCase();
    return wordList.some(w =>
        removeAccents(w.toLowerCase()) === removeAccents(full)
    );
}

function updateStats() {
    roundEl.textContent = `Tour: ${rounds}`;
    averageEl.textContent = `Moyenne: ${(score / Math.max(1, rounds - 1)).toFixed(2)}`;
}
function updateScore(len) {
    score += len;
    scoreEl.textContent = `Score: ${score}`;
}
function renderLetters() {
    const w = getRandomWord();
    startLetter = w[0].toUpperCase();
    endLetter = w[w.length - 1].toUpperCase();
    startLetterEl.textContent = startLetter;
    endLetterEl.textContent = endLetter;
}
function updateCircles() {
    wordInputArea.innerHTML = "";
    enteredLetters.forEach(letter => {
        const tile = document.createElement("div");
        tile.className = "letter-circle scrabble-tile";
        // tile letter
        const spL = document.createElement("span");
        spL.className = "tile-letter";
        spL.textContent = letter;
        tile.appendChild(spL);
        // tile score
        const spS = document.createElement("span");
        spS.className = "tile-score";
        spS.textContent = SCORE_MAP[letter.toLowerCase()] || 1;
        tile.appendChild(spS);
        wordInputArea.appendChild(tile);
    });
}

function animateWrong() {
    document.querySelectorAll(".scrabble-tile").forEach(el => {
        el.classList.add("shake");
        el.addEventListener("animationend", () =>
            el.classList.remove("shake"), { once: true }
        );
    });
}

function animateCorrect() {
    document.querySelectorAll(".scrabble-tile").forEach(el => {
        el.classList.add("pop");
        el.addEventListener("animationend", () =>
            el.classList.remove("pop"), { once: true }
        );
    });
}

function generateLetters() {
    renderLetters();
    enteredLetters = [];
    hiddenInput.value = "";
    updateCircles();
    hiddenInput.focus();
}

hiddenInput.addEventListener("input", () => {
    enteredLetters = hiddenInput.value.toUpperCase().split("");
    updateCircles();
});

hiddenInput.addEventListener("keydown", e => {
    if (e.key === " ") {
        e.preventDefault();
        return;
    }
    if (e.key === "Enter") {
        e.preventDefault();
        submitButton.click();
    }
});

// SUBMIT handler with fixes:
submitButton.addEventListener("click", () => {
    // join without commas
    const mid = enteredLetters.join("");
    fullWord = (startLetter + mid + endLetter).toLowerCase();
    if (validateWord(mid)) {
        animateCorrect();
        setTimeout(() => {
            const pts = mid.length;
            updateScore(pts);
            resultEl.textContent = `Le mot « ${fullWord} » est correct! Vous avez gagné ${pts} points.`;
            discordEl.textContent = "";
            rounds++;
            updateStats();
            generateLetters();
        }, 300);
    }
    else if (mid) {
        animateWrong();
        fullWord = (startLetter + mid + endLetter).toLowerCase();
        resultEl.textContent = `Désolé, « ${fullWord} » n'est pas valide. Essayez encore!`;
        discordEl.textContent = `Pas d'accord? Contactez reiwa sur Discord pour que je l'ajoute.`;
        hiddenInput.focus();
    }
    else {
        resultEl.textContent = `Entrez un mot avant de soumettre.`;
        discordEl.textContent = "";
        hiddenInput.focus();
    }
});

passButton.addEventListener("click", () => {
    resultEl.textContent = "Vous avez passé ce mot.";
    discordEl.textContent = "";
    rounds++;
    updateStats();
    generateLetters();
});

accentedButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const letter = btn.dataset.letter.toUpperCase();
        hiddenInput.value += letter;
        enteredLetters = hiddenInput.value.split("");
        updateCircles();
        hiddenInput.focus();
    });
});

wordInputArea.addEventListener("click", () => hiddenInput.focus());
document.addEventListener("click", function (e) {
    if (!e.target.closest("button")) {
        hiddenInput.focus();
    }
});

window.addEventListener("load", () => {
    rulesModal.style.display = "block";
    modalOverlay.style.display = "block";
});
closeRulesBtn.addEventListener("click", () => {
    rulesModal.style.display = "none";
    modalOverlay.style.display = "none";
    hiddenInput.focus();
});

generateLetters();
updateStats();