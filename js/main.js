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
  // The order of operators determines preference when resolving operations
  operators = [
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
    "+",
    "-",
  ];
let usingFloat = false;

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
    isOperator(operator)
      ? array.splice(
          pos - 1,
          (pos - 1 - (pos + 1)) * -1 + 1,
          operate(array[pos], array[pos - 1], array[pos + 1])
        )
      : array.splice(
          pos,
          (pos - 1 - (pos + 1)) * -1 + 1,
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
    operators.forEach((e) => {
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
  operators.forEach((e) => {
    findAndReplaceCalc(e, array);
  });

  return Math.round(array[0] * 10000000000) / 10000000000;
}

function deleteNumber() {
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);
  // Update saved data
  localStorage.setItem("topScreen", topScreen.innerText);

  // Prevent NaN or zero values and calculate the result by deleting numbers
  isNaN(mathToOperations(mathToArray(topScreen.innerText)))
    ? (result.innerText = 0)
    : (result.innerText = mathToOperations(mathToArray(topScreen.innerText)));

  // Update saved data
  localStorage.setItem("result", result.innerText);
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
    // Write on screen except equal or dot when is repeated
    if (
      (!usingFloat || e.innerText != ".") &&
      e.innerText != "=" &&
      e.innerText != "DEL"
    ) {
      topScreen.innerText += e.id;
      // Update saved data
      localStorage.setItem("topScreen", topScreen.innerText);
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
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
      usingFloat = false;
      if (
        Array.from(topScreen.innerText)[
          Array.from(topScreen.innerText).length - 1
        ] !== "0" ||
        Array.from(topScreen.innerText)[
          Array.from(topScreen.innerText).length - 2
        ] === "."
      ) {
        topScreen.innerText += e.key;
      }
      break;
    case "+":
    case "*":
    case "-":
    case "/":
    case "Dead":
    case "%":
      // Character value and key are different
      if (
        Array.from(topScreen.innerText)[
          Array.from(topScreen.innerText).length - 1
        ] != e.key
      ) {
        if (e.key != "Dead") {
          topScreen.innerText += e.key;
        } else {
          if (
            "^" !=
            Array.from(topScreen.innerText)[
              Array.from(topScreen.innerText).length - 1
            ]
          ) {
            topScreen.innerText += "^";
          }
        }
      }
      // Update saved data
      localStorage.setItem("topScreen", topScreen.innerText);
      if (
        String(
          Array.from(topScreen.innerText)[
            Array.from(topScreen.innerText).length - 2
          ]
        ) === "undefined" ||
        String(
          Array.from(topScreen.innerText)[
            Array.from(topScreen.innerText).length - 2
          ]
        ) === "("
      ) {
        let x = Array.from(topScreen.innerText);
        x.splice(Array.from(topScreen.innerText).length - 1, 0, "0");
        topScreen.innerText = x.join("");
        localStorage.setItem("topScreen", topScreen.innerText);
      }
      break;
    case "=":
      result.innerText = mathToOperations(mathToArray(topScreen.innerText));
      // Save result
      localStorage.setItem("result", result.innerText);
      console.log(result.innerText);
      break;
    case ".":
      if (!usingFloat) {
        topScreen.innerText += e.key;
        // Update saved data
        localStorage.setItem("topScreen", topScreen.innerText);
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
        // Update saved data
        localStorage.setItem("topScreen", topScreen.innerText);
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
