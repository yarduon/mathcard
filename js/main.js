import { addHours } from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("operations"),
  result = document.getElementById("result");

let usingFloat = false;

function deleteNumber() {
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);

  // Prevent NaN or zero values and calculate the result by deleting numbers
  isNaN(stringToMath(topScreen.innerText)) || result.innerText == 0
    ? (result.innerText = 0)
    : (result.innerText = stringToMath(topScreen.innerText));
}

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
      case "*":
        total *= +nums;
        break;
      case "/":
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
  // Avoid NaN or infinity values
  return isNaN(total) || !isFinite(total) ? "Syntax Error" : total;
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
    // Write on screen except equal or dot when is repeated
    if (
      (!usingFloat || e.innerText != ".") &&
      e.innerText != "=" &&
      e.innerText != "DEL"
    ) {
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

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    // Character value and key are different
    case "Backspace":
      deleteNumber();
      break;
    case "=":
      result.innerText = stringToMath(topScreen.innerText);
      break;
    // Character value and key are different
    case "Dead":
      topScreen.innerText += "^";
      break;
    case ".":
      if (!usingFloat) {
        topScreen.innerText += e.key;
      }
      // Avoid user to use more than one dot in a group of numbers
      usingFloat = true;
      break;
    default:
      // Write on screen except when key is not assigned to any button
      if (
        Array.from(document.getElementsByClassName("calc-button")).includes(
          document.getElementById(e.key)
        )
      ) {
        topScreen.innerText += e.key;
        // Reset uses of dots
        if (
          Array.from(document.getElementsByClassName("operator")).includes(
            document.getElementById(e.key)
          )
        ) {
          usingFloat = false;
        }
      }
  }
  // Apply an style when a pressed key has focus except key is not assigned to any button
  if (
    Array.from(document.getElementsByClassName("calc-button")).includes(
      document.getElementById(e.key)
    )
  ) {
    document.getElementById(e.key).focus();
  }
});

document.getElementById("=").addEventListener("click", () => {
  result.innerText = stringToMath(topScreen.innerText);
});

document.getElementById("Backspace").addEventListener("click", () => {
  deleteNumber();
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
  result.innerText = 0;
});
