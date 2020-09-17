var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

const bgscripts = ["boids.js","delaunay.js"];

resize();

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

function setbg() {
	var selected = bgscripts[Math.round(Math.random()*(bgscripts.length-1))];
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'index/bg/' + selected;
	head.appendChild(script);
}