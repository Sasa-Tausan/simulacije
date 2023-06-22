"use strict";

//Dohvaćanje elemenata
const newGameBtn = document.querySelector("#newGame");
const daysEl = document.querySelectorAll(".day");
const daysBoxEl = document.querySelectorAll(".day-content");
const answersEl = document.querySelectorAll(".element");
const helpMessage = document.querySelector(".help-message");
const helpBtn = document.querySelector("#help");
const modalWindowEl = document.querySelector(".modal-window");
const bodyEl = document.querySelector("body");
const btnCloseEl = document.querySelector("#btnClose");
const imgEl = document.querySelectorAll(".img-correct");
///////////////////////////////////////////////////////////

//Deklaracija varijabli
let dragItem;
const taskArray = ["yesterday", "today", "tomorrow"];
const days = [
  "subota",
  "nedjelja",
  "ponedjeljak",
  "utorak",
  "srijeda",
  "četvrtak",
  "petak",
  "subota",
  "nedjelja",
  "ponedjeljak",
  "utorak",
];
const colorDays = {
  ponedjeljak: "monday",
  utorak: "tuesday",
  srijeda: "wednesday",
  četvrtak: "thursday",
  petak: "friday",
  subota: "saturday",
  nedjelja: "sunday",
};
let answerArray = []; // varijabla koja će sadržavati točne odgovore
let guessDay; // varijabla koja će sadržavati dan koji se pogađa (ponedjeljak, utorak, srijeda)
let taskDay; // varijabla koja će sadržavati dan koji se pogađa (jučer, danas, sutra)
//////////////////////////////////////////////////////////////////////////////////////

//Pokretanje igre svaki puta kada se učita stranica (lakši pristup umjesto reset funkcije)
window.onload = newGame();

//Dodavanje event listenera
newGameBtn.addEventListener("click", refreshPage);
helpBtn.addEventListener("click", openModal);
btnCloseEl.addEventListener("click", closeModal);

//////////////////////////////////////////////////////////////////////////////////////
//Funkcija za add event listenere
function refreshPage() {
  window.location.reload();
}

function openModal() {
  modalWindowEl.classList.toggle("hidden");
  bodyEl.firstElementChild.classList.toggle("blur-body");
}

function closeModal() {
  modalWindowEl.classList.toggle("hidden");
  bodyEl.firstElementChild.classList.toggle("blur-body");
}

/////////////////////////////////////////////////////////////////////////////////////
//funkcije
function newGame() {
  addDraggableAttribut();
  addDragFunctionsToDays();
  createTaskAndAnswers();
  addDropZoneToUserAnswers();
  addDropZoneToDays();
}

function addDraggableAttribut() {
  //Funkcija nadodaje draggable atribut na sve elemente dani kada se pokrene igra
  daysEl.forEach((day) => {
    day.setAttribute("draggable", true);
  });
}

function addDragFunctionsToDays() {
  //funkcija nadodaje event listenere na elemente dane (ponedjeljak, utorak, srijeda itd.)
  daysEl.forEach((day) => {
    day.addEventListener("dragstart", dragStart);
    day.addEventListener("dragend", dragEnd);
  });
}

function createTaskAndAnswers() {
  //funkcija generira koji dan će se pogađati (jučer, danas, sutra) i naziv dana (ponedjeljak, utorak, srijeda);
  const indexNumberTask = getRandomNumber(0, 3);
  const indexNumberDay = getRandomNumber(2, 7);
  guessDay = days[indexNumberDay];
  taskDay = taskArray[indexNumberTask];
  answerArray = createAnswer(days, taskDay, indexNumberDay);
  addDataActiveToTaskEl();
}

function createAnswer(_array, taskDay, indexDay) {
  //funkcija vraća niz dana kao točan odgovor (npr. ponedjeljak, utorak, srijeda)
  switch (taskDay) {
    case "yesterday":
      return [_array[indexDay], _array[indexDay + 1], _array[indexDay + 2]];
    case "today":
      return [_array[indexDay - 1], _array[indexDay], _array[indexDay + 1]];
    case "tomorrow":
      return [_array[indexDay - 2], _array[indexDay - 1], _array[indexDay]];
  }
}

function addDataActiveToTaskEl() {
  //funkcija postavlja data active atribut na element ovisno o danu koji je generiran (jučer, danas, sutra)
  //također poziva funkciju koja kreira element ime dana (ponedjeljak, utotrak, srijeda itd..) na zadani element jučer, danas, sutra
  answersEl.forEach((answer) => {
    if (answer.id === taskDay) {
      answer.dataset.active = "active";
      createTaskDayEl(answer);
      return;
    }
  });
}

function createTaskDayEl(element) {
  //funkcija kreira i prikazuje dan koji je početno zadan
  const el = document.createElement("div");
  el.classList.add("day", colorDays[guessDay], "task-display-an");
  el.dataset.day = `${guessDay}`;
  el.textContent = firstLetterUpperCase(guessDay);
  element.append(el);
}

