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
document
  .querySelector(".icon-book-wrapper")
  .addEventListener("mouseenter", function () {
    this.querySelector(".icon-book").style.opacity = 0;
    this.querySelector(".icon-book-filled").style.opacity = 1;
  });

document
  .querySelector(".icon-book-wrapper")
  .addEventListener("mouseleave", function () {
    this.querySelector(".icon-book").style.opacity = 1;
    this.querySelector(".icon-book-filled").style.opacity = 0;
  });
