"use strict";

//dohvaćanje elemenata
const checkBoxElements = document.querySelectorAll(".check-box");
const newGameBtn = document.querySelector("#newGame");
const imgContainerElements = document.querySelectorAll(".user-container");
const tpImgElements = document.querySelectorAll("[data-id=tp]");
const dnImgElements = document.querySelectorAll("[data-id=dn]");
const wcImgElements = document.querySelectorAll("[data-id=wc]");
const dsImgElements = document.querySelectorAll("[data-id=ds]");
const taskEl = document.querySelector("#task");
const treeTaskEl = document.querySelector("#treeTask");
const messageEl = document.querySelector("#message");

//deklaracija varijable
let level, task, answerCircle, answerSquare;
const season = ["zima", "proljece", "ljeto", "jesen"];

////////////////////////////////////////////////////////////////////////
//funkcija za checkBox i event listener
checkBoxElements.forEach((checkBox) => {
  checkBox.addEventListener("click", selectLevel);
});

function selectLevel(e) {
  removeClassFromElements(checkBoxElements, "check-box-active");
  removeAllImgClassActive();
  removeSrcFromTaskEl();
  const levelEl = e.target;
  level = levelEl.id;
  displayImgContainer(level);
  levelEl.classList.toggle("check-box-active");
  newGameBtn.disabled = false;
  if (level === "beginner") {
    removeSrcAtribut(tpImgElements);
    removeSrcAtribut(dnImgElements);
  } else {
    removeSrcAtribut(wcImgElements);
    removeSrcAtribut(dsImgElements);
  }
  messageEl.textContent = "Pokreni igru.";
}

////////////////////////////////////////////////////////////////////////
//funkcija za novu igru i event listener

newGameBtn.addEventListener("click", newGame);

function newGame() {
  removeAllImgClassActive();
  answerCircle = "";
  answerSquare = "";
  treeTaskEl.classList.add("blur");
  treeTaskEl.classList.remove("blur-an");
  messageEl.textContent = "";
  if (level === "beginner") {
    displayShuffledImages(tpImgElements, "tp");
    displayShuffledImages(dnImgElements, "dn");
    tpImgElements.forEach((img) => {
      img.addEventListener("click", clickImg);
    });
    dnImgElements.forEach((img) => {
      img.addEventListener("click", clickImg);
    });
  } else {
    displayShuffledImages(wcImgElements, "wc");
    displayShuffledImages(dsImgElements, "ds");
    wcImgElements.forEach((img) => {
      img.addEventListener("click", clickImg);
    });
    dsImgElements.forEach((img) => {
      img.addEventListener("click", clickImg);
    });
  }
  displayTaskImgs();
  messageEl.textContent =
    "Odaberi na obje strane sliku koja se odnosi na zadano godišnje doba.";
}

////////////////////////////////////////////////////////////////////////////////
//funkcija za event listener na slikama
function clickImg(e) {
  const imgEl = e.target;
  console.log(e.target);
  if (imgEl.dataset.id === "tp" || imgEl.dataset.id === "wc") {
    answerCircle = imgEl.dataset.season;
  } else {
    answerSquare = imgEl.dataset.season;
  }
  removeParentElClassBasedOnDataID(imgEl.dataset.id);
  imgEl.parentElement.classList.add("active");
  checkAnswer(checkClass(level), imgEl);
}

function checkAnswer(bollArr) {
  //Funkcija provjerava da li je odgovor točan
  let bool1, bool2;
  [bool1, bool2] = [...bollArr];
  // If provjerava je li korisnik označio oba odgovora
  if (bool1 && bool2) {
    if (answerCircle === task && answerSquare === task) {
      messageEl.textContent =
        "Odlično! Ponovno pookreni igru i nastavi vježbati.";
      treeTaskEl.classList.add("blur-an");
      if (level === "beginner") {
        removeEventListener(tpImgElements, clickImg);
        removeEventListener(dnImgElements, clickImg);
      } else {
        removeEventListener(wcImgElements, clickImg);
        removeEventListener(dsImgElements, clickImg);
      }
    } else {
      //else ako su odgovori krivi
      messageWrongAnswers();
    }
  }
}

