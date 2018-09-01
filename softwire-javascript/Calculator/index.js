/* INDEX: Find answers given user input numbers */

// Import functions
const userInput = require('./userInput');
const arithmetic = require('./arithmetic');
const vowelCounting = require('./vowelCounting');

// Define constants
const ARITHMETIC_MODE = 1;
const VOWEL_COUNTING_MODE = 2;
const QUIT_PROGRAM = 3;

function getCalculationMode() {
    // Get user input calculation mode
    return userInput.getUserNumberInput("Which calculation mode would you like?\n" +
        "\t1) Arithmetic\n" +
        "\t2) Vowel counting\n" +
        "\t3) Quit");
}

function printWelcomeMessage() {
    // Print introduction
    console.log('Welcome to the calculator!\n' +
        '==========================');
}

printWelcomeMessage();

mainLoop:
    while (true) {
        const calculationMode = getCalculationMode();
        switch (calculationMode) {
            case ARITHMETIC_MODE:
                arithmetic.performOneArithmeticCalculation();
                break;
            case VOWEL_COUNTING_MODE:
                vowelCounting.performOneVowelCountingCalculation();
                break;
            case QUIT_PROGRAM:
                break mainLoop;
            default:
                console.log(`${calculationMode} is not a valid calculation mode. Please try again.`);
                break;
        }
    }
