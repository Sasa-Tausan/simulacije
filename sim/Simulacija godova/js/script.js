"use strict";

//Dohvaćanje DOM elemenata
const optionContainerEl = document.querySelector(".option-container");
const tempContentEl = document.querySelector("#tempContent");
const helpMessageEl = document.querySelector("#helpMessage");
const imgWeatherEl = document.querySelectorAll(".weather-img");
const imgTempEl = document.querySelectorAll(".temp-img");
const plusMinusGodEl = document.querySelector(".plus-minus-content");
const treeRingsEl = document.querySelector(".tree-ring");
const plusGodEl = document.querySelector("#plusGod");
const minusGodEl = document.querySelector("#minusGod");

//Deklaracija varijabli
const MOISTURE_WIDTH = 30;
const NORMAL_WIDTH = 20;
const DROUGTH_WIDTH = 10;
const NAME_IMG_WEATHER = "weather";
const NAME_IMG_TEMP = "temp";
let weatherId;
let tempId;
let ringLength = 20;
let ringMovements = [ringLength];
let optionAdvancedSelect = false;

//Dodavanje event listenera
optionContainerEl.addEventListener("click", selectLevel);
imgWeatherEl.forEach((weather) => {
  weather.addEventListener("click", selectWeatherImg);
});

imgTempEl.forEach((temp) => {
  temp.addEventListener("click", selectTempImg);
});

plusMinusGodEl.addEventListener("click", addRemoveRingTree);

//funkcije za add event listenere
function selectLevel(e) {
  const imgEl = document.querySelectorAll(".img-option");
  const el = e.target;
  if (!el.id) return;
  if (el.id === "beginner") {
    reset();
    el.classList.add("active-option");
    tempContentEl.classList.add("hidden");
    el.parentElement.lastElementChild.classList.remove("active-option");
    helpMessageEl.textContent =
      "Odaberi jedan vremenski uvjet za vlažnost. Promatraj širinu godova.";
    optionAdvancedSelect = false;
  } else {
    reset();
    el.classList.add("active-option");
    el.parentElement.firstElementChild.classList.remove("active-option");
    tempContentEl.classList.remove("hidden");
    helpMessageEl.textContent =
      "Odaberi jedan vremenski uvjet za vlažnost i jedan za temperaturu. Promatraj širinu godova.";
    optionAdvancedSelect = true;
  }
}

function selectWeatherImg(e) {
  removeClassActive(imgWeatherEl);
  weatherId = e.target.id;
  e.target.classList.add("active");
  addPicture(imgWeatherEl, NAME_IMG_WEATHER);
  disableEnableBtnPlus(
    optionAdvancedSelect,
    plusGodEl,
    ringLength,
    weatherId,
    tempId
  );
  disableEnableBtnMinus(ringLength, minusGodEl);
}

//funkcija za temp slike
function selectTempImg(e) {
  removeClassActive(imgTempEl);
  tempId = e.target.id;
  e.target.classList.add("active");
  addPicture(imgTempEl, NAME_IMG_TEMP);
  disableEnableBtnPlus(
    optionAdvancedSelect,
    plusGodEl,
    ringLength,
    weatherId,
    tempId
  );
  disableEnableBtnMinus(ringLength, minusGodEl);
}

function addRemoveRingTree(e) {
  if (!e.target.id) return;
  if (e.target.id === "plusGod") {
    addRing();
    disableEnableBtnPlus(
      optionAdvancedSelect,
      plusGodEl,
      ringLength,
      weatherId,
      tempId
    );
    disableEnableBtnMinus(ringLength, minusGodEl);
  } else {
    removeRing();
    disableEnableBtnPlus(
      optionAdvancedSelect,
      plusGodEl,
      ringLength,
      weatherId,
      tempId
    );
    disableEnableBtnMinus(ringLength, minusGodEl);
  }
}

function addPicture(elements, imgName) {
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].classList.contains("active")) {
      elements[i].src = `./img/${imgName}_${i}_active.png`;
      elements[i].nextElementSibling.classList.add("bold-p");
    } else {
      elements[i].src = `./img/${imgName}_${i}_default.png`;
    }
  }
}

function addPictureReset(elements, imgName) {
  for (let i = 0; i < elements.length; i++) {
    elements[i].src = `./img/${imgName}_${i}_default.png`;
  }
}

