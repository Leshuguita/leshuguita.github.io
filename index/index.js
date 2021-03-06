var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

const bgscripts = ["boids.js","delaunay.js","digRain.js"];

canvas.width = screen.width;
canvas.height = screen.height;

function setbg() {
	var selected = bgscripts[Math.round(Math.random()*(bgscripts.length-1))];
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.async = true;
	script.type = 'text/javascript';
	script.src = 'index/bg/' + selected;
	head.appendChild(script);
}

function filter(evt, thing) {
	var i, buttons, items;

	// Get all elements with class="item" and hide them. yeah a lot of invisibles but meh
	items = document.getElementsByClassName("item");
	for (i = 0; i < items.length; i++) {
		items[i].className += " invisible";
	}

	// Get all elements with class="filterbutton" and remove the class "active"
	buttons = document.getElementsByClassName("filterbutton");
	for (i = 0; i < buttons.length; i++) {
		buttons[i].className = buttons[i].className.replace(" active", "");
	}

	// Show the selected items, and add an "active" class to the button in use
	items = document.getElementsByClassName(thing);
	for (i = 0; i < items.length; i++) {
		items[i].className = items[i].className.replace(/ invisible/g, "");
	}
	evt.currentTarget.className += " active";

}