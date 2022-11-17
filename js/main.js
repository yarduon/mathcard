// https://yarduon.com
import {
  addHours,
  isOperator,
  swapClasses,
  stringToBoolean,
  writeAndSave,
  countElements,
  isEqual,
  getCurrentSelectValue,
  cleanText,
  addClass,
  addClasses,
  removeClass,
  removeClasses,
  checkClasses,
} from "./utility.js";

// Need to import JSON as JS without backend
import customization from "../json/customization.js";
import currencies from "../json/currencies.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("topScreen"),
  result = document.getElementById("result"),
  operators = Array.from(document.getElementsByClassName("operator")),
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
  ],
  switchModes = document.getElementById("switch-mode"),
  currenciesSelect = [
    document.getElementById("firstCurrency"),
    document.getElementById("secondCurrency"),
  ],
  errorContainer = document.getElementById("error"),
  errorMessages = [document.getElementById("qr-not-found")],
  arrows = [
    document.getElementById("left-arrow-fonts"),
    document.getElementById("right-arrow-fonts"),
    document.getElementById("left-arrow-colors"),
    document.getElementById("right-arrow-colors"),
  ],
  fonts = Array.from(document.getElementsByClassName("font")).map((e) => e.id),
  customizationButtons = [
    document.getElementById("text"),
    document.getElementById("background"),
  ];

let usingFloat = false,
  usingCircumflex = false,
  totalOpenParenthesis = 0,
  slide = 0,
  currentColor = "",
  currentElement = "background";

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
      total = num1 ** num2;
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

function mathToOperations(array) {
  let firstPos = 0;
  // If there are parentheses in the operations
  if (countElements("(", array) === countElements(")", array)) {
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
  }

  // After cleaning parentheses calculate final operations
  symbols.forEach((e) => {
    findAndReplaceCalc(e, array);
  });

  return isFinite(array[0])
    ? Number.isInteger(array[0])
      ? array[0]
      : Math.round(array[0] * 10000000000) / 10000000000
    : "Syntax Error";
}

function findAndReplaceCalc(operator, array) {
  let pos = 0;
  // Find the specified operator until there are none left
  while (array.indexOf(operator, pos) != -1) {
    // Current location of operator
    pos = array.indexOf(operator, pos);
    // Replace operations by the result
    if (isOperator(operator)) {
      array.splice(
        pos - 1,
        (pos - 1 - (pos + 1)) * -1 + 1,
        operate(array[pos], array[pos - 1], array[pos + 1])
      );
    } else {
      array.splice(
        pos,
        (pos - 1 - (pos + 1)) * -1,
        operate(array[pos], array[pos - 1], array[pos + 1])
      );
    }
  }
  // Search for next same operator
  pos++;
}

function deleteNumber(lastDeleted) {
  switch (lastDeleted) {
    case ".":
      // Reset use of dots when deleting these
      usingFloat = false;
      break;
    case "^":
      // Reset use of circumflex when deleting these
      usingCircumflex = false;
      break;
    case ")":
      // Increments use of closed parenthesis when deleting these
      totalOpenParenthesis++;
      break;
    default:
      // Decrement use of closed parenthesis when deleting opened ones
      if (lastDeleted === "(" && totalOpenParenthesis >= 0)
        totalOpenParenthesis--;
  }

  // Create a copy of screen without last element
  writeAndSave(topScreen.id, topScreen.innerText.slice(0, -1), topScreen);

  // Calculate the result by deleting numbers and will be different in each mode
  stringToBoolean(localStorage.getItem("currencyMode"))
    ? // Calculate exchange currency
      writeAndSave(
        result.id,
        calculateExchange(
          currenciesSelect[0].selectedOptions[0].getAttribute("currency"),
          currenciesSelect[1].selectedOptions[0].getAttribute("currency"),
          topScreen.innerText,
          getCurrentSelectValue(currenciesSelect[1]).value
        ),
        result
      )
    : // Prevent NaN and calculate math operations
    isNaN(mathToOperations(mathToArray(topScreen.innerText)))
    ? writeAndSave(result.id, "", result)
    : writeAndSave(
        result.id,
        mathToOperations(mathToArray(topScreen.innerText)),
        result
      );
}

