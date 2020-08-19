var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

resize();

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}