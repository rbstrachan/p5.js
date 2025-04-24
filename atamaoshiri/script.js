const startLetterElement = document.getElementById("start-letter");
const endLetterElement = document.getElementById("end-letter");
const wordInputArea = document.querySelector(".word-input-area");
const hiddenInput = document.getElementById("hidden-input");
const submitButton = document.getElementById("submit-button");
const passButton = document.getElementById("pass-button");
const resultElement = document.getElementById("result");
const discordElement = document.getElementById("discord");
const scoreElement = document.getElementById("score");
const accentedLetterButtons = document.querySelectorAll(".accented-letters button");
const roundsElement = document.getElementById("round");
const averageElement = document.getElementById("average");
const rulesModal = document.getElementById("rules-modal");
const modalOverlay = document.getElementById("modal-overlay");
const closeRulesButton = document.getElementById("close-rules");

let startLetter = "";
let endLetter = "";
let score = 0;
let rounds = 1;
let averageScore = 0;
let enteredLetters = [];

function getRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function generateLetters() {
    const randomWord = getRandomWord();
    startLetter = randomWord[0];
    endLetter = randomWord[randomWord.length - 1];
    startLetterElement.textContent = startLetter.toUpperCase();
    endLetterElement.textContent = endLetter.toUpperCase();
    enteredLetters = [];
    updateCircles();
    hiddenInput.value = "";
    hiddenInput.focus();
}

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function validateWord(middlePart) {
    if (!middlePart) {
        return false;
    }
    const submittedWordWithoutAccents = removeAccents((startLetter + middlePart + endLetter).toLowerCase());
    const fullWordWithAccents = startLetter + middlePart.toLowerCase() + endLetter;

    return wordList.some(word => removeAccents(word) === submittedWordWithoutAccents) || wordList.includes(fullWordWithAccents);
}

function updateScore(wordLength) {
    score += wordLength;
    scoreElement.textContent = `Score: ${score}`;
    updateStats();
}

function updateStats() {
    rounds++;
    roundsElement.textContent = `Manche: ${rounds}`;
    averageScore = (score / (rounds - 1 || 1)).toFixed(2); // Éviter la division par zéro au début
    averageElement.textContent = `Moyenne: ${averageScore}`;
}

function updateCircles() {
    wordInputArea.innerHTML = "";
    enteredLetters.forEach(letter => {
        const circle = document.createElement("div");
        circle.classList.add("letter-circle");
        circle.textContent = letter.toUpperCase();
        wordInputArea.appendChild(circle);
    });
}

hiddenInput.addEventListener("input", function () {
    enteredLetters = this.value.toUpperCase().split("");
    updateCircles();
});

hiddenInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        submitButton.click();
    }
});

submitButton.addEventListener("click", function () {
    const submittedMiddlePart = enteredLetters.join("");
    if (validateWord(submittedMiddlePart)) {
        const wordLength = submittedMiddlePart.length;
        const fullWord = startLetter + submittedMiddlePart.toLowerCase() + endLetter;
        resultElement.textContent = `« ${fullWord} » est correct! Vous avez gagné ${wordLength} points.`;
        discordElement.textContent = ``;
        updateScore(wordLength);
        generateLetters();
    } else if (submittedMiddlePart) {
        const attemptedWord = startLetter + submittedMiddlePart.toLowerCase() + endLetter;
        resultElement.textContent = `Désolé, « ${attemptedWord} » n'est pas un mot valide. Essayez encore!`;
        discordElement.textContent = `Pas d'accord? Contactez reiwa sur Discord pour que je l'ajoute.`;
    } else {
        resultElement.textContent = `Veuillez essayer de deviner un mot avant de soumettre.`;
        discordElement.textContent = ``;
    }
});

passButton.addEventListener("click", function () {
    resultElement.textContent = "Vous avez passé ce mot.";
    generateLetters();
    updateStats();
});

accentedLetterButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const letter = this.dataset.letter.toUpperCase();
        hiddenInput.value += letter;
        enteredLetters = hiddenInput.value.split("");
        updateCircles();
        hiddenInput.focus();
    });
});

wordInputArea.addEventListener("click", () => {
    hiddenInput.focus();
});

window.onload = function () {
    rulesModal.style.display = "block";
    modalOverlay.style.display = "block";
    hiddenInput.focus();
};

closeRulesButton.addEventListener('click', function () {
    rulesModal.style.display = "none";
    modalOverlay.style.display = "none";
    hiddenInput.focus();
});

generateLetters();