"use strict";

//Dohvacanje elemenata
const nlo = document.querySelector(".nlo");
const newGameBtn = document.querySelector("#newGame");
const checkAnswerBtn = document.querySelector("#checkAnswer");
const answerContainerEl = document.querySelectorAll(".answer-container");
const answerOptionEl = document.querySelectorAll(".answer");
const helpEl = document.querySelector(".help-element");
const modalWindowEl = document.querySelector(".modal-window");
const bodyEl = document.querySelector("body");
const closeBtnModal = document.querySelector("#closeBtnModal");
const nloModal = document.querySelector(".nlo-modal");
const messageAnswer = document.querySelector(".message-content");
//////////////////////////////////////////////////////////////////////////////////////////////

//deklariranje varijabli
let answer = [];
let userAnswer;
let degNloMovement;
let randomMonth;
let durationAnimateNlo;
const DURATION_ANIMATION_MONTH = 100; //vrijeme trajanja animacije za jedan mjesec
const DEG_TO_MONTH = 28.75; // Konstanta za pretvaranje stupnjeva u mjesec
const ADD_TO_DEG = 15; // kod generiranja stupnjeva nadodajemo 15 budući da ne kreće od 0
const imgAnswerOptionObject = {
  1: "Nova godina",
  2: "Valentinovo",
  3: "Dan voda",
  4: "Dan planeta Zemlje",
  5: "Dan državnosti",
  6: "Tijelovo",
  7: "Dan biciklizma",
  8: "Dan humanosti",
  9: "Dan mira",
  10: "Dani kruha",
  11: "Dan djeteta",
  12: "Božić",
};
//////////////////////////////////////////////////////////////////////////////////////////////
//inicijalno postavljanje
initNloAnimation();
createImgPElement();

/////////////////////////////////////////////////////////////////////
//dodavanje event listenera
newGameBtn.addEventListener("click", newGame);
helpEl.addEventListener("click", displayModal);
closeBtnModal.addEventListener("click", closeModal);
checkAnswerBtn.addEventListener("click", checkAnswer);

////////////////////////////////////////////////////////////////////
//funkcije za event listenere
function newGame() {
  removeClass();
  checkAnswerBtn.disabled = true;
  randomMonthGenerator();
  answer = answerOptions();
  addImgPTextAnswerOption();
  showHelpAnswerElement();
  hideHelpAnswerElement();
  answerContainerEl.forEach((element) => {
    element.addEventListener("click", selectActiveAnswer);
  });
  nloAnimation();
  animateAnswers();
  messageAnswer.textContent = "";
  messageAnswer.style.border = `1px solid white`;
}

function displayModal() {
  bodyEl.firstElementChild.classList.toggle("blur-body");
  modalWindowEl.classList.toggle("animation-modal-window");
  modalWindowEl.classList.toggle("hidden");
  nloModal.classList.toggle("nlo-modal-an");
}

function closeModal() {
  bodyEl.firstElementChild.classList.toggle("blur-body");
  modalWindowEl.classList.toggle("animation-modal-window");
  modalWindowEl.classList.toggle("hidden");
  nloModal.classList.toggle("nlo-modal-an");
}

function checkAnswer() {
  if (randomMonth === userAnswer) {
    messageAnswer.textContent = `Odlično! Ponovno pokreni igru i nastavi vježbati.`;
    messageAnswer.style.border = `5px solid #0bad1b`;
  } else {
    messageAnswer.textContent = `Pokušaj ponovno! Pogledaj na kojem se broju zaustavio vremenski stroj.`;
    messageAnswer.style.border = `5px solid #ffb300`;
  }
}

function selectActiveAnswer(e) {
  //funkcija koja prikazuje koji je element korisnik kliknuo i postavlja tu vrijednost u varijablu za usporedbu odgovora.
  removeClass();
  const element = e.target;
  element.closest(".answer-container").classList.add("answer-active");
  userAnswer = Number(element.closest(".answer-container").dataset.month);
  checkAnswerBtn.disabled = false;
}

