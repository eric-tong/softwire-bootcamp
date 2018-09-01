/* Get answer from user input operator and numbers */

const userInput = require('./userInput');
const VALID_OPERATORS = ["+", "-", "*", "/", "^", "%"];

function getInputOperator() {
    // Get input operator and return if valid
    const inputOperator = userInput.getUserStringInput('Please enter an operator (+ - * / ^ %):\t');

    // Check for validity
    if (VALID_OPERATORS.indexOf(inputOperator) < 0) {
        console.log(`${inputOperator} is not a valid operator. Valid operators are + - * / ^ %.`);
        return getInputOperator();
    }
    return inputOperator;
}

function getInputLength(inputOperator) {
    // Get input length of array and return if valid
    const inputLength = userInput.getUserNumberInput(`How many numbers do you want to ${inputOperator}?\t`);
    if (inputLength < 1 || inputLength > 2**32) {
        console.log(`${inputLength} is not a valid length. Please enter a number greater than 0 and less than 2^32.`);
        return getInputLength(inputOperator);
    }
    return inputLength;
}

function getInputNumbers(inputLength) {
    // Return array of user input numbers
    let inputNumbers = Array(inputLength);
    for (let i = 1; i <= inputLength; i++)
        inputNumbers[i - 1] = userInput.getUserNumberInput(`Please enter number ${i}:\t`);

    return inputNumbers;
}

function getAnswer(inputOperator, inputNumbers) {
    // Return answer based on operator
    let answer = inputNumbers.shift();
    switch (inputOperator) {
        case "+":
            answer = inputNumbers.reduce((first, second) => first + second, answer);
            break;
        case "-":
            answer = inputNumbers.reduce((first, second) => first - second, answer);
            break;
        case"*":
            answer = inputNumbers.reduce((first, second) => first * second, answer);
            break;
        case"/":
            answer = inputNumbers.filter(inputNumber => inputNumber !== 0)
                .reduce((first, second) => first / second, answer);
            break;
        case"^":
            answer = inputNumbers.reduce((first, second) => first ** second, answer);
            break;
        case"%":
            answer = inputNumbers.reduce((first, second) => first % second, answer);
            break;
    }
    return answer;
}

exports.performOneArithmeticCalculation = function () {

    // Get user inputs
    const inputOperator = getInputOperator();
    const inputLength = getInputLength(inputOperator);
    const inputNumbers = getInputNumbers(inputLength);

    // Get answer based on operator
    const answer = getAnswer(inputOperator, inputNumbers);

    // Print output product
    console.log(`The result is: ${answer}.`);
};