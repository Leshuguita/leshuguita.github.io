let menuDiv;
window.addEventListener('load', () => {
	menuDiv = document.getElementById('menu');
	const playButton = document.getElementById('oneButton');
	playButton.onclick = ()=>{
		gameDiv.style.display = 'flex';
		menuDiv.style.display = 'none';
		audio.play();
	}
});