function checkUserDragElAndUserAnswer() {
  //funkcija provjera da li je korisnik stavio u oba elementa (answer elementi) svoje odgovore i provjerava da li je odgovor točan
  const helpArray = [];
  let checkAnswerBoll;
  const answersElArray = Array.from(answersEl);
  answersElArray
    .filter((element) => !element.dataset.active)
    .forEach((answer) => {
      if (answer.children.length === 1) {
        helpArray.push(1);
      }
    });

  checkAnswerBoll = checkLengthArray(helpArray.length, 2);
  checkFinalWithDisplayAnswer(checkAnswerBoll);
}

function checkFinalWithDisplayAnswer(bool) {
  //funkcija postavlja odgovarajuću poruku ovisno da li su odgovori točni ili netočni
  if (bool) {
    borderRedAnswer(); // funkcija postavlja crveni okvir na element koji nije točan
    if (checkLengthArray(checkAnswer(), 3)) {
      displayMessage(true);
      displayImg(); // funkcija prikazuje slike kada je odgovor točan
    } else {
      displayMessage(false);
    }
  }
}

function checkAnswer() {
  //funckija provjerava odgovore da li su točni i vraća dužina arraya koji mora biti 3 ako su sva tri rezultata točna
  const helpArray = [];
  answersEl.forEach((element, index) => {
    const inputAnswer = element.firstElementChild.dataset.day;
    if (inputAnswer === answerArray[index]) {
      helpArray.push(1);
    }
  });

  return helpArray.length;
}

function displayImg() {
  //funkcija prikazuje random slike kada je odgovor točan
  const randomImgIndex = getRandomNumber(0, 3);
  imgEl.forEach((img, index) => {
    img.src = `./img/${randomImgIndex}-${index}.png`;
  });
}

function displayMessage(boll) {
  //funkcija postavlja odgovarajuću poruku ovisno da li je odgovor točan ili netočan
  if (boll) {
    helpMessage.textContent = `Odlično! Ponovno pokreni igru i nastavi vježbati.`;
  } else {
    helpMessage.textContent = `Pokušaj ponovno! Dan unutar crvenog okvira je netočan.`;
  }
}

////////////////////////////////////////////////////////////////////////////////////

//Funkcije za drag atribute
function addDropZoneToUserAnswers() {
  //Funkcija postavlja drop zonu na elemente answer koji nemaju data atribut active. Element koji ima atribut active je onaj element oko kojeg se vrti zadatak.
  answersEl.forEach((answer) => {
    if (!answer.dataset.active) {
      answer.addEventListener("dragover", dragOver);
      answer.addEventListener("drop", dragDrop);
    }
  });
}

function addDropZoneToDays() {
  //Funckija koja postavlja drop zonu na elemente dani, ona omogućuje da korisnik vrati element na svoje mjesto
  daysBoxEl.forEach((element) => {
    element.addEventListener("dragover", dragOver);
    element.addEventListener("dragenter", dragEnter);
    element.addEventListener("dragleave", dragLeave);
    element.addEventListener("drop", dragDropReverse);
  });
}

function dragStart() {
  dragItem = this;
  setTimeout(() => dragItem.classList.add("day-hidden-an"), 100);
}

function dragEnd() {
  dragItem.classList.remove("day-hidden-an");
  dragItem = null;
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {
  //funkcija provjerava odgovara li element, elementu dan koji se vraća i ispisuje prigodnu poruku
  if (this.dataset.day !== dragItem.id) {
    helpMessage.textContent = "Dan moraš vratiti unutar njegova okvira.";
  }
}

function dragLeave() {
  helpMessage.textContent = "";
}

function dragDrop() {
  //funkcija postavlja dropzone na elemente zadaci.
  //funckija provjera da se element može staviti samo ako je prazan.
  if (!this.firstElementChild) {
    this.append(dragItem);
  }
  checkUserDragElAndUserAnswer();
  removeRedBorder();
}
function dragDropReverse() {
  //funkcija postavlja dropzone na elemente dane kada se vraćaju iz elemenata zadaci.
  //Funkcija provjerava da se element može vratiti samo na svoje mjesto.
  if (this.dataset.day === dragItem.id) {
    this.append(dragItem);
  }
  removeRedBorder();
  helpMessage.textContent = "";
}

function borderRedAnswer() {
  //funkcija provjerava da li je odgovor točan, a ako nije stavlja crveni okvir
  answersEl.forEach((element, index) => {
    if (element.firstElementChild.dataset.day !== answerArray[index]) {
      element.style.border = `3px solid red`;
    }
  });
}

function removeRedBorder() {
  answersEl.forEach((element) => {
    if (!element.firstElementChild) {
      element.style.border = `3px solid black`;
    }
  });
}

////////////////////////////////////////////////////////////////////////////////////
//Pomoćne funkcije

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function firstLetterUpperCase(string) {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}

function checkLengthArray(_arrayLength, length) {
  //funkcija provjerava dužinu niza
  if (_arrayLength === length) {
    return true;
  } else {
    return false;
  }
}
