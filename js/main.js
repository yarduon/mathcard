// https://yarduon.com
import QrScanner from "./qr-scanner.min.js";
import {
  increment,
  decrement,
  addHours,
  isOperator,
  stringToBoolean,
  writeAndSave,
  countElements,
  isEqual,
  getCurrentSelectValue,
  cleanText,
  changeFont,
  changeElement,
  addClass,
  addClasses,
  removeClass,
  removeClasses,
  checkClasses,
  removeElements,
  getJSON,
  updateJSON,
  validateJSON,
  downloadFile,
  swapClasses,
} from "./utility.js";

// Need to import JSON as JS without backend
import settings from "../json/settings.js";
import currencies from "../json/currencies.js";
import languages from "../json/languages.js";

// Register the service worker
/* if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
} */

// Update only when new version is finished
const currentVersion = 1.1;

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("topScreen"),
  fakeTopScreen = document.getElementById("fakeTopScreen"),
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
  errorMessages = [
    document.getElementById("qr-not-found"),
    document.getElementById("invalid-file"),
  ],
  fonts = Array.from(document.getElementsByClassName("font")).map((e) => e.id),
  customizationContainers = [
    document.getElementById("font-families"),
    document.getElementById("palette"),
  ],
  customizationButtons = [
    document.getElementById("icon"),
    document.getElementById("background"),
    document.getElementById("shadow"),
  ],
  confirmButtons = [
    document.getElementById("confirm"),
    document.getElementById("reject"),
  ],
  backgroundOptions = [
    document.getElementById("original"),
    document.getElementById("original-reverse"),
    document.getElementById("split"),
    document.getElementById("split-reverse"),
  ];

let totalResult = 0;

// Translate all items with the class translate
function translatePage(items) {
  // Check user navigator language
  let navigatorLanguage = navigator.language || navigator.userLanguage;
  // Change text of application if language is registered
  for (let p in languages) {
    // We only use the first letters to match variants
    if (navigatorLanguage.includes(p)) {
      // Change language on html tag
      document.getElementById("language").lang = p;
      // Fill texts with detected language
      items.forEach((e, i) => {
        if (e.nodeName === "INPUT") {
          e.value = languages[p][i];
        } else {
          e.innerText = languages[p][i];
        }
      });
    }
  }
}

function loadSettings(settingsFile) {
  // Get all buttons and elements
  let buttons = settingsFile["buttons"],
    elements = settingsFile["general"];
  // Set all buttons
  Object.keys(buttons).forEach((e) => {
    customizationButtons.forEach((b) => {
      // Avoid null values
      if (buttons[e][b.id]) {
        // Refresh saved color button
        addClass(buttons[e][b.id], document.getElementById(e));
      }
    });
  });

  // Set background
  changeBackground(elements.background);

  // Set font
  changeFont(document.getElementById("font"), elements.font, fonts);

  // Highlight text and color
  Object.keys(elements).forEach((e) => {
    addClass("selected-" + e, document.getElementById(elements[e]));
  });

  // Refresh element
  changeElement(
    ...document.getElementsByClassName("selected-element"),
    ...document.getElementsByClassName("selected-color")
  );
}

