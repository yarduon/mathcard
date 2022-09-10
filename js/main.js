import { addHours } from "./utility.js";

const buttons = Array.from(document.getElementsByClassName("calc-button"));
let topScreen = document.getElementById("operations");

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

function add(n1, n2) {
  return n1 + n2;
}

function substract() {
  return n1 - n2;
}

function multiply() {
  return n1 * n2;
}

function divide() {
  return n1 / n2;
}

function operate(n1, n2, operator) {
  switch (operator) {
    case "+":
      add(n1, n2);
      break;
    case "-":
      substract(n1, n2);
      break;
    case "*":
      multiply(n1, n2);
      break;
    case "/":
      divide(n1, n2);
      break;
  }
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
