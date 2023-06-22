"use strict";

const mainEl = document.querySelector("main");
const sliderEL = document.querySelector("#myRange");
const sunImgEL = document.querySelector(".sun");
const moonImgEL = document.querySelector(".moon");
const el5Container = document.querySelector(".el_5_container");
const el1_4Container = document.querySelector(".el_1_4_container");
const el5NightContainer = document.querySelector(".el_night_container");
const elPhotosynthesis = document.querySelector(".photosynthesis");

const bgColorObj = {
  1: "#d9e5f8",
  2: "#d5deec",
  3: "#d3dae5",
  4: "#d1d6dd",
  5: "#ced0d4",
  6: "#cbcaca",
  7: "#c8c4c0",
  8: "#c5bfb6",
  9: "#c2baac",
  10: "#c0b4a3",
  11: "#bdae99",
  12: "#baa890",
  13: "#b7a286",
  14: "#ac977b",
  15: "#9d8b71",
  16: "#8f7e67",
  17: "#80715c",
  18: "#716451",
  19: "#635747",
  20: "#544b3d",
  21: "#463e32",
  22: "#373027",
  23: "#28231d",
  24: "#1a1612",
  25: "#000000",
};

const el5ValuesObj = {
  6: { opacity: 1, anDuration: 1 },
  7: { opacity: 0.83, anDuration: 1.4 },
  8: { opacity: 0.66, anDuration: 1.8 },
  9: { opacity: 0.49, anDuration: 2.2 },
  10: { opacity: 0.32, anDuration: 2.6 },
  11: { opacity: 0.15, anDuration: 3 },
  12: { opacity: 0, anDuration: 0 },
};

const el14Obj = {
  13: { opacity: 1, anDuration: 1 },
  14: { opacity: 0.9, anDuration: 1.3 },
  15: { opacity: 0.85, anDuration: 1.5 },
  16: { opacity: 0.75, anDuration: 1.8 },
  17: { opacity: 0.6, anDuration: 2.1 },
  18: { opacity: 0.45, anDuration: 2.4 },
  19: { opacity: 0.3, anDuration: 2.6 },
  20: { opacity: 0.15, anDuration: 2.8 },
  21: { opacity: 0, anDuration: 0 },
};

const elNightValueObj = {
  13: { opacity: 0, anDuration: 0 },
  14: { opacity: 0.1, anDuration: 3 },
  15: { opacity: 0.18, anDuration: 2.8 },
  16: { opacity: 0.26, anDuration: 2.7 },
  17: { opacity: 0.34, anDuration: 2.6 },
  18: { opacity: 0.42, anDuration: 2.4 },
  19: { opacity: 0.5, anDuration: 2.2 },
  20: { opacity: 0.58, anDuration: 2 },
  21: { opacity: 0.64, anDuration: 1.8 },
  22: { opacity: 0.72, anDuration: 1.6 },
  23: { opacity: 0.8, anDuration: 1.4 },
  24: { opacity: 0.88, anDuration: 1.2 },
  25: { opacity: 1, anDuration: 1 },
};

const STAR_MOVEMENT = 10;

sliderEL.addEventListener("input", sliderFn);

function sliderFn(e) {
  const sliderValue = e.target.value;
  sunImgEL.style.transform = `translateX(-${sliderValue * STAR_MOVEMENT}px)`;
  moonImgEL.style.transform = `translateX(-${sliderValue * STAR_MOVEMENT}px)`;
  mainEl.style.backgroundColor = bgColorObj[sliderValue];

  if (sliderValue >= 6 && sliderValue <= 12) {
    opacityElContainer(sliderValue, el5Container, el5ValuesObj);
    animationDurationArrow(sliderValue, el5Container, el5ValuesObj);
  }

  if (sliderValue >= 13 && sliderValue <= 21) {
    opacityElContainer(sliderValue, el1_4Container, el14Obj);
    animationDurationArrow(sliderValue, el1_4Container, el14Obj);
    opacityElFotosinteza(sliderValue, elPhotosynthesis, el14Obj);
  }

  if (sliderValue >= 13) {
    el5NightContainer.classList.remove("hidden");
    opacityElContainer(sliderValue, el5NightContainer, elNightValueObj);
    animationDurationArrow(sliderValue, el5NightContainer, elNightValueObj);
  }
}

function opacityElContainer(sliderVal, elementContainer, elementObj) {
  //funkcija postavlja vrijednost opacitija ovisno o vrijednosti slidera
  for (const child of elementContainer.children) {
    child.style.opacity = `${elementObj[sliderVal].opacity}`;
  }
}

function animationDurationArrow(sliderVal, elementContainer, elementObj) {
  //funkcija postavlja vrijednost trajanja animacije ovisno o vrijednosti slidera
  for (const child of elementContainer.children) {
    if (child.dataset.value === "arrow")
      child.style.animationDuration = `${elementObj[sliderVal].anDuration}s`;
  }
}

function opacityElFotosinteza(sliderVal, elementContainer, elementObj) {
  //funkcija postavlja vrijednost opacitija ovisno o vrijednosti slidera
  elementContainer.style.opacity = `${elementObj[sliderVal].opacity}`;
}