function messageWrongAnswers() {
  if (level === "beginner") {
    switch (true) {
      case answerCircle !== task && answerSquare !== task:
        messageEl.textContent =
          "Oba su odgovora netočna. Razmisli još jednom i odaberi točne slike.";
        break;
      case answerCircle !== task:
        messageEl.textContent =
          "Jedan je odgovor netočan. Odaberi neku drugu sliku ispod naslova Dijelovi stabla";
        break;
      case answerSquare !== task: {
        messageEl.textContent =
          "Jedan odgovor je netočan. Odaberi neku drugu sliku ispod naslova Dan/Noć.";
        break;
      }
    }
  } else {
    switch (true) {
      case answerCircle !== task && answerSquare !== task:
        messageEl.textContent =
          "Oba odgovora su netočna. Razmisli još jednom i odaberi točne slike.";
        break;
      case answerCircle !== task:
        messageEl.textContent =
          "Jedan odgovor je netočan. Odaberi neku drugu sliku ispod naslova Vremenski uvjeti.";
        break;
      case answerSquare !== task: {
        messageEl.textContent =
          "Jedan odgovor je netočan. Odaberi neku drugu sliku ispod naslova Počinje/Završava.";
        break;
      }
    }
  }
}

function checkClass(level) {
  //funkcija provjerava da li oba elementa (slike) imaju klasu active
  let ImgActiveClassBoll1, ImgActiveClassBoll2;
  if (level === "beginner") {
    ImgActiveClassBoll1 = checkClassActive(tpImgElements, "active");
    ImgActiveClassBoll2 = checkClassActive(dnImgElements, "active");
  } else {
    ImgActiveClassBoll1 = checkClassActive(wcImgElements, "active");
    ImgActiveClassBoll2 = checkClassActive(dsImgElements, "active");
  }
  return [ImgActiveClassBoll1, ImgActiveClassBoll2];
}

function checkClassActive(elements, classActive) {
  //pomoćna funkcija provjerava da li jedan od elemenata ima klasu activ
  const elArray = Array.from(elements);
  const containsActive = (element) =>
    element.parentElement.classList.contains(classActive);
  return elArray.some(containsActive);
}

function removeEventListener(imgElements, _function) {
  //funkcija briše event listener click kada je odgovor točan,
  imgElements.forEach((imgEl) => {
    imgEl.removeEventListener("click", _function);
  });
}

/////////////////////////////////////////////////////////////////////
//funkcije za prikazivanje elemenata i postavljanje zadatka

function displayImgContainer(_level) {
  //funkcija pokazuje koja će se dva bloka elemenata prikazati ovisno o odabranom levelu u igri
  imgContainerElements.forEach((imgEl) => {
    if (imgEl.dataset.level === _level) {
      imgEl.classList.remove("hidden");
    } else {
      imgEl.classList.add("hidden");
    }
  });
}

function displayShuffledImages(images, dataAtribut) {
  const randomSeasonArr = shuffle(season);
  images.forEach((img, index) => {
    img.src = `./img/${randomSeasonArr[index]}_${dataAtribut}.png`;
    //nadodavanje data atributa kako bi mogli znati na koje godišnje doba je učenik kliknuo
    img.dataset.season = randomSeasonArr[index];
  });
}

function displayTaskImgs() {
  //funckija prikazuje sliku drveta godišnjeg doba koje se pogađa.
  task = season[getRandomNumber(0, 4)];
  treeTaskEl.src = `./img/${task}.png`;
  treeTaskEl.classList.add("blur");
  taskEl.src = `./img/${task}_task.jpg`;
}

//////////////////////////////////////////////////////////////////////////
//funkcije za brisanje klasa

function removeAllImgClassActive() {
  //funkcija briše na svim parent elementu+ima klasu active kada se mijena level igre.
  removeParentElementClass(tpImgElements, "active");
  removeParentElementClass(dnImgElements, "active");
  removeParentElementClass(wcImgElements, "active");
  removeParentElementClass(dsImgElements, "active");
}

function removeParentElClassBasedOnDataID(dataid) {
  //funkcija briše klasu active na parent elementima ovisno o data atributu ID
  switch (dataid) {
    case "tp":
      removeParentElementClass(tpImgElements, "active");
      break;
    case "dn":
      removeParentElementClass(dnImgElements, "active");
      break;
    case "wc":
      removeParentElementClass(wcImgElements, "active");
      break;
    case "ds":
      removeParentElementClass(dsImgElements, "active");
      break;
  }
}

function removeParentElementClass(_children, _class) {
  //funkcija briše klasu na parent elementima
  _children.forEach((child) => {
    child.parentElement.classList.remove(_class);
  });
}

function removeClassFromElements(_elements, _class) {
  //funkcija briše klasu na elementima
  _elements.forEach((element) => {
    element.classList.remove(_class);
  });
}

function removeSrcAtribut(images) {
  //funkcija briše src slike kad učenik prebaci na novi level
  images.forEach((image) => {
    image.src = "";
  });
}

function removeSrcFromTaskEl() {
  //fukcija briše sliku drveta i godišnjeg doba koje je zadano.
  taskEl.src = ``;
  treeTaskEl.src = ``;
}

///////////////////////////////////////////////////////////////////////////////////
//pomoćne funkcije
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

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