function operate(operator1, operator2, num0, num1, num2) {
  let total = 0;
  switch (operator1) {
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
      total = num1 ** num2;
      break;
    case "%":
      switch (operator2) {
        // Calculate simplified percentage
        case "+":
          total = +num0 + +num0 * (+num1 / 100);
          break;
        case "-":
          total = +num0 - +num0 * (+num1 / 100);
          break;
        default:
          // Calculate percentage or remainder
          !isOperator(num2) && String(num2) != "undefined"
            ? (total = +num1 % +num2)
            : (total = +num1 / 100);
      }
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
    // Accumulate characters when there aren't operators and detect negative numbers
    if (
      !isOperator(e) ||
      (e === "-" && !isNaN(string[i + 1]) && isNaN(string[i - 1]))
    ) {
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
  let firstPos;
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
      // Select current parenthesis
      totalResult = array.slice(firstPos + 1, array.indexOf(")", firstPos));
      // Resolve operations inside that pair of parentheses
      symbols.forEach((e) => {
        // Receives a copy of vector
        findAndReplaceCalc(e, totalResult);
      });

      // Replace the parentheses with the final result
      array.splice(
        firstPos,
        (firstPos - array.indexOf(")", firstPos)) * -1 + 1,
        totalResult
      );
    }
  }

  // After cleaning parentheses calculate final operations
  symbols.forEach((e) => {
    // Receives original vector
    findAndReplaceCalc(e, array);
  });

  return isFinite(array[0])
    ? Number.isInteger(array[0])
      ? array[0]
      : Math.round(array[0] * 10000000000) / 10000000000
    : "Math error";
}

function findAndReplaceCalc(operator, array) {
  let pos = array.indexOf(operator, 0),
    hasOperator = false,
    lastOperator = "",
    initialValue = 0,
    finalValue = 0;

  // Find the specified operator until there are none left
  while (array.indexOf(operator, pos) !== -1) {
    // Tag the operator as found
    hasOperator = true;
    // Current location of operator
    pos = array.indexOf(operator, pos);
    // Get previous operator
    lastOperator = array[pos - 2];
    // Define split values
    if (!isOperator(operator)) {
      // PI and functions
      initialValue = pos;
      finalValue = pos + 2;
    } else {
      // Allow simplified percentage operations
      (operator === "%" && lastOperator === "+") || lastOperator === "-"
        ? (initialValue = pos - 3)
        : // The operator has numbers between the two sides
          (initialValue = pos - 1);

      finalValue = (pos - 1 - (pos + 1)) * -1 + 1;
    }
    // Replace operations by the result
    array.splice(
      initialValue,
      finalValue,
      operate(
        array[pos],
        lastOperator,
        array[pos - 3],
        array[pos - 1],
        array[pos + 1]
      )
    );
  }

  // Provide the result if a single value remains or if an specified operator exists
  if (hasOperator || (!isNaN(+array[0]) && array.length === 1)) {
    totalResult = array;
  }
}

