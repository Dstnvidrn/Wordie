const wordFrame = document.querySelector("#word-frame");
const words = [
  "apple",
  "media",
  "named",
  "watch",
  "check",
  "wizard",
  "cheese",
  "possession",
];
const word = pickWord();
console.log(word);
let currentColumn = 0;
let currentRow = 0;
const columns = word.length;
const rows = 6;
let inputWord = "";
let attempts = rows;

const result = document.querySelector("#result");
const keyboardKeys = document.querySelectorAll(".key");

function createTiles(rows, columns) {
  wordFrame.style.gridTemplateColumns = `repeat(${1},5rem)`;

  for (let i = 0; i < columns; i++) {
    const tileRow = document.createElement("div");
    tileRow.style.display = "grid";
    tileRow.style.gridTemplateColumns = `repeat(${rows},5rem)`;
    tileRow.style.gap = "5px";
    tileRow.style.justifyContent = "center";
    tileRow.style.alignItems = "center";
    tileRow.id = `row-${i}`;

    for (let j = 0; j < rows; j++) {
      const tile = document.createElement("span");
      tile.style.display = "flex";
      tile.style.justifyContent = "center";
      tile.style.alignItems = "center";
      tile.classList.add("tile");
      tile.id = `tile-${i}${j}`;
      tileRow.appendChild(tile);
      wordFrame.insertAdjacentElement("beforeend", tileRow);
    }
  }
  getCurrentTile().classList.add("current-tile");
}

function pickWord() {
  const randomNumber = Math.floor(Math.random() * words.length);
  return words[randomNumber].toLowerCase();
}

function traverseLetters(letter) {
  if (currentRow === rows) {
    return;
  } else if (letter >= "a" && letter <= "z" && currentColumn < columns) {
    inputWord += letter;
    const keyboardLetter = document.querySelector(`#${letter}`);
    keyboardLetter.classList.add("typed");
    keyboardLetter.addEventListener("animationend", (e) => {
      e.currentTarget.classList.remove("typed");
    });
    document.querySelector(".current-tile")?.classList.remove("current-tile");
    const currentTile = getCurrentTile();
    currentTile.classList.add("typed");

    currentTile.textContent = letter;
    currentColumn++;
    getCurrentTile()?.classList.add("current-tile");
  } else if (currentColumn === columns && letter === "Enter") {
    currentColumn = 0;
    const keyboardEnter = document.querySelector("#enter");
    keyboardEnter.classList.add("typed");
    keyboardEnter.addEventListener("animationend", (e) =>
      e.currentTarget.classList.remove("typed")
    );
    validateWord(inputWord);
    getCurrentTile()?.classList.add("current-tile");
    inputWord = "";
    console.log(currentRow);
    currentRow++;
  } else if (letter === "Backspace" && currentColumn > 0) {
    inputWord = inputWord.substring(0, currentColumn - 1);
    const keyboardBackspace = document.querySelector("#backspace");
    keyboardBackspace.classList.add("typed");
    keyboardBackspace.addEventListener("animationend", (e) =>
      e.currentTarget.classList.remove("typed")
    );
    document.querySelector(".current-tile")?.classList.remove("current-tile");
    currentColumn === columns ? currentColumn-- : currentColumn--;
    const currentTile = getCurrentTile();
    currentTile.classList.remove("typed");
    currentTile.textContent = "";
    currentTile.classList.add("current-tile");
  }
}
/* Adds events to all on-screen keyboard and windows to capture keypress downs */
function addKeyEvents() {
  window.addEventListener("keydown", eventCallback);
  keyboardKeys.forEach((key) => {
    key.addEventListener("click", () => {
      if (key.id === "backspace") traverseLetters("Backspace");
      traverseLetters(key.textContent);
    });
  });
}
/*Receives and input string then validates it agaisnt the randomly generated word from pickWord() */
function validateWord(input) {
  const letterCount = {};
  const [...indexLetterArray] = word.split("").entries();
  indexLetterArray.forEach((pair) => {
    const [index, letter] = pair;
    letterCount[letter] ? letterCount[letter]++ : (letterCount[letter] = 1);
  });
  checkLetters(input, letterCount);
}

function checkLetters(input, letterCount) {
  let correctCounter = 0;

  const [...inputLettersSplit] = input.split("").entries();
  inputLettersSplit.forEach((subArray) => {
    const [index, letter] = subArray;
    addAnimations(currentRow, index);
    const tile = document.querySelector(
      `#row-${currentRow} :nth-child(${index + 1})`
    );

    if (
      letter === word[inputWord.indexOf(letter)] &&
      letterCount[letter] > 0 &&
      !tile.classList.contains("valid-letter")
    ) {
      document
        .querySelector(`#${letter}`)
        .classList.add("correct", "flip-card");
      tile.classList.add("correct");

      letterCount[letter]--;
      correctCounter++;
      if (correctCounter === input.length) {
        word.split("").forEach((letter) => {
          document.querySelector(`#${letter}`).classList.add("correct");
        });
        result.textContent = `You win!`;
        result.classList.add("result--win");

        addAnimations(currentRow, index, true);
        endGame();
        return;
      }
    } else if (
      word.includes(letter) &&
      !tile.classList.contains("correct") &&
      letterCount[letter] > 0
    ) {
      tile.classList.add("valid-letter");
      const key = document.querySelector(`#${letter}`);
      key.classList.add("valid-letter", "flip-card");
      letterCount[letter]--;
    }
  });
  attempts--;
  if (attempts === 0) {
    endGame();
    result.textContent = `Game over ☹. Word was ${word.toUpperCase()}`;
    result.classList.add("result--loss");
    return;
  }
  console.log(attempts);
}
function addAnimations(rowNumber, childNumber, victory = false) {
  const tile = document.querySelector(
    `#row-${rowNumber} :nth-child(${childNumber + 1})`
  );
  tile.style.animationDelay = `${childNumber * 0.15}s`;

  if (!victory) {
    tile.classList.add("flip-card");
  } else if (victory) {
    setTimeout(() => {
      for (let i = 0; i < columns; i++) {
        document
          .querySelector(`#row-${rowNumber} :nth-child(${i + 1})`)
          .classList.add("victory");
      }
    }, 1500);
  }
}
function eventCallback(event) {
  traverseLetters(event.key);
}
function endGame() {
  window.removeEventListener("keydown", eventCallback);
}

function init() {
  createTiles(columns, rows);
  addKeyEvents();
}
function getCurrentTile() {
  const tile = document?.querySelector(`#tile-${currentRow}${currentColumn}`);

  return tile;
}

init();
