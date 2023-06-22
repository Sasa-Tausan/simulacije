"use strict";

//1. funkcionalnost
// * prilikom svakog pokretanja stranice, slike, nazivi i fun fact se trebaju nasumično prikazati
const organContentEl = document.querySelectorAll(".organ_content");

// prettier-ignore
const organsArr = ["esophagus", "stomach", "duodenum", "liver", "pancreas", "colon", "small_intestine"];

const organsObj = {
  // 1. broj označava koja će biti veličina slike u pixelima s lijeve strane kada se stranica učita
  // 2. broj označava koja će biti veličina slike u pixelima s desne strane kada se slika dovuče na tijelo
  // 3. broj označava z-index dropzone gdje treba spustiti odgovarajući organ
  esophagus: ["jednjak", 60, 110, 1],
  stomach: ["želudac", 45, 65, 1],
  duodenum: ["dvanaesnik", 30, 30, 1],
  liver: ["jetra", 45, 70, 2],
  pancreas: ["gušterača", 30, 30, 1],
  colon: ["debelo crijevo", 70, 160, 2],
  small_intestine: ["tanko crijevo", 50, 80, 1],
};

const organsObjectFunFacts = {
  esophagus: [
    "Hrana će prolaziti prema želudcu i ako stojiš naglavačke.",
    "Mišići jednjaka nisu pod utjecajem naše volje",
    "Hrana za 7 sekundi prolazi kroz jednjak.",
  ],
  stomach: [
    "Želudac „kruli” zato što je prazan, a ne kao znak gladi.",
    "Želudac je rastezljiv organ. J. Chestnut pojeo je 73 hotdoga.",
    "Solna kiselina želudca može razgraditi neke metale.",
  ],
  duodenum: [
    "Početni dio tankog crijeva duljine je 12 palaca.",
    "Ulijevaju se žuč iz žučnog mjehura i gušteračini probavn sokovi.",
    "U obliku je potkove.",
  ],
  liver: [
    "Naša najveća žlijezda.",
    "Multitasking organ, obavlja 200 funkcija.",
    "Može se regenerirati, potrebno je samo 25 % izvornog tkiva.",
  ],
  pancreas: [
    "Gušterača regulira i razinu šećera u krvi s pomoću hormona.",
    "Ima 4 dijela: glava, vrat, tijelo i rep.",
    "Može „osjetiti” slatko kako bi regulirala razinu šećera u krvi.",
  ],
  colon: [
    "Bakterije fermentacijom proizvode vitamine K, B1, B2 i B12.",
    "Na mjestu prelaska tankog u debelo crijevo nalazi se slijepo crijevo s crvuljkom.",
    "Neprobavljeni ostatci ponekad mogu ostati i duže od 2 dana.",
  ],
  small_intestine: [
    "Sastoji se od tri dijela.",
    "Za čovjekova života prođe 50 tona hrane i tekućine.",
    "Ovdje se apsorbira 90 % hranjivih  tvari.",
  ],
};

let counter = 0;

displayRandomOrgansImgTitleAndFacts();

function displayRandomOrgansImgTitleAndFacts() {
  //funkcija koja će nasumično prikazati slike organa i nazive prilikom svakog pokretanja
  const shuffledOrgansArr = shuffle(organsArr);
  organContentEl.forEach((elOrganContent, index) => {
    //u varijablu elOrganContentChildren spremamo svu djecu jednog elementa organContent (spremamo img, naziv organa i fun fact)
    const elOrganContentChildren = elOrganContent.children;
    const organ = shuffledOrgansArr[index]; //trenutni organ po redu u promiješanom arrayu organsArr
    for (let i = 0; i < elOrganContentChildren.length; i++) {
      if (i === 0) {
        const imgEl = elOrganContentChildren[i].firstElementChild;
        imgEl.id = `${organ}`;
        imgEl.src = `./img/${organ}.png`;
        imgEl.style.height = `${organsObj[organ][1]}px`;
      }

      if (i === 1) {
        const titleEl = elOrganContentChildren[i].firstElementChild;
        titleEl.textContent = `${organsObj[organ][0]}`;
      }

      if (i === 2) {
        const funFact = elOrganContentChildren[i].lastElementChild;
        const funFactText = shuffle(organsObjectFunFacts[organ]);
        funFact.textContent = `${funFactText[0]}`;
      }
    }
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

//////////////////////////////////////////////////////////////////////

//2. funkcionalnost
// * drag and drop funkcionalnost za povlačanje i postavljanje slika na određene dijelove tijela
const organsImgEl = document.querySelectorAll(".dragable-item");
const organDropZoneEl = document.querySelectorAll(".organ_dropzone");
let dragItem = null;

organsImgEl.forEach((organ) => {
  organ.addEventListener("dragstart", dragStart);
  organ.addEventListener("dragend", dragEnd);
});

organDropZoneEl.forEach((el) => {
  el.addEventListener("dragover", dragOver);
  el.addEventListener("drop", dragDrop);
});

function dragStart() {
  dragItem = this;
  setTimeout(() => (this.className = "invisible"), 0);
  organDropZoneEl.forEach((el) => {
    if (dragItem.id === el.dataset.organ) {
      el.style.zIndex = "100";
    }
  });
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const organImgContainerEL = dragItem.parentElement; // element roditelja u kojem se nalazi slika
  const organTextEl = dragItem.parentElement.nextElementSibling; // element texta gdje se nalazi naziv organa
  const funFactEl = organTextEl.nextElementSibling; // element u kojem se nalazi fun fact
  if (dragItem.id === this.dataset.organ) {
    dragItem.style.height = `${organsObj[dragItem.id][2]}px`;
    this.style.zIndex = `${organsObj[dragItem.id][3]}`;
    dragItem.setAttribute("draggable", false);
    dragItem.classList.add("dragable-item");
    organImgContainerEL.classList.add("hidden");
    organTextEl.classList.add("hidden");
    funFactEl.classList.remove("hidden");
    counter++;
    this.append(dragItem);
    checkAllOrgansOnRightSide();
  }
}

function dragEnd() {
  dragItem.classList.remove("invisible");
  dragItem = null;
}

////////////////////////////////////////////////////////////////////////////////////
//3. funkcionalnost - kada korisnik pređe mišom preko uputa pojavi se element s uputama
const helpEl = document.querySelector("#helpMessage");
const messageTextHelpEl = document.querySelector("#helpMessageText");

helpEl.addEventListener("mouseover", displayHelpTextEl);
helpEl.addEventListener("mouseleave", hideHelpTextEl);

function displayHelpTextEl() {
  messageTextHelpEl.classList.add("help_message_text_animation");
}

function hideHelpTextEl() {
  messageTextHelpEl.classList.remove("help_message_text_animation");
}

//////////////////////////////////////////////////////////////////////////////////////////
/*Tekst za Poruku:
Pokreni ponovno igru i doznaj nove zanimljivosti o organima probavnog sustava.*/
//4. funkcionalnost
// Kada korisnik uspješno složi organe, prikaže se poruka da je korisnik složio organe, da može pokrenuti ponovno i audio zvuk se pokrene.
//Poruka stoji vidljiva dok se ne klikne na gumb pokreni.

function checkAllOrgansOnRightSide() {
  if (counter === 7) {
    const finalMessageEl = document.querySelector("#finalMessage");
    const clap = new Audio("./audio/clap.wav");
    const newGamebtn = document.querySelector("#newGame");
    finalMessageEl.classList.add("help_message_text_animation");
    clap.play();
    newGamebtn.addEventListener("click", () => {
      window.location.reload();
    });
  }
}
