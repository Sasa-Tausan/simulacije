"use strict";

const inventionsArray = [
  { paper: { message: "105. godine izumljen je papir.", century: "2" } },
  {
    sugar: {
      message: "256. godine koristio se kristalizirani šećer u Indiji.",
      century: "3",
    },
  },
  {
    toilet_paper: {
      message: "589. godine koristi se toaletni papir u Kini.",
      century: "6",
    },
  },
  {
    windmill: {
      message: "650. godine izumljene su vjetrenjače.",
      century: "7",
    },
  },
  {
    horseshoe: {
      message: "770. godine koriste se konjske potkove.",
      century: "8",
    },
  },
  {
    gunpowder: {
      message: "900. godine izumljen je barut.",
      century: "9",
    },
  },
  {
    fireworks: {
      message: "960. godine koristio se vatromet.",
      century: "10",
    },
  },
  {
    money: {
      message: "1023. godine koristi se prvi papirnati novac.",
      century: "11",
    },
  },
  {
    buttons: {
      message: "1200. godine izumljeni su gumbi.",
      century: "12",
    },
  },
  {
    compass: {
      message: "1119. godine izumljen je kompas mornara.",
      century: "12",
    },
  },
  {
    glasses: {
      message: "1286. godine prvi puta su korištene naočale.",
      century: "13",
    },
  },
  {
    libra: {
      message: "1366. godine izumljena je vaga.",
      century: "14",
    },
  },
  {
    bell: {
      message: "1487. godine izumljena su zvona.",
      century: "15",
    },
  },
  {
    printing_machine: {
      // Možda bi ovjde bila bolja slika baš gutenbergova stroja.
      message: "1439. godine Johannes Gutenberg izumio je tiskarski stroj.",
      century: "15",
    },
  },
  {
    pocket_watch: {
      message: "1510. godine Peter Henlein izumio je džepni sat.",
      century: "16",
    },
  },
  {
    microscope: {
      message: "1590. godine Zacharias Janssen izradio je mikroskop.",
      century: "16",
    },
  },
  {
    telescope: {
      message: "1668. godine Isaac Newton izumio je teleskop sa zrcalom. ",
      century: "17",
    },
  },
  {
    blood_transfusion: {
      message: "1625. godine izumljena je metoda transfuzije krvi.",
      century: "17",
    },
  },
  {
    calculator: {
      message: "1671. godine izumljen je kalkulator.",
      century: "17",
    },
  },
  {
    battery: {
      message: "1800. godine Alessandro Volta razvio je električnu bateriju.",
      century: "18",
    },
  },
  {
    refrigerator: {
      message: "1755. godine izumljen je hladnjak.",
      century: "18",
    },
  },
  {
    steam_machine: {
      message: "1763. godine James Watt izumio je parni stroj.",
      century: "18",
    },
  },
  {
    radio: {
      message: "1894. godine Guglielmo Marconi izumio je radio.",
      century: "19",
    },
  },
  {
    light_bulb: {
      message: "1879. godine Thomas Edison izumio je žarulju.",
      century: "19",
    },
  },
  {
    vaccine: {
      message: "1885. godine Louis Pasteur razvio je cjepivo protiv bjesnoće.",
      century: "19",
    },
  },
  {
    plane: {
      message: "1903. godine braća Wright izumila su avion.",
      century: "20",
    },
  },
  {
    computer: {
      message: "1940. godine nastala su prva moderna računala.",
      century: "20",
    },
  },
  {
    diapers: {
      message:
        "1946. godine Marion Donovan izradila je vodootporne pelene od tkanine padobrana.",
      century: "20",
    },
  },
  {
    internet: {
      message:
        "1969. godine uspostavljen je Internet s pomoću tri povezana računala.",
      century: "20",
    },
  },
];

const messagesObject = {
  init: "U lijevi kvadrat upiši stoljeće.",
  wrongInput: "Moraš upisati broj između 1 i 21",
  rightAnswer:
    "Odlično! Ponovno pokreni svoj vremenski stroj i otkrij novi izum.",
  wrongAnswer:
    "Pokušaj ponovno! Razmisli još jednom kojem stoljeću pripada ta godina.",
};

//////////////////////////////////////////////////////////////////////////
//Pokreni igru
const timeMachineBtnEl = document.querySelector(".time-machine-btn-content");
timeMachineBtnEl.addEventListener("click", newGameFn);

function newGameFn(e) {
  mainContentEl.classList.remove("main-content-animation");

  if (e.target.id !== "newGame") return;
  displayTimeMachineAnimation();
  whichCenturyUserGuess();
  setTimeout(() => {
    displayTaskImgAndMessage();
  }, 500);
  displayInputAndInitMessage();
  resetInputAndMessageFn();
}

