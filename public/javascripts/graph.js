const controls = document.querySelectorAll('.control');

let wordCount = 50;

// Generating an Empty Graph
const options = {
	series: [],
	chart: {
		background: '#44475A',
		type: 'line',
		toolbar: {
			show: false,
		},
		animations: {
			enabled: true,
			easing: 'easeout',
			speed: 700,
			animateGradually: {
				enabled: true,
				delay: 150,
			},
			dynamicAnimation: {
				enabled: true,
				speed: 350,
			},
		},
	},
	colors: ['#FF79C6', '#6272A4'],
	stroke: {
		curve: 'smooth',
	},
	noData: {
		text: 'no data found',
		style: {
			fontFamily: 'Poppins',
		},
	},
	yaxis: {
		labels: {
			style: {
				colors: ['#F8F8F2'],
			},
		},
		min: 20,
	},
	grid: {
		show: false,
	},
	legend: {
		labels: {
			colors: ['#F8F8F2'],
		},
	},
	theme: {
		mode: 'dark',
	},
};
const chart = new ApexCharts(document.querySelector('#history'), options);
chart.render();

// Updating wordCount
for (let control of controls) {
	control.addEventListener('click', () => {
		wordCount = Number(control.textContent);
		initialise(wordCount);

		for (link of controls) link.classList.remove('selected-count');
		control.classList.add('selected-count');
	});
}

// Called with every Fetch
const updateGraph = (data) => {
	const dateStrings = data.map((x) => x.createdAt);

	const dates = [];
	dateStrings.map((date, i) => {
		dates[i] = new Date(date).toLocaleString();
	});

	const WPMs = data.map((x) => x.wpm);
	const ACCs = data.map((x) => x.acc);

   const series = [
		{
			name: 'Words per Minute',
			data: WPMs,
		},
		{
			name: 'Accuracy',
			data: ACCs,
		},
	];

	chart.updateSeries(series);
   chart.updateOptions({
		xaxis: {
			categories: dates,
			labels: {
				show: false,
			},
		},
	});
};

// Fetch Data when wordCount Changes
const initialise = async (wordCount) => {
	const res = await fetch(
		'/profile/results?' + new URLSearchParams({ wordCount: wordCount }),
		{
			headers: { 'Content-Type': 'application/json' },
		}
	);
	const data = await res.json();

	updateGraph(data);
};

initialise(wordCount);
