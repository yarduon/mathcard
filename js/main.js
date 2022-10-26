// https://yarduon.com
import {
  addHours,
  isOperator,
  swapClasses,
  stringToBoolean,
} from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("operations"),
  result = document.getElementById("result"),
  operators = Array.from(document.getElementsByClassName("operators")),
  // The order of symbols determines preference when resolving operations
  symbols = [
    "PI",
    "LOG",
    "SIN",
    "COS",
    "TAN",
    "SQR",
    "%",
    "^",
    "/",
    "*",
    "-",
    "+",
  ];
let usingFloat = false;

function operate(operator, num1, num2) {
  let total = 0;
  switch (operator) {
    case "+":
      total = +num1 + +num2;
      break;
    case "-":
      // Calculate subtract or transform into negative
      !isNaN(num1) ? (total = +num1 - +num2) : (total = +num2 - +num2 * 2);
      break;
    case "*":
      total = +num1 * +num2;
      break;
    case "/":
      total = +num1 / +num2;
      break;
    case "^":
      total = Math.pow(num1, num2);
      break;
    case "%":
      // Calculate percentage or remainder
      !isOperator(num2) && String(num2) != "undefined"
        ? (total = num1 % num2)
        : (total = num1 / 100);
      break;
    case "LOG":
      total = Math.log10(num2);
      break;
    case "SIN":
      total = Math.sin(num2 * (Math.PI / 180));
      break;
    case "COS":
      total = Math.cos(num2 * (Math.PI / 180));
      break;
    case "TAN":
      total = Math.tan(num2 * (Math.PI / 180));
      break;
    case "PI":
      total = Math.PI;
      break;
    case "SQR":
      total = Math.sqrt(num2);
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

function findAndReplaceCalc(operator, array) {
  let pos = 0;
  // Find the specified operator until there are none left
  while (array.indexOf(operator, pos) != -1) {
    // Current location of operator
    pos = array.indexOf(operator, pos);
    // Replace operations by the result
    isOperator(operator) && !isNaN(String(array[pos - 1]))
      ? array.splice(
          pos - 1,
          (pos - 1 - (pos + 1)) * -1 + 1,
          operate(array[pos], array[pos - 1], array[pos + 1])
        )
      : array.splice(
          pos,
          (pos - 1 - (pos + 1)) * -1,
          operate(array[pos], array[pos - 1], array[pos + 1])
        );
  }
  // Search for next same operator
  pos++;
}

function mathToOperations(array) {
  let firstPos = 0;
  // If there are parentheses in the operations
  while (array.includes("(") && array.includes(")")) {
    let i = 0;
    // Find last open parentheses
    while (array.indexOf("(", i) != -1) {
      i = array.indexOf("(", i);
      // Last open parentheses location and last element of iterations
      firstPos = i;
      i++;
    }
    // Resolve operations inside that pair of parentheses
    symbols.forEach((e) => {
      findAndReplaceCalc(
        e,
        array.slice(firstPos + 1, array.indexOf(")", firstPos))
      );
    });

    // Replace the parentheses with the final result
    array.splice(
      firstPos,
      (firstPos - array.indexOf(")", firstPos)) * -1 + 1,
      ...array.slice(firstPos + 1, array.indexOf(")", firstPos))
    );
  }

  // After cleaning parentheses calculate final operations
  symbols.forEach((e) => {
    findAndReplaceCalc(e, array);
  });

  return !isNaN(array[0])
    ? Math.round(array[0] * 10000000000) / 10000000000
    : "Syntax Error";
}

function selectButton(name) {
  // Storage the last and next to last elements displaying on screen
  let lastSelected = topScreen.innerText.charAt(topScreen.innerText.length - 1),
    nextToLastSelected = topScreen.innerText.charAt(
      topScreen.innerText.length - 2
    );
  // Write on screen and apply focus except when key is not assigned to any button
  if (buttons.includes(document.getElementById(name))) {
    // Highlight button
    document.getElementById(name).focus();
    // Write on screen but avoid user to use more than one dot in a group of numbers, special characters or numbers
    if (
      isNaN(name) &&
      name !== "Backspace" &&
      name !== "=" &&
      name !== "Dead" &&
      (name !== "." || !usingFloat)
    ) {
      topScreen.innerText += name;
      fillEmptyOperation(name, lastSelected);
    }

    // Write on screen numbers and avoid placing together zeros an numbers
    if ((!isNaN(name) && lastSelected !== "0") || nextToLastSelected === ".") {
      console.log(isNaN(name));
      console.log(name);
      topScreen.innerText += name;
    }

    // Update saved data
    localStorage.setItem("topScreen", topScreen.innerText);
    // Buttons with special behaviour
    switch (name) {
      case ".":
        usingFloat = true;
        break;
      case "Backspace":
        deleteNumber();
        break;
      case "Dead":
        // Character value and key are different
        topScreen.innerText += "^";
        fillEmptyOperation(name, lastSelected);
        // Update saved data
        localStorage.setItem("topScreen", topScreen.innerText);
        break;
      case "=":
        result.innerText = mathToOperations(mathToArray(topScreen.innerText));
        // Save result
        localStorage.setItem("result", result.innerText);
        break;
    }
    // Reset uses of dots
    if (operators.includes(document.getElementById(name))) usingFloat = false;
  }
}

function deleteNumber() {
  if (
    String(
      Array.from(topScreen.innerText)[
        Array.from(topScreen.innerText).length - 1
      ]
    ) === "."
  ) {
    usingFloat = false;
  }
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);

  // Update saved data
  localStorage.setItem("topScreen", topScreen.innerText);

  // Prevent NaN and calculate the result by deleting numbers
  isNaN(mathToOperations(mathToArray(topScreen.innerText)))
    ? (result.innerText = 0)
    : (result.innerText = mathToOperations(mathToArray(topScreen.innerText)));

  // Update saved data
  localStorage.setItem("result", result.innerText);
}

function fillEmptyOperation(operator, lastSelected) {
  // Convert screen to an array
  let screen = Array.from(topScreen.innerText);
  if ((isOperator(operator) && operator != "(") || operator === "Dead") {
    // When there is only an operator without any numbers on the left
    if (lastSelected === "" || lastSelected === "(") {
      // Modify screen adding a zero in empty operations
      screen.splice(screen.length - 1, 0, "0");
      topScreen.innerText = screen.join("");
    }
  }
}

// Turn on and turn off
function powerOnOff(event) {
  // Change status when button is pressed or clicked
  if (event) {
    let status = stringToBoolean(localStorage.getItem("power"));
    localStorage.setItem("power", !status);
  }

  if (localStorage.getItem("power") === "true") {
    // Only when button is pressed or clicked
    if (event) {
      // Fill and show data values
      result.innerText = 0;
      document.getElementById("operations").classList.remove("hidden");
      // Updated saved data
      localStorage.setItem("result", result.innerText);
    }

    // Activate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = false;
    });

    // Change power status buttons colors
    swapClasses(document.getElementById("on"), "green", "black");
    swapClasses(document.getElementById("off"), "black", "red");
  } else {
    // Empty and hide data values
    topScreen.innerText = "";
    result.innerText = "";
    document.getElementById("operations").classList.add("hidden");

    // Updated saved data
    localStorage.setItem("result", result.innerText);
    localStorage.setItem("topScreen", result.innerText);

    // Deactivate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = true;
    });

    // Change power status buttons colors
    swapClasses(document.getElementById("on"), "black", "green");
    swapClasses(document.getElementById("off"), "red", "black");
  }
  return stringToBoolean(localStorage.getItem("power"));
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
  if (!localStorage.getItem("power")) {
    localStorage.setItem("power", true);
  }

  if (!localStorage.getItem("memory")) {
    localStorage.setItem("memory", 0);
  }

  if (
    !localStorage.getItem("updateTime") ||
    new Date() >= new Date(localStorage.getItem("updateTime"))
  ) {
    updateRates("https://api.exchangerate-api.com/v4/latest/euro", new Date());
  }

  // Refresh values according with data storage
  if (powerOnOff()) {
    topScreen.innerText = localStorage.getItem("topScreen");
    result.innerText = localStorage.getItem("result");
  }
};

