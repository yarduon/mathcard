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

document.getElementById("del").addEventListener("click", () => {
  // Create a copy of screen without last element 
  topScreen.innerText = topScreen.innerText.slice(0, -1);
});

document.getElementById("ac").addEventListener("click", () => {
  // Reset screen
  topScreen.innerText = "";
});
