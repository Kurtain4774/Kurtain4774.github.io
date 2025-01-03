const gradients = [
  [46, 49, 146, 27, 255, 255],
  [212, 20, 90, 251, 176, 59],
  [0, 146, 69, 252, 238, 33],
  [238, 156, 167, 255, 221, 225],
  [97, 67, 133, 81, 99, 149],
  [2, 170, 189, 0, 205, 172],
  [255, 81, 47, 221, 36, 118],
  [255, 95, 109, 255, 195, 113],
  [17, 153, 142, 56, 239, 125],
  [198, 234, 141, 254, 144, 175],
  [234, 141, 141, 168, 144, 254],
  [216, 181, 255, 30, 174, 152],
  [255, 97, 210, 254, 144, 144],
  [191, 240, 152, 111, 214, 255],
  [78, 101, 255, 146, 239, 253],
  [169, 241, 223, 255, 187, 187],
  [195, 55, 100, 29, 38, 113],
  [147, 165, 207, 228, 239, 233],
  [134, 143, 150, 89, 97, 100],
  [9, 32, 63, 83, 120, 149],
  [255, 236, 210, 252, 182, 159],
  [161, 196, 253, 194, 233, 251],
  [118, 75, 162, 102, 126, 234],
  [253, 252, 251, 226, 209, 195],
];
//color 1 is the inside color and color2 is the outside edge gradient color
let color1 = { value: [0, 0, 0], change: [0, 0, 0], target: [0, 0, 0] };
let color2 = { value: [0, 0, 0], change: [0, 0, 0], target: [0, 0, 0] };

let lastY = 0;

//color mode variables
let darkMode = 0;
let lightMode = 0;

let scrollDelay = 0;
let time = 0;

let themeSelected = 0;

const btn = document.querySelector("#btn");
const topNav = document.getElementById("top-nav");
const body = document.body;
const background = document.getElementById("background");
const lightModePercent = document.getElementById("light-mode-percentage-text");
const darkModePercent = document.getElementById("dark-mode-percentage-text");
const lightModeContainer = document.getElementById("light-container");
const darkModeContainer = document.getElementById("dark-container");
const percentageElements = document.getElementsByClassName("arrow-container");
const arrows = document.getElementsByClassName("arrow");
const buttonContainer = document.getElementById("button-container");
const loc = document.getElementById("location");
const nameText = document.getElementById("name");
const topScrollContainer = document.getElementById("top-scroll-container");
const bottomScrollContainer = document.getElementById("bottom-scroll-container");
const topLeft = document.getElementById("top-left-container");
const topRight = document.getElementById("top-right-container");
const middleLeft = document.getElementById("middle-left-container");
const middleRight = document.getElementById("middle-right-container");
const bottomLeft = document.getElementById("bottom-left-container");
const bottomRight = document.getElementById("bottom-right-container");
const centerContainer = document.getElementById("center");
//start the animation
requestAnimationFrame(animate);

//when scrolling call the scroll function
window.addEventListener("wheel", scroll, { passive: false });

//initialize a random starting background gradient color
changeColor();

//initialize the center button background and text color
//btn.style.backgroundColor = "white";
btn.style.color = "black";

//function to check if the color has reached its target returns a new target if it has reached its target
function checkTarget(color, target, change, loc) {
  //if we have reached the target make a new one
  if (
    change[0] == 0 ||
    (change[0] > 0 && color[0] >= target[0]) ||
    (change[0] < 0 && color[0] <= target[0])
  ) {
    target = generateNewTarget(color, loc);
    //calculate the change array
    change = [target[0] - color[0], target[1] - color[1], target[2] - color[2]];

    //divide by the magnitude to turn it into a unit vector
    let magnitude = Math.sqrt(
      change[0] * change[0] + change[1] * change[1] + change[2] * change[2]
    );

    for (let i = 0; i < 3; i++) {
      change[i] = change[i] / magnitude;
    }
  }

  return { target: target, change: change };
}

