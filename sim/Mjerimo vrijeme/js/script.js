"use strict";

//Dohvaćanje elemenata
const handHourEl = document.querySelector("#handHour");
const handMinuteEl = document.querySelector("#handMinute");
const btnPlayClockEl = document.querySelector("#btn__play__clock");
const btnCheckAnswerEl = document.querySelector("#btn__check__answer");
const inputHourEl = document.querySelector("#inputHour");
const inputMinuteEl = document.querySelector("#inputMinute");
const inputUserEl = document.querySelector(".input__user");
const amImgEl = document.querySelector(".am__img__content");
const pmImgEl = document.querySelector(".pm__img__content");
const amPmMessageEl = document.querySelector("#message__ampm");
const messageErrorEl = document.querySelector(".message__content");
const messageError = document.querySelector("#message__error");

//Definiranje varijabli
let handHourDeg;
let handHourRealDeg; // varijabla kojoj se na stupnjeve sata nadoda realni pomak u stupnjevima
let handMinuteDeg;
let hour;
let minute;
let inputHour;
let inputMinute;
let Bool1 = false;
let Bool2 = false;
const amPmArra = ["PRIJEPODNE", "POSLIJEPODNE"];
let indexAmPm;
const REAL_DEVIATION = 0.0833333333333333;

//Event listeneri
btnPlayClockEl.addEventListener("click", playClockBtn);
btnCheckAnswerEl.addEventListener("click", checkAnswerBtn);
inputUserEl.addEventListener("input", inputUser);

//Funkcije programa
function playClockBtn() {
  resetPlayClock();
  setTimeout(() => {
    playClock();
  }, 500);
}

function inputUser(e) {
  if (e.target.id === "inputHour") {
    inputHour = e.target.value;
    Bool1 = checkHourValidation(inputHour);
  } else {
    inputMinute = e.target.value;
    Bool2 = checkMinuteValidation(inputMinute);
  }
  disableEnableCheckBtn(Bool1, Bool2, hour, minute);
}

function checkAnswerBtn() {
  removeClassElement(messageErrorEl, "wrong__answer");
  removeClassElement(messageErrorEl, "right__answer");
  checkHourMinutes();
}

function randomNumberGenerator(min, max, step = 1) {
  //Funkcija koja generira broj između min i max ne uključuje max. Ako želimo uključiti i max tada bi kod izgledao (max - min + 1)
  return Math.trunc(Math.random() * (max - min + min)) * step;
}

function randomDegGenerator() {
  //funkcija generira stupnjeve i vraća array sa stupnjevima kazaljke sata i minute
  handMinuteDeg = randomNumberGenerator(0, 60, 6);
  handHourDeg = randomNumberGenerator(0, 11, 30);
  handHourRealDeg = Math.round(handHourDeg + handMinuteDeg * REAL_DEVIATION);
}

function addClassElement(element, className) {
  element.classList.add(className);
}

function removeClassElement(element, className) {
  element.classList.remove(className);
}

function addAnimationDegHandHourMinute() {
  //funkcija koja nadodaje animaciju u stupnjevima na kazaljkama minute i sekunde
  handHourEl.style.transform = `rotate(${handHourRealDeg}deg)`;
  handMinuteEl.style.transform = `rotate(${handMinuteDeg}deg)`;
}

function resetDegAnimationHandHourMinute() {
  //funkcija resetira kazaljke sata i minute na početno stanje 0 stupnjeva
  handHourEl.style.transform = `rotate(0deg)`;
  handMinuteEl.style.transform = `rotate(0deg)`;
}

function degInHourMinute() {
  //funkcija prebacuje stupnjeve u sate i minute
  hour = handHourDeg / 30;
  minute = Math.round(handMinuteDeg / 6);
}

function resetPlayClock() {
  removeClassElement(handHourEl, "animation__hand__hour");
  removeClassElement(handMinuteEl, "animation__hand__minute");
  removeClassElement(amPmMessageEl, "animation_message_opacity");
  removeClassElement(amImgEl, "animation_img_opacity");
  removeClassElement(pmImgEl, "animation_img_opacity");
  removeClassElement(messageErrorEl, "wrong__answer");
  removeClassElement(messageErrorEl, "right__answer");
  resetDegAnimationHandHourMinute();
  resetInputAnswers();
}

