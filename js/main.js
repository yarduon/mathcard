function add(n1, n2){
    return n1 + n2;
}

function subtract(){
    return n1 - n2;
}

function multiply(){
    return n1 * n2;
}

function divide(){
    return n1 / n2;
}

function operate(n1, n2, operator){
    switch(operator){
        case "+": 
            add(n1, n2)
            break;
        case "-":
            subtract(n1, n2);
            break;
        case "*":
            multiply(n1, n2);
            break;
        case "/":
            divide(n1, n2);
            break;
    }
}