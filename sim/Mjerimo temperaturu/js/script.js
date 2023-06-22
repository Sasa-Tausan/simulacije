"use strict";

//Dohvaćanje elemenata
const inputEl = document.querySelector("#inputTemp");
const handEL = document.querySelector("#hand");
const checkAnswerBtn = document.querySelector("#checkAnswerBtn");
const playBtnEl = document.querySelector("#playBtn");
const imgTempEl = document.querySelector("#imgTemp");
const imgTempTitleEl = document.querySelector("#imgTempTitle");
const imgContainerEl = document.querySelector(".img__content");
const messageEl = document.querySelector("#message");

//Deklariranje varijabli
const DEFAULT_HEIGHT = 35;
const MULTIPLY_CONSTANT = 4; //množimo vrijednost temp s 4 da dobijemo vrijednost u pixelima
let inputTemp;
let randomTemp;
let randomTempPx;
let disableEnableBoll = true;

//dodavanje event listenera
inputEl.addEventListener("input", checkTempValidation);
playBtnEl.addEventListener("click", playGameBtn);
checkAnswerBtn.addEventListener("click", checkAnswer);

//funkcije

function checkAnswer() {
  if (randomTemp === +inputTemp) {
    messageEl.textContent =
      "Odlično! Uspješno si očitao/očitala temperaturu na termometru.";
    inputEl.disabled = true;
    checkAnswerBtn.disabled = true;
  } else {
    messageEl.textContent = "Pomno promotri termometar. Pokušaj ponovno.";
  }
}

function checkTempValidation(e) {
  inputTemp = e.target.value;
  disableEnableBoll = checTempValidation(inputTemp);
  disableEnableCheckBtn(disableEnableBoll, randomTemp);
}

function playGameBtn() {
  resetGame();
  setTimeout(() => {
    playGame();
  }, 1000);
}

function resetGame() {
  handEL.style.height = `${DEFAULT_HEIGHT}px`;
  imgContainerEl.classList.remove("animation_el");
  imgContainerEl.classList.add("hide_animation_el");
  inputEl.disabled = false;
  inputEl.value = "";
  messageEl.textContent = "";
}

function playGame() {
  randomTemp = randomNumberGenerator(0, 21, 5);
  randomTempPx = randomTemp * MULTIPLY_CONSTANT + DEFAULT_HEIGHT;
  handEL.style.height = `${randomTempPx}px`;
  handEL.style.transition = "all 1s linear";
  imgAndTitleDisplay(randomTemp);
  imgContainerEl.classList.remove("hide_animation_el");
  imgContainerEl.classList.add("animation_el");
}

function randomNumberGenerator(min, max, step = 1) {
  //Funkcija koja generira broj između min i max ne uključuje max. Ako želimo uključiti i max tada bi kod izgledao (max - min + 1)
  return Math.floor(Math.random() * (max - min + min)) * step;
}

function imgAndTitleDisplay(temp) {
  switch (true) {
    case temp <= 10: {
      imgTempEl.src = `./img/zimski_dan_w300.png`;
      imgTempTitleEl.textContent = "HLADAN DAN";
      return;
    }
    case temp >= 11 && temp <= 20: {
      imgTempEl.src = `./img/topli_dan_w300.png`;
      imgTempTitleEl.textContent = "TOPAO DAN";
      return;
    }
    case temp >= 21 && temp <= 35: {
      imgTempEl.src = `./img/vruci_dan_w300.png`;
      imgTempTitleEl.textContent = "VRUĆ DAN";
      return;
    }
    case temp >= 36 && temp <= 50: {
      imgTempEl.src = `./img/topao_kakao_w300.png`;
      imgTempTitleEl.textContent = "TOPAO KAKAO";
      return;
    }
    case temp >= 51 && temp <= 70: {
      imgTempEl.src = `./img/caj_w300.png`;
      imgTempTitleEl.textContent = "ČAJ";
      return;
    }
    case temp >= 71 && temp <= 80: {
      imgTempEl.src = `./img/mikrovalna_w300.png`;
      imgTempTitleEl.textContent = "MIKROVALNA PEĆNICA";
      return;
    }
    case temp >= 81 && temp <= 90: {
      imgTempEl.src = `./img/pecnica_w300.png`;
      imgTempTitleEl.textContent = "PEĆNICA";
      return;
    }
    case temp >= 91: {
      imgTempEl.src = `./img/prokljucala_voda_w300.png`;
      imgTempTitleEl.textContent = "UZAVRELA VODA";
      return;
    }
  }
}

//funkcija za provjeru validacije inputa
function checTempValidation(temp) {
  //funkcija koja provjerava validaciju input polja. Polje ne može biti prazno, ne može broj biti manji od 0, manji od 23 i decimalni broj. Vraća true ili false.
  if (temp.length === 0 || temp === " ") {
    return false;
  }
  temp = Number(temp);
  if (temp >= 0 && temp <= 100 && temp % 1 === 0) {
    return true;
  } else {
    return false;
  }
}

function disableEnableCheckBtn(inputBool1, randomTemp) {
  //funkcija koja eneblea ili disablea gumb provjeri odgovor ovisno o tome jesu li input polja minute ili sati pravilno ispunjeni.
  if (inputBool1 && randomTemp !== undefined) {
    checkAnswerBtn.disabled = false;
  } else {
    checkAnswerBtn.disabled = true;
  }
}