function removeClassActive(elements) {
  elements.forEach((element) => {
    element.classList.remove("active");
    element.nextElementSibling.classList.remove("bold-p");
  });
}

function plusGod(weatherId, element) {
  switch (weatherId) {
    case "moisture":
      element.style.width = `${ringLength + MOISTURE_WIDTH}px`;
      element.style.height = `${ringLength + MOISTURE_WIDTH}px`;
      ringLength = ringLength + MOISTURE_WIDTH;
      ringMovements.push(ringLength);
      break;
    case "normalWeather":
      element.style.width = `${ringLength + NORMAL_WIDTH}px`;
      element.style.height = `${ringLength + NORMAL_WIDTH}px`;
      ringLength = ringLength + NORMAL_WIDTH;
      ringMovements.push(ringLength);
      break;
    case "drought":
      element.style.width = `${ringLength + DROUGTH_WIDTH}px`;
      element.style.height = `${ringLength + DROUGTH_WIDTH}px`;
      ringLength = ringLength + DROUGTH_WIDTH;
      ringMovements.push(ringLength);
      break;
  }
}

function plusGodAdvanced(weatherId, tempId, element) {
  switch (true) {
    case weatherId === "moisture" && tempId === "hot":
    case weatherId === "moisture" && tempId === "normalTemp":
    case weatherId === "normalWeather" && tempId === "hot":
      element.style.width = `${ringLength + MOISTURE_WIDTH}px`;
      element.style.height = `${ringLength + MOISTURE_WIDTH}px`;
      ringLength = ringLength + MOISTURE_WIDTH;
      ringMovements.push(ringLength);
      break;
    case weatherId === "normalWeather" && tempId === "normalTemp":
    case weatherId === "drought" && tempId === "hot":
    case weatherId === "moisture" && tempId === "cold":
      element.style.width = `${ringLength + NORMAL_WIDTH}px`;
      element.style.height = `${ringLength + NORMAL_WIDTH}px`;
      ringLength = ringLength + NORMAL_WIDTH;
      ringMovements.push(ringLength);
      break;
    case weatherId === "drought" && tempId === "cold":
    case weatherId === "drought" && tempId === "normalTemp":
    case weatherId === "normalWeather" && tempId === "cold":
      element.style.width = `${ringLength + DROUGTH_WIDTH}px`;
      element.style.height = `${ringLength + DROUGTH_WIDTH}px`;
      ringLength = ringLength + DROUGTH_WIDTH;
      ringMovements.push(ringLength);
      break;
  }
}

function addRing() {
  const divEl = document.createElement("div"); // creating div element
  divEl.classList.add("tree-ring");
  optionAdvancedSelect
    ? plusGodAdvanced(weatherId, tempId, divEl)
    : plusGod(weatherId, divEl);
  treeRingsEl.parentElement.appendChild(divEl);
}

function removeRing() {
  treeRingsEl.parentElement.removeChild(
    treeRingsEl.parentElement.lastElementChild
  );
  ringMovements.pop();
  ringLength = ringMovements[ringMovements.length - 1];
}

function disableEnableBtnPlus(
  option,
  element,
  width,
  weatherId,
  tempId = true
) {
  if (option) {
    if (width < 255 && weatherId && tempId) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  } else {
    if (width < 255 && weatherId) {
      element.disabled = false;
    } else {
      element.disabled = true;
    }
  }
}

function disableEnableBtnMinus(width, element) {
  if (treeRingsEl.parentElement.childElementCount === 2) {
    element.disabled = true;
  } else {
    element.disabled = false;
  }
}

function removesChildrenElement() {
  while (treeRingsEl.parentElement.childElementCount !== 2) {
    treeRingsEl.parentElement.removeChild(
      treeRingsEl.parentElement.lastElementChild
    );
  }
}

function addWidthHeightRing(element, lengthRing) {
  element.style.width = `${lengthRing}px`;
  element.style.height = `${lengthRing}px`;
}

function reset() {
  removesChildrenElement();
  ringLength = 20;
  addWidthHeightRing(treeRingsEl, ringLength);
  plusGodEl.disabled = true;
  minusGodEl.disabled = true;
  removeClassActive(imgWeatherEl);
  removeClassActive(imgTempEl);
  addPictureReset(imgTempEl, NAME_IMG_TEMP);
  addPictureReset(imgWeatherEl, NAME_IMG_WEATHER);
  weatherId = 0;
  tempId = 0;
}