buttons.forEach((e) => {
  e.addEventListener("click", () => {
    selectButton(e.id);
  });
});

window.addEventListener("keydown", (e) => {
  selectButton(e.key);
});

document.getElementById("=").addEventListener("click", () => {
  result.innerText = mathToOperations(mathToArray(topScreen.innerText));
  // Save result
  localStorage.setItem("result", result.innerText);
});

document.getElementById("Backspace").addEventListener("click", () => {
  deleteNumber();
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
  result.innerText = 0;
  // Reset data
  localStorage.setItem("topScreen", topScreen.innerText);
  localStorage.setItem("result", result.innerText);
});

document.getElementById("m+").addEventListener("click", () => {
  localStorage.setItem(
    "memory",
    +localStorage.getItem("memory") + +result.innerText
  );
});

document.getElementById("m-").addEventListener("click", () => {
  localStorage.setItem(
    "memory",
    +localStorage.getItem("memory") - +result.innerText
  );
});

document.getElementById("mr").addEventListener("click", () => {
  topScreen.innerText += localStorage.getItem("memory");
  // Update saved data
  localStorage.setItem("topScreen", topScreen.innerText);
});

document.getElementById("ms").addEventListener("click", () => {
  localStorage.setItem("memory", result.innerText);
});

document.getElementById("mc").addEventListener("click", () => {
  localStorage.removeItem("memory");
});

document.getElementById("ce").addEventListener("click", () => {
  result.innerText = 0;
  // Update saved data
  localStorage.setItem("result", result.innerText);
});

document.getElementById("power").addEventListener("click", (e) => {
  // Turn on and turn off
  powerOnOff(e);
});
