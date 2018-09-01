/* Get input from user with prompts */

const readline = require('readline-sync');

exports.getUserStringInput = function(prompt) {
    // Print prompt and get input
    console.log(prompt);
    return readline.prompt();
};

exports.getUserNumberInput = function(prompt) {
    // Get valid user number input
    let numberInput;
    numberInput = this.getUserStringInput(prompt);

    // Check for validity
    if (isNaN(numberInput)) {
        console.log(`${numberInput} is not a valid number. Please try again.`);
        return this.getUserNumberInput(prompt);
    }
    return Number(numberInput);
};