function playClock() {
  addClassElement(handHourEl, "animation__hand__hour");
  addClassElement(handMinuteEl, "animation__hand__minute");
  randomDegGenerator();
  addAnimationDegHandHourMinute();
  degInHourMinute();
  displayMessageAmPm();
  displayImgAmPM(indexAmPm);
  hourAmOrPm(indexAmPm);
}

function displayMessageAmPm() {
  //funkcija koja prikazuje pokazuje li sat prije podne ili poslije podne
  indexAmPm = Math.round(Math.random() * 1);
  amPmMessageEl.textContent = amPmArra[indexAmPm];
  addClassElement(amPmMessageEl, "animation_message_opacity");
}

function displayImgAmPM(indexAmPm) {
  //funkcija koja prikauje sliku ovisno o tekstu prije podne ili poslije podne
  if (indexAmPm) {
    addClassElement(amImgEl, "animation_img_opacity");
  } else {
    addClassElement(pmImgEl, "animation_img_opacity");
  }
}

function checkHourMinutes() {
  //funkcija koja uspoređuje input od korisnika i random generirano vrijeme te prikazuje pripadajuću poruku.
  if (hour === +inputHour && minute === +inputMinute) {
    messageError.textContent =
      "Odlično! Ponovno pokreni sat/uru i nastavi vježbati.";
    addClassElement(messageErrorEl, "right__answer");
    btnCheckAnswerEl.disabled = true;
    inputHourEl.disabled = true;
    inputMinuteEl.disabled = true;
  } else {
    messageError.textContent =
      "Pokušaj ponovno! Sati ili minute nisu dobro upisani.";
    addClassElement(messageErrorEl, "wrong__answer");
  }
}

function hourAmOrPm(indexAmPm) {
  //funkcija koja nadodaje na generirane sate 12 ako se radi o poslije podnevnom vremenu.
  if (indexAmPm === 1) {
    hour += 12;
    return;
  }
}

function resetInputAnswers() {
  //funkcija koja resetira sva polja prije nego što se ponovno pokrene gumb pokreni sat
  messageError.textContent = "";
  inputHourEl.value = "";
  inputMinuteEl.value = "";
  btnCheckAnswerEl.disabled = true;
  inputHourEl.disabled = false;
  inputMinuteEl.disabled = false;
  Bool1 = false;
  Bool2 = false;
}

//Funkcije za validaciju
function checkHourValidation(hour) {
  //funkcija koja provjerava validaciju input polja. Polje ne može biti prazno, ne može broj biti manji od 0, manji od 23 i decimalni broj. Vraća true ili false.
  console.log(hour.length);
  if (hour.length === 0 || hour === " ") {
    return false;
  }
  hour = Number(hour);
  if (hour >= 0 && hour <= 23 && hour % 1 === 0) {
    return true;
  } else {
    return false;
  }
}

function checkMinuteValidation(minute) {
  //funkcija koja provjerava validaciju input polja. Polje ne može biti prazno, ne može broj biti manji od 0, manji od 59 i decimalni broj. Vraća true ili false.
  if (minute.length === 0) {
    return false;
  }
  minute = Number(minute);
  if (minute >= 0 && minute <= 59 && minute % 1 === 0) {
    return true;
  } else {
    return false;
  }
}

function disableEnableCheckBtn(
  inputBool1,
  inputBool2,
  randomHour,
  randomMinute
) {
  //funkcija koja eneblea ili disablea gumb provjeri odgovor ovisno o tome jesu li input polja minute ili sati pravilno ispunjeni.
  if (
    inputBool1 &&
    inputBool2 &&
    randomHour !== undefined &&
    randomMinute !== undefined
  ) {
    btnCheckAnswerEl.disabled = false;
  } else {
    btnCheckAnswerEl.disabled = true;
  }
}