function fillEmptyOperation(operator, lastSelected) {
  // Convert screen to an array
  let screen = Array.from(topScreen.innerText);
  if ((isOperator(operator) && operator !== "(") || operator === "Dead") {
    // When there is only an operator without any numbers on the left
    if (lastSelected === "" || lastSelected === "(") {
      // Modify screen adding a zero in empty operations
      screen.splice(screen.length - 1, 0, "0");
      writeAndSave(topScreen.id, screen.join(""), topScreen);
    }
  }
}

function selectButton(name) {
  // Storage the last and next to last elements displaying on screen
  let lastSelected = topScreen.innerText.charAt(topScreen.innerText.length - 1),
    nextToLastSelected = topScreen.innerText.charAt(
      topScreen.innerText.length - 2
    );
  // Check value except when key is not assigned to any button
  if (buttons.includes(document.getElementById(name))) {
    // Buttons behaviour
    switch (name) {
      case "-":
        // Avoid three minus signs consecutively
        if (
          (nextToLastSelected === "" && lastSelected === "") ||
          (nextToLastSelected !== "-" && nextToLastSelected !== "") ||
          !isNaN(lastSelected)
        ) {
          writeAndSave(topScreen.id, name, topScreen, true);
        }
        break;
      // Character value and key are different
      case "Dead":
        if (!usingCircumflex) {
          writeAndSave(topScreen.id, "^", topScreen, true);
          // Avoid single operators without a number on the left
          fillEmptyOperation(name, lastSelected);
          usingCircumflex = true;
        }
        break;
      case "(":
        // When a previous element was a math operator, empty or circumflex
        if (
          operators.includes(document.getElementById(lastSelected)) ||
          isEqual(lastSelected, "", "^", "(")
        ) {
          writeAndSave(topScreen.id, name, topScreen, true);
          totalOpenParenthesis++;
        }
        break;
      case ")":
        // Avoid writing closed parenthesis without opening previously opening ones
        if (totalOpenParenthesis >= 1) {
          writeAndSave(topScreen.id, name, topScreen, true);
          totalOpenParenthesis--;
          // Avoid single operators without a number on the left
          fillEmptyOperation(name, lastSelected);
        }
        break;
      case ".":
        if (!usingFloat) {
          writeAndSave(topScreen.id, name, topScreen, true);
          usingFloat = true;
        }
        break;
      case "Backspace":
        deleteNumber(lastSelected);
        break;
      case "=":
        // Calculate the result according to selected mode
        stringToBoolean(localStorage.getItem("currencyMode"))
          ? writeAndSave(
              result.id,
              calculateExchange(
                currenciesSelect[0].selectedOptions[0].getAttribute("currency"),
                currenciesSelect[1].selectedOptions[0].getAttribute("currency"),
                topScreen.innerText,
                getCurrentSelectValue(currenciesSelect[1]).value
              ),
              result
            )
          : writeAndSave(
              result.id,
              mathToOperations(mathToArray(topScreen.innerText)),
              result
            );
        break;
      // Remaining buttons
      default:
        // When the value is a operator
        if (isOperator(name)) {
          // When the last value is not an operator or circumflex
          if (!operators.includes(document.getElementById(lastSelected))) {
            writeAndSave(topScreen.id, name, topScreen, true);
            usingCircumflex = false;

            // Avoid single operators without a number on the left
            fillEmptyOperation(name, lastSelected);

            // Reset uses of dots
            usingFloat = false;
          }
          // When the value is a number
        } else if (!isNaN(name)) {
          // When this number is different to zero or equal to dot
          if (lastSelected !== "0" || nextToLastSelected === ".") {
            writeAndSave(topScreen.id, name, topScreen, true);
          }
          // When the value is a special function or value
        } else if (
          isEqual(name, "LOG(", "SIN(", "COS(", "TAN(", "PI", "SQR(")
        ) {
          // Avoid numbers next to functions without operators or repeated PI
          if (
            (isNaN(lastSelected) && lastSelected !== "I") ||
            lastSelected === ""
          ) {
            writeAndSave(topScreen.id, name, topScreen, true);
            totalOpenParenthesis++;
          }
        } else {
          writeAndSave(topScreen.id, name, topScreen, true);
        }
    }
    // Highlight button
    document.getElementById(name).focus();
  }
}

