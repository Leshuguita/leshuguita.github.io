// First one is actual start
let currentBeatEvent = 0;
const beatEvents = [[16,'start'], [30,'change'], [46.5,'change'], [62,'change'], [78.5,'change'], [86,'change'], [94.5,'change'], [102,'change'], [110.5,'change'], [114,'change'], [118.5,'change'], [122,'change'], [126.5,'change'], [130,'change'], [138.5,'change'], [150,'change'], [156.5,'change'], [166,'change'], [172.5,'change'], [190,'change'], [206.5,'change']];

const locksteppers = [];

function fillScreen() {
	// Get row amount
	// Each row is 48px, because of overlap 
	const rows = Math.floor(1 + window.innerHeight / 48);
	// Get column amount. Odd rows get this + 1
	// Each stepper is 45px wide, because of overlap
	const evenCols = Math.floor(1 + window.innerWidth / 45);
	
	for (let y = 0; y < rows; y++) {
		const newRow = [];
		const rowElement = document.createElement('div');
		rowElement.classList.add('row');
		rowElement.style.minWidth = `${48*(evenCols+y%2)}px`
		// Squish up
		rowElement.style.transform = `translate(0px,${-16*(y+1)}px)`
		for (let x = 0; x < evenCols+y%2 ; x++) {
			const newL = newLockstepper();
			const half = Math.floor((evenCols+y%2)/2);
			// Squish to center
			newL.style.transform = `translate(${-4*(x-half)}px,0)`;
			newRow.push(newL);
			rowElement.appendChild(newL);
		}
		locksteppers.push(newRow)
		gameDiv.appendChild(rowElement);
	};
}

function newLockstepper() {
	let element = document.createElement('div');
	element.classList.add('lockstepper');
	element.addEventListener('animationend', (e) => {
		e.target.className = 'lockstepper';
	});
	return element;
}

let lastBeat = 0
function update() {
	if (Conductor.songPosition > lastBeat + Conductor.crotchet) {
		// Update Steppers
		locksteppers.forEach((row) => {
			row.forEach((l) => {
				if (!Conductor.offBeat) {
					l.classList.add('left');
				} else {
					l.classList.add('right');
				}
			})
		})
		// Start, switch to/from offBeat, zooms, etc
		if (currentBeatEvent < beatEvents.length && lastBeat+Conductor.crotchet > beatEvents[currentBeatEvent][0]*Conductor.crotchet) {
			switch (beatEvents[currentBeatEvent][1]) {
				case 'change':
					Conductor.offBeat = !Conductor.offBeat;
					break;
				case 'start':
					break;
				default:
					break;
			}
			currentBeatEvent++
		}
		if (Conductor.offBeat==Conductor.lastOffBeat) {
			lastBeat += Conductor.crotchet;
		} else {
			lastBeat += Conductor.crotchet/2;
			Conductor.lastOffBeat = Conductor.offBeat;
		}
	}
}

window.addEventListener('focus', () => {
	// Reset Locksteppers
	locksteppers.forEach((row) => {
		row.forEach((l) => {
			l.className = 'lockstepper';
		});
	});
});

let gameDiv;
window.addEventListener('load', ()=>{
	gameDiv = document.getElementById('game');
	fillScreen();
});

window.requestAnimationFrame(gameLoop);
function gameLoop() {
	update();
	window.requestAnimationFrame(gameLoop);
}