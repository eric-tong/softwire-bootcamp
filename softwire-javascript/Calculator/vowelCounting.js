/* Count vowels given user input string */

const userInput = require('./userInput');
const VOWELS = ["A", "E", "I", "O", "U"];

function countLetter(letter, inputString) {
    let letterCount = 0;
    for (let i = 0; i < inputString.length; i++) {
        if (inputString.charAt(i) === letter) letterCount++;
    }
    return letterCount;
}

function getVowelCount(inputString) {
    // Count vowels
    let vowelCount = {};
    VOWELS.forEach(function (vowel) {
        vowelCount[vowel] = countLetter(vowel, inputString);
    });
    return vowelCount
}

function printVowelCount(vowelCount) {
    // Print vowel counts
    console.log("The vowel counts are:" );
    VOWELS.forEach(vowel => console.log(`${vowel}: ${vowelCount[vowel]}`));
}

exports.performOneVowelCountingCalculation = function() {

    // Get user inputs and set to uppercase
    const inputString = userInput.getUserStringInput("Please enter a string:\t").toUpperCase();

    // Count vowels
    let vowelCount = getVowelCount(inputString);

    // Print results
    printVowelCount(vowelCount);
};