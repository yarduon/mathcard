import { addHours } from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("operations"),
  result = document.getElementById("result");

let usingFloat = false;

function operate(operator, nums, total, firstTime) {
  // Avoid first time to do wrong operations like multiplying by zero
  if (!firstTime) {
    switch (operator) {
      case "+":
        total += +nums;
        break;
      case "-":
        total -= +nums;
        break;
      case "x":
        // 12 + 7 - 5 * 3 = should yield 42
        console.log("Me llegó: " + nums);
        total *= +nums;
        console.log("Lo convertí en: " + total);
        break;
      case "÷":
        total /= +nums;
        break;
    }
  } else {
    total = +nums;
  }
  return total;
}

function stringToMath(s) {
  let total = 0,
    nums = "",
    lastOperator = "",
    firstTime = true;
  Array.from(s).forEach((e, i) => {
    // Gather group of numbers
    if (!isNaN(e) || e === ".") {
      nums += e;
    } else {
      // Calculate every time find an operator
      total = operate(e, nums, total, firstTime);
      firstTime = false;
      lastOperator = e;
      // Reset group of numbers
      nums = "";
    }
    // Calculate last numbers after the last operator
    if (i == Array.from(s).length - 1) {
      total = operate(lastOperator, nums, total);
    }
  });
  return total;
}

function updateRates(json, currentDate) {
  // Obtain current conversion rates
  fetch(json)
    .then((response) => response.json())
    .then((data) => {
      // Convert rates to local data
      localStorage.setItem("currency", JSON.stringify(data));
    });
  // Rates won't be updated until next 24 hours
  localStorage.setItem("updateTime", addHours(currentDate, 24));
}

window.onload = () => {
  if (
    !localStorage.getItem("updateTime") ||
    new Date() >= new Date(localStorage.getItem("updateTime"))
  ) {
    updateRates("https://api.exchangerate-api.com/v4/latest/euro", new Date());
  }
};

buttons.forEach((e) => {
  e.addEventListener("click", () => {
    if (!usingFloat || e.innerText != ".") {
      topScreen.innerText += e.innerText;
      // Avoid user to use more than one dot in a group of numbers
      if (e.innerText === ".") {
        usingFloat = true;
      }
      // Reset uses of dots
      if (
        Array.from(document.getElementsByClassName("operator")).includes(
          document.getElementById(e.innerText)
        )
      ) {
        usingFloat = false;
      }
    }
  });
});

// Keyboard support

document.getElementById("equal").addEventListener("click", () => {
  result.innerText = stringToMath(topScreen.innerText);
});

document.getElementById("del").addEventListener("click", () => {
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);

  // Prevent NaN or zero values and calculate the result by deleting numbers
  isNaN(stringToMath(topScreen.innerText)) || result.innerText == 0
    ? (result.innerText = 0)
    : (result.innerText = stringToMath(topScreen.innerText));
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
  result.innerText = 0;
});