// Turn on and turn off
function powerOnOff(event) {
  // Change status when button is pressed or clicked and edit mode is deactivated
  if (event && localStorage.getItem("editMode") === "false") {
    let status = stringToBoolean(localStorage.getItem("power"));
    localStorage.setItem("power", !status);
  }

  if (localStorage.getItem("power") === "true") {
    // Only when button is pressed or clicked
    if (event) {
      // Fill and show data values
      writeAndSave(result.id, 0, result);
      document.getElementById("topScreen").classList.remove("invisible");
    }

    // Activate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = false;
    });

    // Change power status buttons colors
    swapClasses(
      document.getElementById("on"),
      "light-green-background",
      "normal-black-background"
    );
    swapClasses(
      document.getElementById("off"),
      "normal-black-background",
      "full-red-background"
    );
  } else {
    // Empty and hide data values
    writeAndSave(topScreen.id, "", topScreen);
    writeAndSave(result.id, "", result);
    document.getElementById("topScreen").classList.add("invisible");

    // Deactivate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = true;
    });

    // Change power status buttons colors
    swapClasses(
      document.getElementById("on"),
      "normal-black-background",
      "light-green-background"
    );
    swapClasses(
      document.getElementById("off"),
      "full-red-background",
      "normal-black-background"
    );
  }
  return stringToBoolean(localStorage.getItem("power"));
}

async function updateRates(json, currentDate) {
  // Obtain current conversion rates
  const response = await fetch(json),
    data = await response.json();
  // Convert rates to local data
  localStorage.setItem("exchangeRates", JSON.stringify(data));
  // Rates won't be updated until next 24 hours
  localStorage.setItem("updateTime", addHours(currentDate, 24));
}

// Fill select input by using JSON and external API
function fillSelect(json, values, select, symbol) {
  // Previous selected element on second select
  let previousSelected = getCurrentSelectValue(currenciesSelect[1]);

  // Reset previously saved values
  select.innerText = "";

  Object.keys(json).forEach((e) => {
    // Only when the value is different from the first select or second select is empty
    if (select.id === "firstCurrency" || currenciesSelect[0].value != e) {
      // Create option
      let option = document.createElement("option");
      option.innerText = e + symbol + json[e];
      option.value = e;
      option.setAttribute("currency", values.rates[e]);
      select.append(option);
    }
  });

  // Avoid null values when second select is empty
  if (previousSelected) {
    // Select first option when is equal to the value of first select
    currenciesSelect[0].value === previousSelected.value
      ? (currenciesSelect[1].value = currenciesSelect[1].options[0].value)
      : // Re-select previous option
        (currenciesSelect[1].value = previousSelected.value);
  }
}

// Convert one currency into another rounded two decimals
function calculateExchange(n1, n2, quantity, currencyName) {
  return (
    Math.round(((quantity / n1) * n2 + Number.EPSILON) * 100) / 100 +
    " " +
    currencyName
  );
}

function checkCameras() {
  // Check if there are cameras available but before activate icon
  removeClasses(document.getElementById("camera"), "disabled");
  // Request camera permissions from users
  Html5Qrcode.getCameras().catch(() => {
    // Deactivate camera icon
    addClasses(document.getElementById("camera"), "disabled");
  });
}

function closeWindowQR(parentWindow) {
  // Identify which window closes
  parentWindow.classList.add("hidden");
  // Reset options view
  hideShowOptionsQR(false, false);
  document.getElementById("qr-result-container").classList.add("hidden");
}

