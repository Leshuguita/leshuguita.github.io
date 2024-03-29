var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

const bgscripts = ["boids.js","delaunay.js","digRain.js"];
const bgnames = ["Boids", "Delanuay", "Digital Rain"];

canvas.width = screen.width;
canvas.height = screen.height;

function gotoPage(path) {
	window.location = path;
}

function setbg() {
	var selected_id = Math.round(Math.random()*(bgscripts.length-1))
	var selected = bgscripts[selected_id];
	var head = document.getElementsByTagName('head')[0];
	var script = document.createElement('script');
	script.async = true;
	script.type = 'text/javascript';
	script.src = 'index/bg/' + selected;
	head.appendChild(script);
	document.getElementById('bg_name').innerHTML = bgnames[selected_id];
}

function filter(evt, thing) {
	var i, buttons, items;

	// Get all elements with class="item" and hide them. yeah a lot of invisibles but meh
	items = document.getElementsByClassName("item");
	for (i = 0; i < items.length; i++) {
		items[i].classList.add("invisible");
	}

	// Get all elements with class="filterbutton" and remove the class "active"
	buttons = document.getElementsByClassName("filterbutton");
	for (i = 0; i < buttons.length; i++) {
		buttons[i].classList.remove("active");
	}

	// Show the selected items, and add an "active" class to the button in use
	items = document.getElementsByClassName(thing);
	for (i = 0; i < items.length; i++) {
		items[i].classList.remove("invisible");
	}
	evt.currentTarget.classList.add("active");
}

function set_lang() {
	var lang = navigator.language || navigator.userLanguage;
	let es = document.getElementsByClassName("lang_es");
	for (let i=0; i<es.length; i++) {
		if (!lang.includes("es-")) {
			es[i].style.display = "none";
		}
	};
	let en = document.getElementsByClassName("lang_en");
	for (let i=0; i<en.length; i++) {
		if (lang.includes("es-")) {
			en[i].style.display = "none";	
		}
	};
}

set_lang();