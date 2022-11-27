// https://yarduon.com
export function formatNumber(number) {
  return number < 10 ? "0" + number : number;
}

export function increment(number) {
  return +number + 1;
}

export function decrement(number) {
  return +number - 1;
}

export function downloadFile(content, fileName) {
  let anchor = document.createElement("a");
  anchor.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(content)
  );
  anchor.setAttribute("download", fileName);
  anchor.click();
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

export function swapClasses(cAdd, cDelete, ...e) {
  removeClass(cDelete, ...e);
  addClass(cAdd, ...e);
}

// Add one class to multiple elements
export function addClass(selectedClass, ...elements) {
  elements.forEach((e) => {
    e.classList.add(selectedClass);
  });
}

// Add multiple classes to an element
export function addClasses(element, ...classes) {
  classes.forEach((c) => {
    element.classList.add(c);
  });
}

// Remove one class from multiple elements
export function removeClass(selectedClass, ...elements) {
  elements.forEach((e) => {
    e.classList.forEach((o, i) => {
      if (e.classList[i].includes(selectedClass)) {
        e.classList.remove(e.classList[i]);
      }
    });
  });
}

// Remove multiple classes from an element
export function removeClasses(element, ...classes) {
  classes.forEach((c) => {
    element.classList.forEach((e, i) => {
      if (element.classList[i].includes(c)) {
        element.classList.remove(element.classList[i]);
      }
    });
  });
}

// Check if one element has any class specified
export function checkClasses(element, ...classes) {
  let classFound = false;
  classes.forEach((c, i) => {
    // Detect if a class is inside of the element or not
    if (String(element.classList).includes(c)) {
      classFound = true;
    }
  });
  return classFound;
}

export function changeFont(container, newFont, fonts) {
  removeClasses(container, ...fonts);
  addClass(newFont, container);
}

export function changeElement(currentElement, currentColor) {
  swapClasses(currentColor.id + "-bar", "bar", currentElement);
}

export function getJSON(jsonName, mainField, secondaryField, tertiaryField) {
  let json = JSON.parse(localStorage.getItem(jsonName)),
    value = "";

  switch (true) {
    case tertiaryField !== null:
      value = json[mainField][secondaryField][tertiaryField];
      break;
    case secondaryField !== null:
      value = json[mainField][secondaryField];
      break;
    case mainField !== null:
      value = json[mainField];
      break;
  }
  return value;
}

export function updateJSON(
  jsonName,
  mainField,
  secondaryField,
  tertiaryField,
  property
) {
  let copyJSON = JSON.parse(localStorage.getItem(jsonName));

  switch (true) {
    case tertiaryField !== null:
      copyJSON[mainField][secondaryField][tertiaryField] = property;
      break;
    case secondaryField !== null:
      copyJSON[mainField][secondaryField] = property;
      break;
    case mainField !== null:
      copyJSON[mainField] = property;
      break;
  }
  localStorage.setItem(jsonName, JSON.stringify(copyJSON));
}

export function validateJSON(json, structure) {
  // Throw an error if the supplied file does not have the desired structure
  Object.keys(structure).forEach((e) => {
    Object.keys(structure[e]).forEach((p) => {
      if (
        String(Object.keys(structure)) !== String(Object.keys(json)) ||
        String(Object.keys(structure[e])) !== String(Object.keys(json[e])) ||
        String(Object.keys(structure[e][p])) !== String(Object.keys(json[e][p]))
      ) {
        throw "Not valid JSON";
      }
    });
  });
  return structure;
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
    "x",
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
    if (place) place.innerText += save;
    localStorage.setItem(name, localStorage.getItem(name) + save);
  } else {
    if (place) place.innerText = save;
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