function hideShowOptionsQR(isCamera, hidden) {
  // Show camera
  if (isCamera) removeClass("hidden", document.getElementById("reader"));

  // Hide or show options of QR reader
  hidden
    ? addClass(
        "hidden",
        document.getElementById("camera"),
        document.getElementById("folder")
      )
    : removeClass(
        "hidden",
        document.getElementById("camera"),
        document.getElementById("folder")
      );
}

async function showError(error) {
  // Get name of error
  let errorName = String(error).substring(0, String(error).indexOf(":"));
  // Fill error message
  switch (errorName) {
    case "N":
      errorContainer.innerText = errorMessages[0].innerText.trim();
      break;
  }
  // Show error message
  document.getElementById("error").style.left = 0;
  // Wait four seconds before disappearing error
  await new Promise((res) => setTimeout(res, 4000));
  // Hide error
  document.getElementById("error").style.left = "-100%";
}

function stateResultQR(result, scanner, isCamera) {
  // Hide QR reader options
  hideShowOptionsQR(isCamera, true);

  // Fill and show result with generated link
  document.getElementById("qr-result").innerHTML = result;
  document.getElementById("qr-result").href = result;
  removeClass("hidden", document.getElementById("qr-result-container"));

  // Hide camera
  if (isCamera) {
    addClass("hidden", document.getElementById("reader"));
    scanner.stop();
  }
}

function readFileQR() {
  const html5QrCode = new Html5Qrcode("reader");
  // Allow to re-scan even if the input is the same
  document.getElementById("qr-input-file").value = "";
  // The scan will start when the file in the input changes
  document.getElementById("qr-input-file").addEventListener("change", (e) => {
    // Find a QR in the selected file
    html5QrCode
      .scanFile(e.target.files[0], true)
      // If a QR code is found
      .then((decodedText) => {
        stateResultQR(decodedText, html5QrCode, false);
      })
      .catch((err) => {
        showError(err);
      });
  });
}

function useCameraQR() {
  // Set the current camera to avoid multiple cameras at once
  addClass("activated", document.getElementById("camera"));
  // Reset reader
  document.getElementById("reader").innerHTML = "";
  // Hide options of QR reader
  hideShowOptionsQR(true, true);
  // Show loading icon
  removeClass("hidden", document.getElementById("loading"));
  Html5Qrcode.getCameras()
    .then((devices) => {
      if (devices && devices.length) {
        const html5QrCode = new Html5Qrcode("reader"),
          config = { fps: 20, qrbox: { width: 150, height: 150 } },
          // Callback if QR is detected
          qrCodeSuccessCallback = (decodedText) => {
            stateResultQR(decodedText, html5QrCode, true);
          };
        // Start scanning
        html5QrCode.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback
        );

        // Allow user to stop scanning and exit QR menu
        document.getElementById("cross").addEventListener("click", () => {
          // Go back to the options menu
          closeWindowQR(document.getElementById("reader"));
          // Hide loading icon
          addClass("hidden", document.getElementById("loading"));
          // Stop and reset camera
          removeClass("activated", document.getElementById("camera"));
          html5QrCode.stop();
        });
      }
    })
    .catch(async (err) => {
      showError(err);
    });
}

