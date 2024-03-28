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
      targetParent.style.display = "none";
    }
  });
}

// hover to update book icon
let bookIconWrappers = document.getElementsByClassName("icon-book-wrapper");

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
    document.querySelector(".journal").style.display = "block";
  });
}

// hover to show translate
// console.log(document.querySelector(".journal-dots"));
let journalDotsBucika = document.getElementsByClassName("journal-dots bucika");
// console.log(journalDotsBucika);

for (let i = 0; i < journalDotsBucika.length; i++) {
  let thisDot = journalDotsBucika[i];
  thisDot.addEventListener("mouseenter", () => {
    // console.log("show translation");
    let translationCard = document.querySelector(".journal-translation");
    // console.log(journalEntries.bucika[i]);
    translationCard.innerHTML = journalEntries.bucika[i];
    // translationCard.style.position = "absolute";
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
