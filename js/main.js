// https://yarduon.com
import { addHours, isOperator } from "./utility.js";

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
    case "^":
      total = Math.pow(num1, num2);
      break;
    case "%":
      total = num1 / 100;
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

  if (!localStorage.getItem("power")) {
    localStorage.setItem("power", true);
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
});

document.getElementById("ms").addEventListener("click", () => {
  localStorage.setItem("memory", result.innerText);
});

document.getElementById("mc").addEventListener("click", () => {
  localStorage.removeItem("memory");
});

document.getElementById("ce").addEventListener("click", () => {
  result.innerText = 0;
});

console.log(localStorage.getItem("power"));

document.getElementById("power").addEventListener("click", () => {
  if (localStorage.getItem("power") === "true") {
    result.innerText = "";
    topScreen.innerText = "";
    document.getElementById("on").classList.remove("green");
    document.getElementById("on").classList.add("black");
    document.getElementById("off").classList.remove("black");
    document.getElementById("off").classList.add("red");
    document.getElementById("operations").classList.add("hidden");
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = true;
    });
    localStorage.setItem("power", false);
  } else {
    result.innerText = 0;
    document.getElementById("on").classList.add("green");
    document.getElementById("on").classList.remove("black");
    document.getElementById("off").classList.add("black");
    document.getElementById("off").classList.remove("red");
    document.getElementById("operations").classList.remove("hidden");
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = false;
    });
    localStorage.setItem("power", true);
  }
});