function editMode(event) {
  // Change status when button is pressed or clicked
  if (event) {
    let status = stringToBoolean(localStorage.getItem("editMode"));
    localStorage.setItem("editMode", !status);
  }

  if (localStorage.getItem("editMode") === "true") {
    // Show customizations panels on top and bottom
    Array.from(document.getElementsByClassName("customization")).forEach(
      (e) => {
        e.classList.remove("hidden");
      }
    );

    // Deactivate currencies selectors
    currenciesSelect.forEach((e) => {
      e.disabled = true;
    });

    // Deactive switch mode
    document.getElementById("switch-mode").disabled = true;

    // Change the selected current color
    Array.from(document.getElementsByClassName("color")).forEach((e) => {
      e.addEventListener("click", () => {
        currentColor = e.id;
      });
    });

    // Modify button background and text color
    Object.keys(customization).forEach((e) => {
      document.getElementById(e).addEventListener("click", (event) => {
        // Prevent parent elements to trigger
        event.stopPropagation();
        // Remove previous classes according to currently selected element
        if (currentColor != "") {
          removeClasses(document.getElementById(e), currentElement);
          addClass(
            currentColor + "-" + currentElement,
            document.getElementById(e)
          );
        }
      });
    });

    // Modify current font
    Array.from(document.getElementsByClassName("font")).forEach((e) => {
      e.addEventListener("click", () => {
        removeClasses(document.getElementById("font"), ...fonts);
        addClass(e.id, document.getElementById("font"));
      });
    });
  } else {
    // Hide customizations panels on top and bottom
    Array.from(document.getElementsByClassName("customization")).forEach(
      (e) => {
        e.classList.add("hidden");
      }
    );

    // Activate switch mode
    document.getElementById("switch-mode").disabled = false;
  }
}

function useSlider(currentPosition, isRight) {
  // Convert received value to a number
  currentPosition = parseInt(currentPosition);

  // Set current position to zero
  if (isNaN(currentPosition)) currentPosition = 0;

  if (isRight) {
    // Move to the right until value is of upper max value
    if (currentPosition < 380) {
      document.getElementById("font-families").style.right =
        ++currentPosition + "vh";
    }
  } else {
    // Move to the left until value is of below zero
    if (currentPosition > 0) {
      document.getElementById("font-families").style.right =
        --currentPosition + "vh";
    }
  }
}

// When the page is refreshed or loaded for the first time
window.onload = async () => {
  // Load default values when the cache is deleted or first time
  if (!localStorage.getItem("power")) localStorage.setItem("power", true);
  if (!localStorage.getItem("memory")) localStorage.setItem("memory", 0);
  if (!localStorage.getItem("currencyMode")) {
    localStorage.setItem("currencyMode", false);
  }
  if (!localStorage.getItem("editMode")) {
    localStorage.setItem("editMode", false);
  }

  // Power on or off light of calculator according to previous actions
  if (powerOnOff()) {
    topScreen.innerText = localStorage.getItem("topScreen");
    result.innerText = localStorage.getItem("result");
  }

  // Check if there are cameras available
  checkCameras();

  // Update rates each 24h or when it's the first time
  if (
    !localStorage.getItem("updateTime") ||
    new Date() >= new Date(localStorage.getItem("updateTime"))
  ) {
    // Wait until all currency data is loaded on app
    await updateRates(
      "https://api.exchangerate-api.com/v4/latest/euro",
      new Date()
    );
  }

  // Fill both selects when refresh or load page
  for (let i = 0; i < 2; i++) {
    fillSelect(
      currencies,
      JSON.parse(localStorage.getItem("exchangeRates")),
      currenciesSelect[i],
      " - "
    );
  }

  // Select previous currencies
  if (localStorage.getItem("firstCurrency")) {
    currenciesSelect[0].value = localStorage.getItem("firstCurrency");
    currenciesSelect[1].value = localStorage.getItem("secondCurrency");
  }

  // Show currencies panel if was previously selected
  switchModes.checked = stringToBoolean(localStorage.getItem("currencyMode"));
  // Activate edit mode if was previously used
  if (stringToBoolean(localStorage.getItem("editMode"))) editMode();
};

// Detect pressed buttons
buttons.forEach((e) => {
  e.addEventListener("click", () => {
    // Prevent normal button behaviour when edit mode is active
    if (localStorage.getItem("editMode") === "false") {
      selectButton(e.id);
    }
  });
});

// Detect typed buttons
window.addEventListener("keydown", (e) => {
  // Prevent unassigned keys
  if (document.getElementById(e.key)) {
    // Prevent functions, operators, and parenthesis behaviour when currency mode is active
    if (
      (!String(document.getElementById(e.key).classList).includes(
        "hidden-currency"
      ) ||
        localStorage.getItem("currencyMode") === "false") &&
      document.getElementById(e.key)
    ) {
      selectButton(e.key);
    }
  }
});

