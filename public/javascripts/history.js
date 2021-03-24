const controls = document.querySelectorAll('.control');
const deleteBtn = document.querySelector('#delete');
const list = document.querySelector('.history');

let wordCount = 50;

deleteBtn.addEventListener('click', () => {
	const results = document.querySelectorAll('input');

	for (result of results) {
		if (result.checked) destroy(result.value);
	}
});

// Fetch DELETE
const destroy = async (id) => {
	const res = await fetch(`/profile/results/${result.value}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	initialise(wordCount);
};

// Updating wordCount
for (let control of controls) {
	control.addEventListener('click', () => {
		wordCount = Number(control.textContent);
		initialise(wordCount);

		for (link of controls) link.classList.remove('selected-count');
		control.classList.add('selected-count');
	});
}

// Fetch and Render Data
const initialise = async (wordCount) => {
	const res = await fetch(
		'/profile/results?' + new URLSearchParams({ wordCount: wordCount }),
		{
			headers: { 'Content-Type': 'application/json' },
		}
	);

	const data = await res.json();
	showData(data);
};

// Display History as a ul
const showData = (data) => {
	list.innerHTML = '';

	if (data.length)
		for (let i = 0; i != data.length; i++) {
			const li = data[i];

			const newLi = document.createElement('li');

			let id = li._id;
			let date = new Date(li.createdAt).toLocaleString().slice(0, -3);
			let text = ` WPM: ${li.wpm}, Accuracy: ${li.acc}`;
			const labelText = document.createTextNode(text);

			const newSpan = document.createElement('span');
			newSpan.classList.add('date');
			newSpan.textContent = date;

			const newInput = document.createElement('input');
			newInput.setAttribute('type', 'checkbox');
			newInput.setAttribute('value', id);
			newInput.setAttribute('id', i);

			const newLabel = document.createElement('label');
			newLabel.setAttribute('for', i);
			newLabel.appendChild(newSpan);
			newLabel.appendChild(labelText);

			newLi.appendChild(newInput);
			newLi.appendChild(newLabel);
			list.appendChild(newLi);
		}
	else {
		const text = document.createTextNode('no data');

		const newLi = document.createElement('li');
		newLi.appendChild(text);

		list.appendChild(newLi);
	}

};

initialise(wordCount);
