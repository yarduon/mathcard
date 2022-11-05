// https://yarduon.com
export function formatNumber(number) {
  return number < 10 ? "0" + number : number;
}

export function addHours(date, h = 0) {
  return new Date(date.setTime(date.getTime() + h * 60 * 60 * 1000));
}

export function isOperator(operator) {
  return (
    operator === "+" ||
    operator === "-" ||
    operator === "*" ||
    operator === "/" ||
    operator === "^" ||
    operator === "Dead" ||
    operator === "%" ||
    operator === "(" ||
    operator === ")"
  );
}

// Only checks if one of the elements is equal to the first parameter
export function isEqual(toCompare, ...elements) {
  let boolean = false;
  for (let i = 0; i < elements.length; i++) {
    if (toCompare === elements[i]) {
      boolean = true;
      break;
    }
  }
  return boolean;
}

export function swapClasses(e, cAdd, cDelete) {
  e.classList.add(cAdd);
  e.classList.remove(cDelete);
}

export function stringToBoolean(s) {
  return Boolean(s === "true");
}

// Clean letters, characters or white spaces from a string with numbers
export function cleanText(n) {
  n = n.toLowerCase();
  let matches = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "ñ",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "y",
    "z",
    "",
  ];
  matches.forEach((e) => {
    n = n.replaceAll(e, "");
  });
  return n;
}

export function writeAndSave(name, save, place, accumulate) {
  if (accumulate) {
    place.innerText += save;
    localStorage.setItem(name, localStorage.getItem(name) + save);
  } else {
    place.innerText = save;
    localStorage.setItem(name, save);
  }
}

export function countElements(element, array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      total++;
    }
  }
  return total;
}

// Return any property value or the option according by his name and specified select
export function getCurrentSelectValue(select, attribute) {
  return !attribute
    ? select.options[select.selectedIndex]
    : select.options[select.selectedIndex].getAttribute(attribute);
}