//updates the colors to move towards their target colors
function updateValues() {
  //update the values
  color1.value = updateValue(color1.value, color1.change);
  //check if we need a new target value and creates a new one if we do
  let r1 = checkTarget(color1.value, color1.target, color1.change, 1);
  //update the new target and change arrays
  color1.target = r1.target;
  color1.change = r1.change;

  //do the same with the second color
  color2.value = updateValue(color2.value, color2.change);
  let r2 = checkTarget(color2.value, color2.target, color2.change, 2);
  color2.target = r2.target;
  color2.change = r2.change;
}

//return an array of 3 ints that is at least somewhat different than the current color
function generateNewTarget(color, loc) {
  let rand = getRandomInt(gradients.length);

  let gradientRGB = gradients[rand];

  while (gradientRGB[0] == color[0] || gradientRGB[3] == color[0]) {
    rand = getRandomInt(gradients.length);

    gradientRGB = gradients[rand];
  }

  if (loc == 1) return [gradientRGB[0], gradientRGB[1], gradientRGB[2]];
  else return [gradientRGB[3], gradientRGB[4], gradientRGB[5]];
}

//update values and set the colors to the new values
function animate(timestamp) {
  time++;
  if (scrollDelay > 0) {
    scrollDelay--;
    time = 0;
    //console.log(scrollDelay);
  } else {
    updateValues();
    updateColor();
    if (time % 10 == 0) {
      lightMode = Math.round(Math.max(lightMode - time / 50, 0));
      darkMode = Math.round(Math.max(darkMode - time / 50, 0));
    }

    updatePercentageText();
  }

  if (themeSelected == 0) {
    requestAnimationFrame(animate);
  }
}

function updatePercentageText() {
  lightModePercent.textContent =
    (Math.round(lightMode * 10) / 10).toString() + "%";
  darkModePercent.textContent =
    (Math.round(darkMode * 10) / 10).toString() + "%";
}

//creates an rgb color from 3 values
function createColor(color) {
  return `rgb(${color[0]},${color[1]},${color[2]})`;
}

//function sets the css values to the newly updated js values
function updateColor() {
  if (themeSelected == 0) {
    let c1 = createColor(color1.value);
    let c2 = createColor(color2.value);

    background.style.background = `radial-gradient(${c1},${c2})`;
    btn.style.background = `rgb(${color1.value[0]},${color1.value[1]},${color1.value[2]}, 0.7)`;

    //btn.style.border =  `2px solid ${c2}`;

    //buttonContainer.style.borderImage = `linear-gradient(to right, ${c1},${c2}) 1`

    let luminance =
      0.2126 * (color1.value[0] / 255) +
      0.7152 * (color1.value[1] / 255) +
      0.0722 * (color1.value[2] / 255);

    if (luminance >= 0.7) {
      for (let i = 0; i < percentageElements.length; i++) {
        percentageElements[i].style.color = "black";
      }
      for (let i = 0; i < arrows.length; i++) {
        arrows[i].style.borderColor = "black";
      }
      nameText.style.color = "black";
      loc.style.color = "black";
    } else if (luminance <= 0.3) {
      for (let i = 0; i < percentageElements.length; i++) {
        percentageElements[i].style.color = "white";
      }
      for (let i = 0; i < arrows.length; i++) {
        arrows[i].style.borderColor = "white";
      }
      nameText.style.color = "white";
      loc.style.color = "white";
    }
  } else if (themeSelected == 1) {
    background.style.background = "white";
    color1.value = [255, 255, 255];
    color2.value = [255, 255, 255];
  } else if (themeSelected == 2) {
    background.style.background = "black";
    color1.value = [0, 0, 0];
    color2.value = [0, 0, 0];
  }
}

//return int between 0 and max
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//prints rgb of a color
function printColor(color) {
  console.log(color[0] + " " + color[1] + " " + color[2]);
}

