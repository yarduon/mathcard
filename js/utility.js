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
    operator === "%" ||
    operator === "(" ||
    operator === ")"
  );
}

export function swapClasses(e, cAdd, cDelete) {
  e.classList.add(cAdd);
  e.classList.remove(cDelete);
}

export function stringToBoolean(s){
  return Boolean(s === "true");
}