document.getElementById("power").addEventListener("click", (e) => {
  // Turn on and turn off
  powerOnOff(e);
});

// Delete all operations
document.getElementById("ac").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    writeAndSave(topScreen.id, "", topScreen);
    writeAndSave(result.id, 0, result);
  }
});

// Add current result with stored result
document.getElementById("m+").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.setItem(
      "memory",
      +localStorage.getItem("memory") + +result.innerText
    );
  }
});

// Subtract current result with stored result
document.getElementById("m-").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.setItem(
      "memory",
      +localStorage.getItem("memory") - +result.innerText
    );
  }
});

// Use stored result as an operation value
document.getElementById("mr").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    topScreen.innerText += localStorage.getItem("memory");
    localStorage.setItem("topScreen", topScreen.innerText);
  }
});

// Save current result
document.getElementById("ms").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    // Prevent currency names to be stored
    isNaN(localStorage.getItem("memory"))
      ? localStorage.setItem("memory", cleanText(result.innerText))
      : localStorage.setItem("memory", result.innerText);
  }
});

// Delete stored result
document.getElementById("mc").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.removeItem("memory");
  }
});

// Delete current result
document.getElementById("ce").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    writeAndSave(result.id, 0, result);
  }
});

// Fill second select when editing the options on the first
currenciesSelect.forEach((e, i) => {
  e.addEventListener("change", () => {
    if (i === 0) {
      fillSelect(
        currencies,
        JSON.parse(localStorage.getItem("exchangeRates")),
        currenciesSelect[1],
        " - "
      );
    }
    // Save on local data selected currencies on both selects
    localStorage.setItem(e.id, e.value);
  });
});

// Save on local data current mode status
switchModes.addEventListener("click", () => {
  switchModes.checked
    ? localStorage.setItem("currencyMode", true)
    : localStorage.setItem("currencyMode", false);
  // Reset values
  writeAndSave(result.id, "0", result);
  writeAndSave(topScreen.id, "", topScreen);
});

// Show QR panel and check if there are cameras available
document.getElementById("qr").addEventListener("click", () => {
  if (localStorage.getItem("editMode") === "false") {
    removeClasses(document.getElementById("qr-menu"), "hidden");
    checkCameras();
  }
});

// Hide QR panel
document.getElementById("cross").addEventListener("click", () => {
  closeWindowQR(document.getElementById("qr-menu"));
});

document.getElementById("camera").addEventListener("click", () => {
  // Only when a camera is available and there is only one activated
  if (
    !checkClasses(document.getElementById("camera"), "disabled", "activated")
  ) {
    useCameraQR();
  }
});

// Copy the generated link to clipboard
document.getElementById("clipboard").addEventListener("click", () => {
  navigator.clipboard.writeText(document.getElementById("qr-result").href);
});

// Go the generated link
document.getElementById("link").addEventListener("click", () => {
  document.getElementById("qr-result").click();
});

// Swap original input reader to personalized icon
document.getElementById("folder").addEventListener("click", () => {
  // Use input with personalized button
  document.getElementById("qr-input-file").click();
  readFileQR();
});

// Open edit mode
document.getElementById("edit").addEventListener("click", (e) => {
  // Prevent to close edit mode when changing edit button
  if (localStorage.getItem("editMode") === "false") {
    editMode(e);
  }
});

// Change the selected item type into edit mode
Array.from(customizationButtons).forEach((e) => {
  e.addEventListener("click", () => {
    currentElement = e.id;
  });
});

// Start slider when mouse is pressed
arrows.forEach((e, i) => {
  e.addEventListener("mousedown", () => {
    slide = setInterval(() => {
      useSlider(
        cleanText(document.getElementById("font-families").style.right),
        e.id.includes("right")
      );
    }, 100);
  });
});

// Stop slider when mouse is not pressed
arrows.forEach((e) => {
  e.addEventListener("mouseup", () => {
    clearInterval(slide);
  });
});