function changeContent() {
  buttonContainer.style.backgroundColor = "transparent";
  buttonContainer.style.width = "100%";
  buttonContainer.style.padding = "0px";
  btn.style.margin = "0px";
  btn.style.padding = "0px";
  btn.style.height = "100%";
  btn.style.width = "100%";
  btn.style.borderRadius = "10px";
  topLeft.classList.toggle("hidden");
  topLeft.classList.toggle("animateX");
  topRight.classList.toggle("hidden");
  topRight.classList.toggle("animateX");
  middleLeft.classList.toggle("hidden");
  middleLeft.classList.toggle("animateX");
  middleRight.classList.toggle("hidden");
  middleRight.classList.toggle("animateX");
  bottomLeft.classList.toggle("hidden");
  bottomLeft.classList.toggle("animateY");
  bottomRight.classList.toggle("hidden");
  bottomRight.classList.toggle("animateY");
}

function lightTheme() {
  themeSelected = 1;
  topNav.style.backgroundColor = "#f0f0f0";
  lightModeContainer.classList.toggle("invisible");
  darkModeContainer.classList.toggle("invisible");
  topScrollContainer.classList.remove("scroll-container");
  bottomScrollContainer.classList.remove("scroll-container");
  topScrollContainer.style.display = "none";
  bottomScrollContainer.style.display = "none";
  centerContainer.classList.toggle("center");
  btn.classList.remove("clickable");
  nameText.style.color = "black";
  loc.style.color = "black";
  changeContent();
  background.style.backgroundColor = "white";
  btn.style.backgroundColor = "#f0f0f0";
  btn.style.color = "black";
  btn.style.borderColor = "transparent";

  updateColor();
  snow();
  btn.removeAttribute("onclick");
  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.style.backgroundColor = "#f2f2f2";
    box.style.color = "black";
  });
}

function darkTheme() {
  themeSelected = 2;
  lightModeContainer.classList.toggle("invisible");
  darkModeContainer.classList.toggle("invisible");
  topScrollContainer.classList.remove("scroll-container");
  bottomScrollContainer.classList.remove("scroll-container");
  topScrollContainer.style.display = "none";
  bottomScrollContainer.style.display = "none";
  centerContainer.classList.toggle("center");
  btn.style.backgroundColor = "white";
  btn.style.borderColor = "transparent";
  btn.classList.remove("clickable");
  nameText.style.color = "black";
  loc.style.color = "black";
  changeContent();
  updateColor();
  makeItRain();
  background.style.backgroundColor = "#111111";
  btn.removeAttribute("onclick");

  const boxes = document.querySelectorAll(".box");
  boxes.forEach((box) => {
    box.style.backgroundColor = "#232326";
    box.style.color = "white";
  });
  
}

function reset() {
  requestAnimationFrame(animate);
  themeSelected = 0;
  lightMode = 0;
  darkMode = 0;
  btn.addEventListener("click", changeColor());
  btn.classList.add('clickable');
  $(".rain").empty();
  $(".snow").empty();
  buttonContainer.style.backgroundColor = "white";
  buttonContainer.style.width = "100vw";
  buttonContainer.style.padding = "15px";
  btn.style.margin = "auto";
  btn.style.padding = "10px 5px";
  btn.style.height = "auto";
  btn.style.width = "calc(180px + 20vw)";
  btn.style.borderRadius = "0px";

  lightModeContainer.classList.remove("invisible");
  darkModeContainer.classList.remove("invisible");
  topScrollContainer.classList.add("scroll-container");
  bottomScrollContainer.classList.add("scroll-container");
  topScrollContainer.style.display = "block";
  bottomScrollContainer.style.display = "block";
  centerContainer.classList.remove("center");

  topLeft.classList.add("hidden");
  topLeft.classList.remove("animateX");
  topRight.classList.add("hidden");
  topRight.classList.remove("animateX");
  middleLeft.classList.add("hidden");
  middleLeft.classList.remove("animateX");
  middleRight.classList.add("hidden");
  middleRight.classList.remove("animateX");
  bottomLeft.classList.add("hidden");
  bottomLeft.classList.remove("animateY");
  bottomRight.classList.add("hidden");
  bottomRight.classList.remove("animateY");

  updatePercentageText();
}

//generates a new gradient
function changeColor() {
  if (themeSelected != 0) {
    reset();
  }

  let rand = getRandomInt(gradients.length);

  const gradientRGB = gradients[rand];

  color1.value = [gradientRGB[0], gradientRGB[1], gradientRGB[2]];
  color2.value = [gradientRGB[3], gradientRGB[4], gradientRGB[5]];

  updateColor();

  //also updates the color of the center button
  let c1 = createColor(color1.value);
  //document.getElementById("btn").style.backgroundColor =  `${c1}`;
}

