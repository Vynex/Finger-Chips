const inputField = document.querySelector('.field');
const wordsDiv = document.querySelector('.words');
const testState = document.querySelector('.control-mid');
const resultSpan = document.querySelector('.control-end');
const details = document.querySelector('.details');

let wordListRandom = [];
let wordCount = 50;

// To Change the Word Count
const wordCountLinks = document.querySelectorAll('.control');
for (let i = 0; i != wordCountLinks.length; i++) {
	wordCountLinks[i].addEventListener('click', () => {
		wordCount = wordCountLinks[i].textContent;

		for (link of wordCountLinks) link.classList.remove('selected-count');

		wordCountLinks[i].classList.add('selected-count');

		initialise();
	});
}

// To Select Random Words from Given WordList
const generateRandomWords = (words, wordCount) => {
	const randomWords = [];
	const randomWord = (arr) => arr[Math.floor(Math.random() * arr.length)];
	for (let i = 0; i != wordCount; i++) randomWords.push(randomWord(words));

	return randomWords;
};

// To Display the Words in Page
const setText = (words) => {
	wordsDiv.innerHTML = '';
	for (word of words) {
		const newSpan = document.createElement('span');
		newSpan.textContent = word;
		newSpan.classList.add('word');
		wordsDiv.appendChild(newSpan);
	}
	wordsDiv.firstElementChild.classList.add('current-word');
};

// To Reset the State
const reset = (wordList) => {
	wordListRandom = generateRandomWords(wordList, wordCount);
	setText(wordListRandom);

	typedWord = '';
	counter = 0;
	currentWordSpan;
	currentWord;

	totalKeys = 0;
	correctPresses = 0;
	incorrectWords = 0;
	corrections = 0;
	typo = false;

	testActive = false;
	timeTaken = 0;

	window.clearInterval(intervalId);
	inputField.disabled = false;
	inputField.value = '';
	inputField.setAttribute('id', '');
	inputField.focus();

	currentWordSpan = wordsDiv.childNodes[counter];
	currentWord = currentWordSpan.textContent;
	testState.style.display = 'none';

	wordListRandom.map((word) => {
		totalKeys += word.length + 1;
	});
	resultSpan.textContent = 'WPM: XX / ACC: XX';
	details.style.visibility = 'hidden';
};

// To Calculate the Results
const result = () => {
	const timeTakenSpan = document.querySelector('.time-taken');
	const keystrokesSpan = document.querySelector('.keystrokes');
	const correctionsSpan = document.querySelector('.corrections');
	const correctWordsSpan = document.querySelector('.correct-words');
	const incorrectWordsSpan = document.querySelector('.incorrect-words');

	inputField.disabled = true;
	inputField.blur();

	clearInterval(intervalId);

	testActive = false;
	testState.style.display = 'inline';

	let correctWords = correctPresses / 5;
	let minutes = timeTaken / 60;

	const wpm = Math.floor(correctWords / minutes);
	const acc = Math.floor((correctPresses / totalKeys) * 100);

	resultSpan.textContent = `WPM: ${wpm} / ACC: ${acc}`;
	details.style.visibility = 'visible';

	timeTakenSpan.textContent = `Finished in ${timeTaken} Seconds`;
	keystrokesSpan.textContent = `${correctPresses} Correct Keystrokes`;
	correctionsSpan.textContent = `${corrections} Corrections`;
	correctWordsSpan.textContent = `${Math.floor(correctWords)} Correct`;
	incorrectWordsSpan.textContent = `${incorrectWords} Incorrect`;

	const submit = async (user, wpm, acc) => {
		const data = { id: user, wordCount, wpm, acc };

		await fetch('/profile/results', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	};

	if (user) submit(user, wpm, acc);
};

// To Move the Current Word
const validateWord = (typed, correct) => {
	if (typed === correct) {
		currentWordSpan.classList.add('correct');

		// Adding 1 for Spaces
		correctPresses += correct.length + 1;
	} else {
		currentWordSpan.classList.add('incorrect');
		incorrectWords++;
	}

	counter++;
	currentWordSpan = wordsDiv.childNodes[counter];
	if (!currentWordSpan) {
		result();
		return;
	}
	currentWordSpan.classList.add('current-word');
	currentWord = currentWordSpan.textContent;
};

let typedWord = '';
let counter;
let currentWordSpan;
let currentWord;

let totalKeys = 0;
let correctPresses = 0;
let incorrectWords = 0;
let corrections = 0;
let typo = false;

let testActive = false;
let timeTaken = 0;
let intervalId;

inputField.addEventListener('keydown', (e) => {
	let charExp = new RegExp(/^[a-zA-Z]$/g);
	let character = charExp.test(e.key);

	// Valid Key Pressed
	if (character || e.key == "'") {
		typedWord = inputField.value + e.key;

		if (!testActive) {
			intervalId = window.setInterval(() => {
				timeTaken++;
			}, 1000);
		}

		testActive = true;
	}

	// To Move the Current Word
	if (e.code == 'Space') {
		// So that Space Bar does not enter 'Input'
		e.preventDefault();

		if (inputField.value !== '') {
			validateWord(typedWord, currentWord);
		}
		inputField.value = '';
		typedWord = '';
	}

	// To Account for Backspace and Delete
	if (e.code == 'Backspace' || e.code == 'Delete') {
		typedWord = inputField.value;
	}

	// To Notify on Incorrect Keystroke
	if (typedWord != currentWord.substring(0, typedWord.length)) {
		inputField.setAttribute('id', 'input-wrong');
		typo = true;
	} else {
		inputField.setAttribute('id', '');
		if (typo) {
			typo = false;
			corrections++;
		}
	}
});

// To Restart the Test
document.onkeyup = (e) => {
	if (e.code == 'Escape') {
		initialise();
	}
};

const initialise = async () => {
	let res = await fetch('./top-300.json');
	let data = await res.json();

	reset(data);
};

initialise();
