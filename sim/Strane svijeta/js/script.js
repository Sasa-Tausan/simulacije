"use strict";

//dohvaćanje DOM elemenata
const levelContentEl = document.querySelector(".level-content");
const dropzoneEls = document.querySelectorAll("[data-attribute=dropzone]");
const arrowEl = document.querySelector(".arrow-content");
const imgContentEl = document.querySelector("#img-content");
const newItemBtn = document.querySelector("#newItem");
const messageContentEl = document.querySelector(".message-content");
const taskMessageEl = document.querySelector("#taskMessage");
const newGameBtn = document.querySelector("#newGame");
const helpBtnEl = document.querySelector("#helpBtn");
const manualBtn = document.querySelector("#manualBtn");
////////////////////////////////////////////////////////////////////////////

//deklaracija varijabli
let activeLevel;
let shiftToRight; //za koliko će se pomknuti niz u desno
let dragItem;
let reshuffleArray;
let reshuffleWorldSides;
let counter = 0; // counter koji broji koliko je predmeta postavljeno
const sideWorldsArr = ["sz", "s", "si", "i", "ji", "j", "jz", "z"];
//prettier-ignore
const itemsArray = ["backpack", "ball" ,"bed", "book", "chair", "plant", "table", "tent",];

//pozicije strelice koja prikazuje sjever
const ArrowObject = {
  0: {
    top: -2,
    left: 47,
    rotate: 0,
  },
  2: {
    top: 43,
    left: 95,
    rotate: 90,
  },

  4: {
    top: 87,
    left: 47,
    rotate: 180,
  },
  6: {
    top: 43,
    left: 4,
    rotate: 270,
  },
};

const messageObject = {
  init: "Odaberi razinu i kreni uređivati svoju sobu.",
  rightAnswer:
    "Dobro si postavio/postavila predmet. Klikni na gumb Novi predmet i nastavi uređivati svoju sobu.",
  wrongAnswer: "Pokušaj ponovno! Klikni na gumb Pomoć.",
  gameOver:
    "Odlično! Sve si predmete postavio/postavila na dobru stranu svijeta.",
};

const fullNameSides = {
  sz: "sjeverozapadu",
  si: "sjeveroistočnu",
  s: "sjevernu",
  j: "južnu",
  ji: "jugoistočnu",
  jz: "jugozapadnu",
  i: "istočnu",
  z: "zapadnu",
};
/////////////////////////////////////////////////////////////////////////////////////////////
//reset igre
newGameBtn.addEventListener("click", refreshPage);

function refreshPage() {
  window.location.reload();
}

//početak nove igre
levelContentEl.addEventListener("click", newGameFn);

messageContentEl.textContent = messageObject.init;

//funkcija koja pokreće igru
function newGameFn(e) {
  if (!e.target.id) return;
  chooseLevelFn(e.target);
  displayWorldSidesFn();
  reshuffleArray = shuffle(itemsArray); //funkcija reshufla slike koje će se prikazivati u img elementu
  reshuffleWorldSides = shuffle(sideWorldsArr);
  ImgElFn(); //funkcija u sebi sadrži funkcije koje kreiraju img element i koje ga činer draggabilnim
  disableLevelBtn();
}

/////////////////////////////////////////////////////////////////

//Odabir levela
function chooseLevelFn(element) {
  element.classList.add("active-level");
  activeLevel = element.id;
  const siblingEl =
    activeLevel === "advanced"
      ? element.previousElementSibling
      : element.nextElementSibling;
  siblingEl.classList.remove("active-level");
}
///////////////////////////////////////////////////////////////////

//listeneri za drag and drop

function makeDropzoneFn() {
  dropzoneEls.forEach((el) => {
    el.addEventListener("dragover", dragOver);
    el.addEventListener("dragleave", dragLeave);
    el.addEventListener("drop", dragDrop);
  });

  function dragOver(e) {
    e.preventDefault();
  }

  function dragLeave() {
    this.style.border = "2px solid var(--secondaryColor)";
  }

  function dragDrop() {
    if (this.childElementCount < 2 && counter <= 8) {
      dragItem.classList.add("dropzone-content", "grid-item-center");
      this.append(dragItem);
      const borderColor = checkAnswer(this) ? "none" : "red";
      const state = this.id === dragItem.dataset.attribut ? false : true;
      const answer = checkAnswer(this) ? "rightAnswer" : "wrongAnswer";
      newItemBtn.disabled = state;
      dragItem.setAttribute("draggable", state);
      messageContentEl.textContent = messageObject[answer];
      this.style.border = `3px solid ${borderColor}`;
      if (checkAnswer(this)) taskMessageEl.textContent = "";
      if (counter === 8);
      checkCounter();
    }
  }
}

function checkAnswer(dropzoneEl) {
  //funkcija provjerava je li učenik stavio sliku na pravu stranu svijeta
  return dropzoneEl.id === dragItem.dataset.attribut ? true : false;
}

function checkCounter() {
  //funkcija provjera je li svih 8 slika prikazano da se disablea gumb novi predmet i da se pokaže završna poruka
  if (counter === 8) {
    newItemBtn.disabled = true;
    messageContentEl.textContent = messageObject.gameOver;
    taskMessageEl.textContent = "";
  }
}

