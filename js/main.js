import { addHours, isOperator } from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("operations"),
  result = document.getElementById("result");

let usingFloat = false;

function deleteNumber() {
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);

  // Prevent NaN or zero values and calculate the result by deleting numbers
  isNaN(mathToOperations(mathToArray(topScreen.innerText))) ||
  result.innerText == 0
    ? (result.innerText = 0)
    : (result.innerText = mathToOperations(mathToArray(topScreen.innerText)));
}

function operate(operator, num1, num2) {
  let total = 0;
  switch (operator) {
    case "+":
      total = +num1 + +num2;
      break;
    case "-":
      total = +num1 - +num2;
      break;
    case "*":
      total = +num1 * +num2;
      break;
    case "/":
      total = +num1 / +num2;
      break;
  }
  return total;
}

function mathToArray(string) {
  let group = "",
    operations = [];
  Array.from(string).forEach((e, i) => {
    // Accumulate characters only when there aren't operators
    if (!isOperator(e)) {
      group += e;
    } else {
      // Avoid empty spaces when there are two operators consecutively
      if (group.length >= 1) operations.push(group);
      // Fill with current operator
      operations.push(e);
      // Reset current group
      group = "";
    }
    // Fill last space when there are no more operators
    if (i == Array.from(string).length - 1 && !isOperator(e)) {
      operations.push(group);
    }
  });
  return operations;
}

function mathToOperations(array) {
  let j = 0,
    firstPos = 0,
    secondPos = 0,
    quantity = 0,
    fragment = [];
  // If there are brackets in the operations
  while (array.includes("(") && array.includes(")")) {
    let i = 0;
    // Find last open bracket
    while (array.indexOf("(", i) != -1) {
      i = array.indexOf("(", i);
      // Last open bracket location and last element of iterations
      firstPos = i;
      i++;
    }
    secondPos = array.indexOf(")", firstPos);
    quantity = (firstPos - secondPos) * -1 + 1;
    fragment = array.slice(firstPos + 1, secondPos);

    if (fragment.includes("/")) {
      j = fragment.indexOf("/");
      fragment.splice(
        j - 1,
        j + 2,
        operate(fragment[j], fragment[j - 1], fragment[j + 1])
      );
    }
    if (fragment.includes("*")) {
      j = fragment.indexOf("*");
      fragment.splice(
        j - 1,
        j + 2,
        operate(fragment[j], fragment[j - 1], fragment[j + 1])
      );
    }

    if (fragment.includes("+")) {
      j = fragment.indexOf("+");
      fragment.splice(
        j - 1,
        j + 2,
        operate(fragment[j], fragment[j - 1], fragment[j + 1])
      );
    }

    if (fragment.includes("-")) {
      j = fragment.indexOf("-");
      fragment.splice(
        j - 1,
        j + 2,
        operate(fragment[j], fragment[j - 1], fragment[j + 1])
      );
    }

    array.splice(firstPos, quantity, ...fragment);
  }
  // Extra after brackets
  while (array.includes("/")) {
    j = 0;
    while (array.indexOf("/", j) != -1) {
      j = array.indexOf("/", j);
      // Last open bracket location and last element of iterations
      array.splice(j - 1, j + 2, operate(array[j], array[j - 1], array[j + 1]));
      j++;
    }
  }

  while (array.includes("*")) {
    j = 0;
    while (array.indexOf("*", j) != -1) {
      j = array.indexOf("*", j);
      // Last open bracket location and last element of iterations
      array.splice(j - 1, j + 2, operate(array[j], array[j - 1], array[j + 1]));
      j++;
    }
  }

  while (array.includes("+")) {
    j = 0;
    while (array.indexOf("+", j) != -1) {
      j = array.indexOf("+", j);
      // Last open bracket location and last element of iterations
      array.splice(j - 1, j + 2, operate(array[j], array[j - 1], array[j + 1]));
      j++;
    }
  }
  while (array.includes("-")) {
    j = 0;
    while (array.indexOf("-", j) != -1) {
      j = array.indexOf("-", j);
      // Last open bracket location and last element of iterations
      array.splice(j - 1, j + 2, operate(array[j], array[j - 1], array[j + 1]));
      j++;
    }
  }
  return array;
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
      topScreen.innerText += e.id;
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
      result.innerText = mathToOperations(mathToArray(topScreen.innerText));
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
  result.innerText = mathToOperations(mathToArray(topScreen.innerText));
});

document.getElementById("Backspace").addEventListener("click", () => {
  deleteNumber();
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
  result.innerText = 0;
});