function deleteNumber(lastDeleted) {
  switch (lastDeleted) {
    case ".":
      // Reset use of dots when deleting these
      localStorage.setItem("usingFloat", false);
      break;
    case "^":
      // Reset use of circumflex when deleting these
      localStorage.setItem("usingCircumflex", false);
      break;
    case ")":
      // Increments use of closed parenthesis when deleting these
      localStorage.setItem(
        "totalOpenParenthesis",
        increment(localStorage.getItem("totalOpenParenthesis"))
      );
      break;
    default:
      // Decrement use of closed parenthesis when deleting opened ones
      if (
        lastDeleted === "(" &&
        Number(localStorage.getItem("totalOpenParenthesis")) >= 0
      )
        localStorage.setItem(
          "totalOpenParenthesis",
          decrement(localStorage.getItem("totalOpenParenthesis"))
        );
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
    ? writeAndSave(result.id, "0", result)
    : writeAndSave(
        result.id,
        mathToOperations(mathToArray(topScreen.innerText)),
        result
      );
}

function formatOperations(fakeScreen, originalScreen) {
  let screenSize = originalScreen.innerText.length,
    maxSize = originalScreen.innerText.length - 16;

  // Get content from main screen
  fakeScreen.innerText = localStorage.getItem(originalScreen.id);

  // Display only the number of values specified on the display
  if (screenSize >= 16) {
    fakeScreen.innerText = originalScreen.innerText.substring(
      maxSize,
      screenSize
    );
  }
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
        // Avoid three minus signs consecutively and two in some cases
        if (
          (nextToLastSelected === "" && lastSelected === "") ||
          (nextToLastSelected !== "-" &&
            nextToLastSelected !== "" &&
            nextToLastSelected !== "(" &&
            nextToLastSelected !== "." &&
            lastSelected !== "." &&
            !isNaN(nextToLastSelected)) ||
          lastSelected === "(" ||
          !isNaN(lastSelected)
        ) {
          writeAndSave(topScreen.id, name, topScreen, true);

          // Reset uses of dots
          localStorage.setItem("usingFloat", false);
        }
        break;
      // Character value and key are different
      case "Dead":
        if (
          // Avoid multiple circumflexes and next to other operators except closed parentheses
          (localStorage.getItem("usingCircumflex") === "false" &&
            !isNaN(lastSelected)) ||
          lastSelected === ")" ||
          lastSelected === ""
        ) {
          writeAndSave(topScreen.id, "^", topScreen, true);
          // Avoid single operators without a number on the left
          fillEmptyOperation(name, lastSelected);
          localStorage.setItem("usingCircumflex", true);
        }
        break;
      case "(":
        // When a previous element was a math operator, empty or circumflex
        if (
          operators.includes(document.getElementById(lastSelected)) ||
          isEqual(lastSelected, "", "^", "(")
        ) {
          writeAndSave(topScreen.id, name, topScreen, true);
          localStorage.setItem(
            "totalOpenParenthesis",
            increment(localStorage.getItem("totalOpenParenthesis"))
          );
        }
        break;
      case ")":
        // Avoid writing closed parenthesis without opening previously opening ones
        if (Number(localStorage.getItem("totalOpenParenthesis")) >= 1) {
          writeAndSave(topScreen.id, name, topScreen, true);
          localStorage.setItem(
            "totalOpenParenthesis",
            decrement(localStorage.getItem("totalOpenParenthesis"))
          );
          // Avoid single operators without a number on the left
          fillEmptyOperation(name, lastSelected);
        }
        break;
      case ".":
        if (localStorage.getItem("usingFloat") === "false") {
          writeAndSave(topScreen.id, name, topScreen, true);
          localStorage.setItem("usingFloat", true);
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
      case "0":
        writeAndSave(topScreen.id, name, topScreen, true);
        break;
      // Remaining buttons
      default:
        // When the value is a operator
        if (isOperator(name)) {
          // When the last value is not an operator or circumflex
          if (!operators.includes(document.getElementById(lastSelected))) {
            writeAndSave(topScreen.id, name, topScreen, true);
            localStorage.setItem("usingCircumflex", false);

            // Avoid single operators without a number on the left
            fillEmptyOperation(name, lastSelected);

            // Reset uses of dots
            localStorage.setItem("usingFloat", false);
          }
          // When the value is a number
        } else if (!isNaN(name)) {
          // Prevent numbers next to PI without operators
          if (lastSelected !== "I") {
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
            localStorage.setItem(
              "totalOpenParenthesis",
              increment(localStorage.getItem("totalOpenParenthesis"))
            );
          }
        } else {
          writeAndSave(topScreen.id, name, topScreen, true);
        }
    }

    // Avoid cut numbers on screen
    formatOperations(fakeTopScreen, topScreen);

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
      writeAndSave(result.id, "0", result);
      removeClass("invisible", topScreen, fakeTopScreen);
    }
    // Activate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = false;
    });

    // Change power status buttons colors
    removeClass("hidden", document.getElementById("on-light"));
    addClass("hidden", document.getElementById("off-light"));
  } else {
    // Empty and hide data values
    fakeTopScreen.innerText = "";
    writeAndSave(topScreen.id, "", topScreen);
    writeAndSave(result.id, "", result);
    addClass("invisible", topScreen, fakeTopScreen);

    // Deactivate all buttons
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = true;
    });

    // Change power status buttons colors
    removeClass("hidden", document.getElementById("off-light"));
    addClass("hidden", document.getElementById("on-light"));
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
  let previousSelected = getCurrentSelectValue(currenciesSelect[1]),
    currentLanguageSelect = json[document.getElementById("language").lang];

  // Reset previously saved values
  select.innerText = "";

  Object.keys(currentLanguageSelect).forEach((e) => {
    // Only when the value is different from the first select or second select is empty
    if (select.id === "firstCurrency" || currenciesSelect[0].value != e) {
      // Create option
      let option = document.createElement("option");
      option.innerText = e + symbol + currentLanguageSelect[e];
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

async function checkCameras() {
  try {
    if (
      // Request camera permissions from users and verify if there is one available
      (await QrScanner.listCameras(true)).length >= 1 &&
      (await navigator.mediaDevices.getUserMedia({
        video: {
          // Set environment camera by default
          facingMode: "environment",
          // Set display resolution
          width: 1920,
          height: 1080,
        },
      }))
    ) {
      removeClasses(document.getElementById("camera"), "disabled");
    } else {
      addClasses(document.getElementById("camera"), "disabled");
    }
  } catch (e) {
    addClasses(document.getElementById("camera"), "disabled");
  }
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
  if (isCamera)
    removeClass(
      "hidden",
      document.getElementById("reader"),
      document.getElementById("loading")
    );

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

async function showError(errorNumber) {
  // Fill error message
  errorContainer.innerText = errorMessages[errorNumber].innerText.trim();

  // Show error message
  document.getElementById("error").style.left = 0;
  // Wait four seconds before disappearing error
  await new Promise((res) => setTimeout(res, 6000));
  // Hide error
  document.getElementById("error").style.left = "-100%";
}

function stateResultQR(result, scanner) {
  // Hide QR reader options
  hideShowOptionsQR(scanner, true);

  // Fill and show result with generated link
  document.getElementById("qr-result").innerHTML = result;
  document.getElementById("qr-result").href = result;
  removeClass("hidden", document.getElementById("qr-result-container"));

  // Hide camera
  if (scanner) {
    addClass(
      "hidden",
      document.getElementById("reader"),
      document.getElementById("loading")
    );
    scanner.stop();
    scanner.destroy();
  }
}

function readFileQR() {
  // Allow to re-scan even if the input is the same
  document.getElementById("qr-input-file").value = "";
  // The scan will start when the input value changes
  document.getElementById("qr-input-file").addEventListener("change", (e) => {
    // Find a QR in the selected file
    QrScanner.scanImage(e.target.files[0])
      .then((decodedText) => stateResultQR(decodedText))
      .catch(() => showError(0));
  });
}

function useCameraQR() {
  // Set the current camera to avoid multiple cameras at once
  addClass("activated", document.getElementById("camera"));
  // Hide options of QR reader
  hideShowOptionsQR(true, true);
  // Show loading icon
  removeClass("hidden", document.getElementById("loading"));

  // Create scanner
  const qrScanner = new QrScanner(
    document.getElementById("reader"),
    (result) => {
      // Display content and avoid scanner to disconnect
      if (result.data !== "") stateResultQR(result.data, qrScanner);
    },
    {
      highlightScanRegion: true,
    }
  );

  // Only activate the camera if it is available
  qrScanner
    .start()
    .then(() => {
      QrScanner.listCameras(true);
    })
    .catch(() => qrScanner.destroy())
    .finally(() => {
      // Enhance the scanning area by adding shadows
      addClass(
        "shadow-area",
        ...Array.from(document.getElementsByClassName("scan-region-highlight"))
      );
    });

  // Allow user to stop scanning and exit QR menu
  document.getElementById("close-qr").addEventListener("click", () => {
    // Go back to the options menu
    closeWindowQR(document.getElementById("reader"));
    // Hide loading icon
    addClass("hidden", document.getElementById("loading"));
    // Stop and reset camera
    removeClass("activated", document.getElementById("camera"));
    qrScanner.stop();
    qrScanner.destroy();
    // Delete scanning area
    removeElements(
      ...Array.from(document.getElementsByClassName("scan-region-highlight"))
    );
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

    // Allow change buttons when the calculator is off
    Array.from(document.getElementsByClassName("button")).forEach((e) => {
      e.disabled = false;
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
  return stringToBoolean(localStorage.getItem("editMode"));
}

function changeBackground(backgroundName) {
  switch (backgroundName) {
    case "original-reverse":
      addClass("rotate", document.getElementById("background-calc"));
      break;
    case "split":
      for (let i = 1; i <= 2; i++) {
        removeClasses(
          document.getElementById("square" + i),
          "absolute",
          "square" + i
        );
        addClass("half-width", document.getElementById("square" + i));
        addClass("hidden", document.getElementById("extra-bg" + i));
      }
      break;
    case "split-reverse":
      for (let i = 1; i <= 2; i++) {
        removeClasses(
          document.getElementById("square" + i),
          "absolute",
          "square" + i
        );
        addClass("max-width", document.getElementById("square" + i));
        addClass("hidden", document.getElementById("extra-bg" + i));
      }
      addClass("column", document.getElementById("background-calc"));
      break;
  }
}

// When the page is refreshed or loaded for the first time
window.onload = async () => {
  // Only if load is first time
  if (!sessionStorage.getItem("refresh")) {
    // Reset local data when update is up
    if (Number(localStorage.getItem("currentVersion")) < currentVersion) {
      localStorage.setItem("currentVersion", currentVersion);
      localStorage.clear();
    }
    sessionStorage.setItem("refresh", true);
  }
  // Prevent old local data to appear and save new version to future refresh
  if (!localStorage.getItem("currentVersion")) {
    localStorage.clear();
    localStorage.setItem("currentVersion", currentVersion);
  }

  // Load default values when the cache is deleted or first time
  if (!localStorage.getItem("topScreen")) localStorage.setItem("topScreen", "");
  if (!localStorage.getItem("result")) localStorage.setItem("result", 0);
  if (!localStorage.getItem("usingFloat")) {
    localStorage.setItem("usingFloat", false);
  }
  if (!localStorage.getItem("usingCircumflex")) {
    localStorage.setItem("usingCircumflex", false);
  }
  if (!localStorage.getItem("totalOpenParenthesis")) {
    localStorage.setItem("totalOpenParenthesis", 0);
  }
  if (!localStorage.getItem("power")) localStorage.setItem("power", true);
  if (!localStorage.getItem("memory")) localStorage.setItem("memory", 0);
  if (!localStorage.getItem("currencyMode")) {
    localStorage.setItem("currencyMode", false);
  }
  if (!localStorage.getItem("editMode")) {
    localStorage.setItem("editMode", false);
  }
  if (!localStorage.getItem("position-font-families")) {
    localStorage.setItem("position-font-families", 0);
  }
  if (!localStorage.getItem("position-palette")) {
    localStorage.setItem("position-palette", 0);
  }
  // Set default appearances to calculator
  if (!localStorage.getItem("settings")) {
    localStorage.setItem("settings", JSON.stringify(settings));
    localStorage.setItem("templateLayout", JSON.stringify(settings));
  }

  // Translate all texts
  translatePage(Array.from(document.getElementsByClassName("translate")));

  // Activate or deactivate edit mode and change settings layout
  editMode()
    ? loadSettings(JSON.parse(localStorage.getItem("templateLayout")))
    : loadSettings(JSON.parse(localStorage.getItem("settings")));

  // Set previous position in panels of edit mode
  customizationContainers.forEach((e) => {
    e.style.right = localStorage.getItem("position-" + e.id) + "vh";
  });

  // Power on or off light of calculator according to previous actions
  if (powerOnOff()) {
    topScreen.innerText = localStorage.getItem("topScreen");
    result.innerText = localStorage.getItem("result");
  }

  // Avoid cut numbers on screen
  formatOperations(fakeTopScreen, topScreen);

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

  // Hide initial screen
  addClass("hidden", document.getElementById("initial-screen"));
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
    // Avoid opening the search in Firefox
    if (e.key === "/") e.preventDefault();

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
    // Reset control values
    localStorage.setItem("usingFloat", false);
    localStorage.setItem("usingCircumflex", false);
    localStorage.setItem("usingOperator", false);
    localStorage.setItem("totalOpenParenthesis", 0);
    // Reset screen
    fakeTopScreen.innerText = "";
    writeAndSave(topScreen.id, "", topScreen);
    writeAndSave(result.id, "0", result);
  }
});

// Add current result with stored result
document.getElementById("m+").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.setItem(
      "memory",
      +localStorage.getItem("memory") + +cleanText(result.innerText)
    );
  }
});

// Subtract current result with stored result
document.getElementById("m-").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.setItem(
      "memory",
      +localStorage.getItem("memory") - +cleanText(result.innerText)
    );
  }
});