//set color to the new value clamp between 0 and 255
function updateValue(value, change) {
  for (let i = 0; i < 3; i++) {
    value[i] = Math.max(0, Math.min(value[i] + change[i], 255));
  }

  return value;
}

document.addEventListener("touchstart", function (event) {
  // Get the first touch point's Y position
  lastY = event.touches[0].pageY;
});
// Add a touchmove listener to calculate deltaY
document.addEventListener("touchmove", function (event) {
  // Get the current Y position of the first touch point
  const currentY = event.touches[0].pageY;

  // Calculate the deltaY (difference in Y position)
  const deltaY = currentY - lastY;

  if (themeSelected == 0) {
    let change = -deltaY / 2.0;

    color1.value = updateValue(color1.value, [change, change, change]);
    color2.value = updateValue(color2.value, [change, change, change]);

    updateColor();

    change /= 2.5;

    if (change > 0) {
      lightMode += change;
      darkMode -= change;
    } else {
      darkMode += -change;
      lightMode -= -change;
    }

    lightMode = Math.max(Math.min(100, lightMode), 0);
    darkMode = Math.max(Math.min(100, darkMode), 0);

    scrollDelay = Math.min(scrollDelay + 25, 400);

    updatePercentageText();

    if (lightMode == 100) {
      lightTheme();
    }
    if (darkMode == 100) {
      darkTheme();
    }
  }

  // Update the lastY value for the next move event
  lastY = currentY;

  // Prevent the default behavior (optional, if you want to prevent scrolling)
  event.preventDefault();
});

//gets the distance scrolled and update the colors based on the distance
function scroll(event) {
  if (themeSelected == 0) {
    let change = -event.deltaY / 5.0;

    color1.value = updateValue(color1.value, [change, change, change]);
    color2.value = updateValue(color2.value, [change, change, change]);

    updateColor();

    change /= 2.5;

    if (change > 0) {
      lightMode += change;
      darkMode -= change;
    } else {
      darkMode += -change;
      lightMode -= -change;
    }

    lightMode = Math.max(Math.min(100, lightMode), 0);
    darkMode = Math.max(Math.min(100, darkMode), 0);

    scrollDelay = Math.min(scrollDelay + 25, 400);

    updatePercentageText();

    if (lightMode == 100) {
      lightTheme();
    }
    if (darkMode == 100) {
      darkTheme();
    }
  }
}

var makeItRain = function () {
  //clear out everything
  $(".rain").empty();

  var increment = 0;
  var drops = "";

  while (increment < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = Math.floor(Math.random() * (98 - 1 + 1) + 1);
    //random number between 5 and 2
    var randoFiver = Math.floor(5 * Math.random() + 10);
    //increment
    increment += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops +=
      '<div class="drop" style="left: ' +
      increment +
      "%;animation-delay: 1." +
      randoHundo +
      "s; animation-duration: 0.9" +
      randoHundo +
      's;"><div class="stem" style="animation-delay: 1.' +
      randoHundo +
      "s; animation-duration: 0.9" +
      randoHundo +
      's;"></div></div>';
  }

  $(".rain.front-row").append(drops);
};

var snow = function () {
  //clear out everything
  $(".snow").empty();

  var x = 0;
  var drops = "";

  while (x < 100) {
    //couple random numbers to use for various randomizations
    //random number between 98 and 1
    var randoHundo = 1+ Math.random() * 10;
    //random number between 5 and 2
    var randoFiver = Math.floor(6 * Math.random() + 3);
    //increment
    x += randoFiver;
    //add in a new raindrop with various randomizations to certain CSS properties
    drops += `
  <div class="slow-drop snowflake" style="left: ${x}%; animation-delay: ${randoHundo}s; animation-duration: 10s;">
    <div class="shake" style="animation-delay: ${randoHundo}s; animation-duration: 3.5s;">
      ❅
    </div>
  </div>
`;
  }

  $(".snow").append(drops);
};