////////////////////////////////////////////////////////////////////////////////////
//js animation funkcije
function removeClass() {
  answerContainerEl.forEach((element) => {
    element.classList.remove("answer-active");
  });
}

function nloAnimation() {
  const roundNloAnimate = [
    { transform: "rotate(0deg) translateY(-120px)" },
    { transform: `rotate(${degNloMovement}deg) translateY(-120px)` },
  ];
  const roundNloTiming = {
    duration: durationAnimateNlo,
    fill: "forwards",
  };
  nlo.animate(roundNloAnimate, roundNloTiming);
}

function initNloAnimation() {
  const initNloAnimate = [{ transform: "translateY(-120px)" }];
  const initNloAnimateTaminig = { duration: 1000, fill: "forwards" };
  nlo.animate(initNloAnimate, initNloAnimateTaminig);
}

function animateAnswers() {
  //funkcija animira opcije odgovora prije prikaza
  const answerAnimate = [{ opacity: 0 }, { opacity: 1 }];
  const answerAnimateTiming = { duration: durationAnimateNlo };
  answerOptionEl.forEach((element) => {
    element.animate(answerAnimate, answerAnimateTiming);
  });
}

////////////////////////////////////////////////////////////////////////
//funkcije
function randomNumberGenerator(min, max, step = 1) {
  return Math.trunc(Math.random() * (max - min + min + 1)) * step;
}

function answerOptions() {
  //funkcija koja stvara array ponuđenih odgovora i ispremješa ih prije pregleda
  const answerOption = [];
  answerOption.push(randomMonth);
  while (answerOption.length !== 3) {
    let tempVar = Math.trunc(Math.random() * 12 + 1);
    if (answerOption.includes(tempVar)) {
      tempVar = Math.trunc(Math.random() * 12 + 1);
    } else {
      answerOption.push(tempVar);
    }
  }
  return shuffle(answerOption);
}

function shuffle(array) {
  //funkcija koja ispremješa poredak odgovora
  var m = array.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function createImgPElement() {
  //funkcija inicijalno kreira element slika i paragraf
  answerOptionEl.forEach((element) => {
    let img = document.createElement("img");
    let paragraph = document.createElement("p");
    element.appendChild(img);
    element.appendChild(paragraph);
  });
}

function addImgPTextAnswerOption() {
  //funkcija postavlja određenu sliku i tekst, ovisno o ponuđenim odgovorima
  let counter = 0;
  answerOptionEl.forEach((element) => {
    element.parentElement.dataset.month = answer[counter];
    element.firstElementChild.src = `./img/${answer[counter]}.jpg`;
    element.lastElementChild.textContent = `${
      imgAnswerOptionObject[answer[counter]]
    }`;
    element.lastElementChild.classList.add("help-answer");
    element.lastElementChild.classList.add("hidden");
    counter++;
  });
}

function showHelpAnswerElement() {
  //funkcija prikazuje element help-answer
  answerOptionEl.forEach((element) => {
    element.onmouseover = () => {
      element.lastElementChild.classList.remove("hidden");
    };
  });
}

function hideHelpAnswerElement() {
  //funkcija skriva element help-answer (poseban dan koji piše na slici)
  answerOptionEl.forEach((element) => {
    element.onmouseleave = () => {
      element.lastElementChild.classList.add("hidden");
    };
  });
}

function randomMonthGenerator() {
  //Generira mjesec koji će se pogađati i vrijeme animacije nlo elementa ovisno o mjesecu koji je generiran
  degNloMovement = randomNumberGenerator(0, 11, 30) + ADD_TO_DEG;
  randomMonth = Math.round(degNloMovement / DEG_TO_MONTH);
  durationAnimateNlo = randomMonth * DURATION_ANIMATION_MONTH;
}
