let size = 10000000;
let choices = 3;
let array = new Array(size);
let choice = 0;

let repeatCount = 0;
let repeatFrequency = [];

for (let i = 0; i < size; i++) {
    choice = Math.floor(Math.random() * 3);
    array[i] = choice;

    if (choice === 0) {
        repeatCount++;
    } else {
        repeatFrequency[repeatCount] = isNaN(repeatFrequency[repeatCount]) ? 1 : repeatFrequency[repeatCount] + 1;
        repeatCount = 0;
    }
}

for (let i = 0; i < repeatFrequency.length; i++) {
    repeatFrequency[i] /= size;
}

console.log(repeatFrequency);

// Equation is y = 0.4692e-1.113x