function disableLevelBtn() {
  for (const child of levelContentEl.children) {
    child.disabled = true;
  }
}

////////////////////////////////////////////////////////////////////////////////////////

newItemBtn.addEventListener("click", addNewItem);

function addNewItem() {
  if (!newItemBtn.disabled && counter < 8) ImgElFn();
  newItemBtn.disabled = true;
}

function ImgElFn() {
  createImgEl();
  makeImgElDraggable();
  makeDropzoneFn();
}

function createImgEl() {
  //funkcija kreira img element
  const side = reshuffleWorldSides[counter];
  const child = ` <img src="./img/${reshuffleArray[counter]}.png" alt="" class="item-img dropzone-content grid-item-center" data-attribut=${side} />`;
  imgContentEl.insertAdjacentHTML("afterbegin", child);
  taskMessageEl.textContent = `Postavi predmet na ${fullNameSides[side]} stranu sobe.`;
  taskMessageEl.style.fontSize = "0.9rem";
  counter++;
}

function makeImgElDraggable() {
  //funkcija na kreirani Img postavlja atribut draggable
  const itemImgEl = document.querySelectorAll(".item-img");
  itemImgEl.forEach((el) => {
    el.addEventListener("dragstart", dragStart);
    el.addEventListener("dragend", dragEnd);
  });

  function dragStart() {
    dragItem = this;
    setTimeout(() => dragItem.classList.add("invisible"), 0);
  }

  function dragEnd() {
    dragItem.classList.remove("invisible");
    dragItem = null;
  }
}

function displayWorldSidesFn() {
  // funkcija prikazuje elemente strane svijeta ovisno o odabranom levelu
  if (activeLevel === "beginner") displaySideWorldsEl(sideWorldsArr);
  if (activeLevel === "advanced") displaySideWorldsEl(shiftWorldSides());
  displayArrowNorth();
}

function shiftWorldSides() {
  //funkcija pomiče u desno niz koji sadrži nazive strana svijeta i vraća taj niz
  shiftToRight = getRndInteger(2, 8, 2); //za koliko mjesta će se pomaknuti elementi niza u desno
  const shiftedArray = arrayRotate(sideWorldsArr, -shiftToRight);
  return shiftedArray;
}

function displayArrowNorth() {
  //funkcija prikazuje element koji pokazuje na sjever ovisno o odabranom levelu
  if (activeLevel === "beginner") shiftToRight = 0;
  shiftToRight === 0 ? addArrowAbsPos(0) : addArrowAbsPos(shiftToRight);
}

function addArrowAbsPos() {
  //funkcija nadodaje poziciju za element koji pokazuje gdje je sjever
  arrowEl.style.top = `${ArrowObject[shiftToRight].top}%`;
  arrowEl.style.left = `${ArrowObject[shiftToRight].left}%`;
  arrowEl.style.rotate = `${ArrowObject[shiftToRight].rotate}deg`;
}

function getRndInteger(min, max, step) {
  //nije uključen max niti min
  //funkcija generira random broj
  const range = (max - min) / step;
  return Math.floor(Math.random() * range) * step + min;
}

function arrayRotate(arr, count) {
  const copyArray = [...arr];
  //shift array left or right
  //ako je minus count - array se shifta u lijevo
  // ako je plus count - array se shifta u desno
  count -= copyArray.length * Math.floor(count / copyArray.length);
  copyArray.push.apply(copyArray, copyArray.splice(0, count));
  return copyArray;
}

function displaySideWorldsEl(arr) {
  //funkcija prikazuje elemente strane svijeta

  dropzoneEls.forEach((el, index) => {
    const sideWorld = arr[index].toUpperCase();
    el.id = `${arr[index]}`;
    el.firstElementChild.textContent = sideWorld;
  });
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

///////////////////////////////////////////////////////////////
//prikazivanje pomoći
helpBtnEl.addEventListener("click", helpGame);
const dropzoneContentEl = document.querySelectorAll(".dropzone-content");
function helpGame() {
  displayHelp();
  setTimeout(removeHelp, 3000);
}

function displayHelp(elements) {
  dropzoneContentEl.forEach((el) => {
    el.classList.remove("invisible");
    el.style.zIndex = 30;
  });
}

function removeHelp(elements) {
  dropzoneContentEl.forEach((el) => {
    el.classList.add("invisible");
  });
}

//////////////////////////////////////////////////////////////////////
//prikazivanje uputa
manualBtn.addEventListener("mouseover", helpBtnFnMouseOverFn);
manualBtn.addEventListener("mouseout", helpBtnFnMouseLeaveFn);

let helpMessage;
let helpMessageEl;
function helpBtnFnMouseOverFn(e) {
  const element = e.target;
  helpMessageEl = element.closest(".container").firstElementChild;
  helpMessageEl.classList.add("help-message-animation");
}

function helpBtnFnMouseLeaveFn(e) {
  const element = e.target;
  helpMessageEl.classList.remove("help-message-animation");
}