//////////////////////////////////////////////////////////////////////////
//pokretanje animacija na stroju prilikom prvog pokretanja
function displayTimeMachineAnimation() {
  //prettier-ignore
  const animationArray = [ "rotate-img-an","smoke-1-an","smoke-2-an","smoke-3-an","smoke-4-an","redlight-an","redlight-an-active"];
  const timeMachineImgEl = timeMachineBtnEl.firstElementChild;
  let index = 0;
  for (const childEl of timeMachineImgEl.children) {
    if (childEl.id === "timeMachine") continue;
    if (childEl.id === "tv") {
      childEl.classList.remove("hidden");
      continue;
    }
    childEl.classList.add(`${animationArray[index]}`);
    index++;
  }
}

//////////////////////////////////////////////////////////////////////////////
//prikaz uputa igre
const headerEl = document.querySelector("header");
let helpMessageEl;

headerEl.addEventListener("mouseover", helpBtnFnMouseOverFn);
headerEl.addEventListener("mouseout", helpBtnFnMouseLeaveFn);

function helpBtnFnMouseOverFn(e) {
  const element = e.target;
  if (!element.id) return;
  if (element.id === "helpBtn") {
    helpMessageEl = element.closest(".container").firstElementChild;
    helpMessageEl.classList.add("help-message-animation");
  }
}

function helpBtnFnMouseLeaveFn(e) {
  const element = e.target;
  if (!element.id) return;
  if (element.id === "helpBtn") {
    helpMessageEl.classList.remove("help-message-animation");
  }
}

/////////////////////////////////////////////////////////////////////////
//Generiranje zadatka (stoljeća) koje će učenik pogađati
let inventionQueryObj;
let inventionQuery;
let correctAnswer;

function whichCenturyUserGuess() {
  //funkcija iz niza popunjernog objektima random bira jedan objekt koji će biti zadan.
  const lengthArray = inventionsArray.length;
  const index = getRandomNumber(0, lengthArray);
  inventionQueryObj = inventionsArray[index]; // cijeli objekt koji se pogađa
  inventionQuery = Object.keys(inventionQueryObj).join(); //ime objekta koji se pogađa
  correctAnswer = inventionQueryObj[inventionQuery].century; //točan odgovor
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

//////////////////////////////////////////////////////////////////////////////
//prikaz zadatka (slike i teksta)
const mainContentEl = document.querySelector(".main-content");
function displayTaskImgAndMessage() {
  for (const childEl of mainContentEl.children) {
    if (childEl.id === "clueImg") {
      childEl.src = `./img/${inventionQuery}.png`;
    }
    if (childEl.id === "clueMessage") {
      childEl.textContent = `${inventionQueryObj[inventionQuery].message}`;
    }
  }
  mainContentEl.classList.add("main-content-animation");
}
///////////////////////////////////////////////////////////////////////////////
//prikaz elemenata input i inicijalne poruke
const inputContentEl = document.querySelector(".input-content");

function displayInputAndInitMessage() {
  inputContentEl.classList.remove("hidden");
}

/////////////////////////////////////////////////////////////////////////////////////
//validacija inputa od korisnika
inputContentEl.addEventListener("input", validationInputFn);

let inputUser;
let validationState = false;

function validationInputFn(e) {
  const element = e.target;
  inputUser = element.value;

  validationState = validationInputUserFn(inputUser);
  checkAnswerFn();
}

function validationInputUserFn() {
  if (
    inputUser === 0 ||
    isNaN(inputUser) ||
    inputUser === "" ||
    inputUser > 21 ||
    inputUser < 1
  ) {
    return false;
  } else {
    return true;
  }
}

///////////////////////////////////////////////////////////////////////
//provjera odgovora i ispisivanje odgovarajuće poruke
function checkAnswerFn() {
  const messageEl = inputContentEl.lastElementChild;
  //input je dobar
  if (validationState) {
    //odgovor je točan
    if (inputUser === inventionQueryObj[inventionQuery].century) {
      messageEl.textContent = messagesObject.rightAnswer;
    }
    //odgovor je netočan
    if (inputUser !== inventionQueryObj[inventionQuery].century) {
      messageEl.textContent = messagesObject.wrongAnswer;
    }
  }
  //input nije dobar
  if (!validationState) {
    messageEl.textContent = messagesObject.wrongInput;
  }
}
///////////////////////////////////////////////////////////////////////
//reset prilikom biranja novog zadatka
function resetInputAndMessageFn() {
  //brisanje input polja
  inputContentEl.firstElementChild.firstElementChild.value = "";

  //stavljanje početne poruke
  inputContentEl.lastElementChild.textContent = messagesObject.init;
}
