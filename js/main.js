import { addHours } from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button")),
  topScreen = document.getElementById("operations"),
  result = document.getElementById("result");

function operations(operator, nums, total, firstTime) {
  switch (operator) {
    case "+":
      total += parseInt(nums);
      break;
    case "-":
      if (firstTime) {
        total = nums;
      } else {
        total -= parseInt(nums);
      }
      break;
    case "x":
      if (total === 0) total = 1;
      total *= parseInt(nums);
      break;
    case "÷":
      if (firstTime) {
        total = nums;
      } else {
        total /= parseInt(nums);
      }
      break;
  }
  return total;
}

function stringToMath(s) {
  let total = 0,
    nums = "",
    lastOperator = "",
    firstTime = true;
  Array.from(s).forEach((e, i) => {
    if (!isNaN(e)) {
      nums += e;
    } else {
      total = operations(e, nums, total, firstTime);
      firstTime = false;
      lastOperator = e;
      nums = "";
    }
    if (i == Array.from(s).length - 1) {
      total = operations(lastOperator, nums, total);
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
    topScreen.innerText += e.innerText;
  });
});

document.getElementById("equal").addEventListener("click", () => {
  result.innerText = stringToMath(topScreen.innerText);
});

document.getElementById("del").addEventListener("click", () => {
  // Create a copy of screen without last element
  topScreen.innerText = topScreen.innerText.slice(0, -1);
  if(isNaN(stringToMath(topScreen.innerText)) || result.innerText == 0){
    result.innerText = 0;
  } else {
    result.innerText = stringToMath(topScreen.innerText);
  }
  
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
  result.innerText = 0;
});