// Use stored result as an operation value
document.getElementById("mr").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    topScreen.innerText += cleanText(localStorage.getItem("memory"));
    localStorage.setItem("topScreen", topScreen.innerText);
    formatOperations(fakeTopScreen, topScreen);
  }
});

// Save current result
document.getElementById("ms").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    // Prevent currency names to be stored
    localStorage.setItem("memory", cleanText(result.innerText));
  }
});

// Delete stored result
document.getElementById("mc").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    localStorage.setItem("memory", "");
  }
});

// Delete current result
document.getElementById("ce").addEventListener("click", () => {
  // Prevent default button behaviour when edit mode is activated
  if (localStorage.getItem("editMode") === "false") {
    writeAndSave(result.id, "0", result);
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
  fakeTopScreen.innerText = "";
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
document.getElementById("close-qr").addEventListener("click", () => {
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

// Check if cameras are available when devices are unplugged or plugged in
navigator.mediaDevices.addEventListener("devicechange", () => checkCameras());

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
    // Reset highlight from all elements
    removeClass("selected-element", ...customizationButtons);
    swapClasses("pastel-white-bar", "bar", ...customizationButtons);

    // Change and highlight selected element according selected color
    addClass("selected-element", document.getElementById(e.id));
    changeElement(
      ...document.getElementsByClassName("selected-element"),
      ...document.getElementsByClassName("selected-color")
    );
    // Save selected element
    updateJSON("templateLayout", "general", "element", null, e.id);
  });
});

// Modify button background, icon or shadow color
Object.keys(settings["buttons"]).forEach((e) => {
  document.getElementById(e).addEventListener("click", (event) => {
    if (localStorage.getItem("editMode") === "true") {
      // Get current element and color
      let cElement = getJSON("templateLayout", "general", "element", null),
        cColor = getJSON("templateLayout", "general", "color", null);

      // Prevent parent elements to trigger
      event.stopPropagation();
      // Avoid empty color and painting edit icon after closing
      if (localStorage.getItem("closeEditMode") === "false") {
        // Only add classes when elements have a JSON field
        if (String(document.getElementById(e).classList).includes(cElement)) {
          // Change specified appearance
          removeClasses(document.getElementById(e), cElement);
          addClass(cColor + "-" + cElement, document.getElementById(e));

          // Save appearance temporary
          updateJSON(
            "templateLayout",
            "buttons",
            e,
            cElement,
            cColor + "-" + cElement
          );
        }
      }
      // Start edit mode
      localStorage.setItem("closeEditMode", false);
    }
  });
});

// Change the selected current color
Array.from(document.getElementsByClassName("color")).forEach((e) => {
  e.addEventListener("click", () => {
    // Delete highlight from all colors
    removeClass("selected-color", ...document.getElementsByClassName("color"));

    // Change and highlight selected color
    addClass("selected-color", e);

    // Change and highlight selected element
    swapClasses(
      e.id + "-bar",
      "bar",
      ...document.getElementsByClassName("selected-element")
    );

    // Save selected color
    updateJSON("templateLayout", "general", "color", null, e.id);
  });
});

// Modify current font
Array.from(document.getElementsByClassName("font")).forEach((e) => {
  e.addEventListener("click", () => {
    // Delete highlight from all fonts
    removeClass("selected-font", ...document.getElementsByClassName("font"));

    // Change and highlight selected font
    changeFont(document.getElementById("font"), e.id, fonts);
    addClass("selected-font", e);

    // Save selected font
    updateJSON("templateLayout", "general", "font", null, e.id);
  });
});

// Display or hide the scrollbar when you slide your finger
customizationContainers.forEach((element) => {
  // Show scroll bar when container is pressed down
  element.addEventListener("touchstart", (e) => {
    addClass("touched", element);
  });
  // Hide the scroll bar when not holding down the container
  element.addEventListener("touchend", (e) => {
    addClass("touched", element);
  });
});

// Close edit mode and save or reset styles applied
confirmButtons.forEach((e) => {
  e.addEventListener("click", () => {
    // Reset and close edit mode
    localStorage.setItem("closeEditMode", true);
    editMode(e);

    // Replace or reset settings
    e.id === "confirm"
      ? writeAndSave(
          "settings",
          localStorage.getItem("templateLayout"),
          null,
          null
        )
      : writeAndSave(
          "templateLayout",
          localStorage.getItem("settings"),
          null,
          null
        );
    window.location.reload();
  });
});

// Close edit menu without saving by pressing escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && localStorage.getItem("editMode") === "true") {
    writeAndSave(
      "templateLayout",
      localStorage.getItem("settings"),
      null,
      null
    );
    editMode(e);
    window.location.reload();
  }
});

