import { curIsland } from "./island.js";
// import { loadingManager } from "./index.js";
import * as THREE from "three";

export let showJournal = false;

/////////////////////////////////
// ********* OPENING ********* //
/////////////////////////////////
export const loadingManager = new THREE.LoadingManager();

const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementById("progress-bar-container");
const projectTitle = document.getElementById("opening-content-1");
const opening2 = document.getElementById("opening-content-2");
const opening3 = document.getElementById("opening-content-3");
const opening4 = document.getElementById("opening-content-4");
const opening5 = document.getElementById("opening-content-5");
const opening6 = document.getElementById("opening-content-6");

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
  console.log(`Started loading: ${url}`);
  // progressBarContainer.style.display = "block"; // Display the progress bar.
};

loadingManager.onLoad = () => {
  console.log("All resources loaded");

  progressBarContainer.style.opacity = 0;

  setTimeout(function () {
    progressBarContainer.style.display = "none";
    projectTitle.style.display = "flex";
  }, 2000);

  setTimeout(function () {
    projectTitle.style.opacity = 1;
  }, 3000);

  setTimeout(function () {
    projectTitle.style.opacity = 0;
  }, 5000);

  setTimeout(function () {
    // console.log("hide title");
    projectTitle.style.display = "none";
    opening2.style.display = "flex";
  }, 6000);

  setTimeout(function () {
    opening2.style.opacity = 1;
  }, 7000);

  setTimeout(function () {
    opening2.style.opacity = 0;
  }, 9000);

  setTimeout(function () {
    opening2.style.display = "none";
    opening3.style.display = "flex";
  }, 10000);

  setTimeout(function () {
    opening3.style.opacity = 1;
  }, 11000);

  setTimeout(function () {
    opening3.style.opacity = 0;
  }, 13000);

  setTimeout(function () {
    opening3.style.display = "none";
    opening4.style.display = "flex";
  }, 14000);

  setTimeout(function () {
    opening4.style.opacity = 1;
  }, 15000);

  setTimeout(function () {
    opening4.style.opacity = 0;
  }, 17000);

  setTimeout(function () {
    opening4.style.display = "none";
    opening5.style.display = "flex";
  }, 18000);

  setTimeout(function () {
    opening5.style.opacity = 1;
  }, 19000);

  // setTimeout(function () {
  //   opening5.style.opacity = 0;
  // }, 21000);

  // setTimeout(function () {
  //   opening5.style.display = "none";
  //   opening6.style.display = "flex";
  // }, 22000);

  // setTimeout(function () {
  //   opening6.style.opacity = 1;
  // }, 23000);
};

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
  const progress = (itemsLoaded / itemsTotal) * 100;
  console.log(`Loading ${url}: ${Math.round(progress)}%`);
  progressBar.value = progress;
};

// get mouse pos
let mouseX, mouseY;
window.addEventListener("mousemove", (ev) => {
  mouseX = ev.clientX;
  mouseY = ev.clientY;
});

// click on x to hide cards
let xButtons = document.getElementsByClassName("icon-x-wrapper");
// console.log(xButtons);
// console.log(xButtons[0].parentElement);
for (let i = 0; i < xButtons.length; i++) {
  xButtons[i].addEventListener("click", (ev) => {
    // console.log(ev.target.tagName);

    // no matter the x button is in a journal container or a title card
    showJournal = false;

    let targetParent;
    if (ev.target.tagName == "DIV") {
      targetParent = ev.target.parentElement;
      //   console.log("DIV");
      //   console.log(targetParent);
    } else {
      // if "IMG"
      targetParent = ev.target.parentElement.parentElement;
      //   console.log("IMG");
      //   console.log(targetParent);
    }

    if (targetParent && targetParent.style.display != "none") {
      targetParent.style.opacity = 0;
      setTimeout(function () {
        targetParent.style.display = "none";
        // targetParent.style.opacity = 1;
        targetParent.style.opacity = "";
      }, 300);
      // const journal = document.querySelector(".journal");
      // journal.style.display = "none";
    }
  });
}

// hover to update boat icon
const boatIconWrapper = document.getElementsByClassName("icon-boat-wrapper")[0];

boatIconWrapper.addEventListener("mouseenter", function () {
  this.querySelector(".icon-boat-light").style.opacity = 0;
  this.querySelector(".icon-boat-dark").style.opacity = 1;
});

boatIconWrapper.addEventListener("mouseleave", function () {
  this.querySelector(".icon-boat-light").style.opacity = 1;
  this.querySelector(".icon-boat-dark").style.opacity = 0;
});

// hover to update book icon
const bookIconWrappers = document.getElementsByClassName("icon-book-wrapper");

for (let i = 0; i < bookIconWrappers.length; i++) {
  let thisBookIconWrapper = bookIconWrappers[i];

  thisBookIconWrapper.addEventListener("mouseenter", function () {
    this.querySelector(".icon-book").style.opacity = 0;
    this.querySelector(".icon-book-filled").style.opacity = 1;
  });

  thisBookIconWrapper.addEventListener("mouseleave", function () {
    this.querySelector(".icon-book").style.opacity = 1;
    this.querySelector(".icon-book-filled").style.opacity = 0;
  });

  thisBookIconWrapper.addEventListener("click", () => {
    showJournal = true;

    const journal = document.querySelector(".journal");

    const journalContainer = document.querySelector(`#journal-${curIsland}`);
    console.log(`#journal-${curIsland}`);

    // journalContainer.style.display = "block";

    journalContainer.style.display = "block";
    setTimeout(function () {
      journalContainer.style.opacity = 1;
    }, 100);
  });
}

// hover to show translate
function showTranslation(songName) {
  const journalDots = document.getElementsByClassName(
    `journal-dots ${songName}`
  );

  for (let i = 0; i < journalDots.length; i++) {
    let thisDot = journalDots[i];
    thisDot.addEventListener("mouseenter", () => {
      let translationCard = document.querySelector(".journal-translation");
      translationCard.innerHTML = journalEntries[songName][i];
      translationCard.style.visibility = "visible";
      translationCard.style.opacity = 1;
      translationCard.style.left = mouseX + "px";
      translationCard.style.top = mouseY + "px";
    });
    thisDot.addEventListener("mouseleave", () => {
      // console.log("hide translation");
      let translationCard = document.querySelector(".journal-translation");
      // translationCard.style.position = "float";
      translationCard.style.visibility = "hidden";
      // translationCard.style.left = "0px";
      // translationCard.style.top = "0px";
      translationCard.style.opacity = 0;
    });
  }
}

showTranslation("bucika");
showTranslation("german");