// Open settings menu
document.getElementById("settings").addEventListener("click", () => {
  if (localStorage.getItem("editMode") === "false") {
    removeClass("hidden", document.getElementById("settings-menu"));
  }
});

// Close settings menu and hide modal window
document.getElementById("close-settings").addEventListener("click", () => {
  addClass(
    "hidden",
    document.getElementById("settings-menu"),
    document.getElementById("background-menu"),
    document.getElementById("opacity"),
    document.getElementById("modal")
  );
});

// Upload settings file
document.getElementById("upload-settings").addEventListener("click", () => {
  // Reset previous value and use personalized button
  document.getElementById("settings-input").value = "";
  document.getElementById("settings-input").click();

  // The scan will start when the input value changes
  document.getElementById("settings-input").addEventListener("change", (e) => {
    // Create scanner and read file
    let scanner = new FileReader();
    scanner.readAsText(e.target.files[0]);
    // Display result or error when the scanner has finished
    scanner.addEventListener("load", () => {
      try {
        // Replace old settings with new ones
        localStorage.setItem(
          "settings",
          JSON.stringify(validateJSON(JSON.parse(scanner.result), settings))
        );
        // Refresh only if the file is valid
        window.location.reload();
      } catch (e) {
        showError(1);
      }
    });
  });
});

// Download settings file
document.getElementById("download-settings").addEventListener("click", () => {
  downloadFile(
    JSON.stringify(JSON.parse(localStorage.getItem("settings")), null, 2),
    "mathcard.json"
  );
});

// Open background menu
document.getElementById("change-background").addEventListener("click", () => {
  removeClass("hidden", document.getElementById("background-menu"));
});

// Change background layout and refresh
Array.from(backgroundOptions).forEach((e) => {
  e.addEventListener("click", () => {
    // Save background in both storages
    updateJSON("settings", "general", "background", null, e.id);
    updateJSON("templateLayout", "general", "background", null, e.id);
    window.location.reload();
  });
});

// Show modal window
document.getElementById("reset-settings").addEventListener("click", () => {
  removeClass(
    "hidden",
    document.getElementById("modal"),
    document.getElementById("opacity")
  );
});

// Reset all settings and refresh
document.getElementById("delete").addEventListener("click", () => {
  localStorage.removeItem("settings");
  window.location.reload();
});

// Hide modal window
document.getElementById("cancel").addEventListener("click", () => {
  addClass(
    "hidden",
    document.getElementById("modal"),
    document.getElementById("opacity")
  );
});
