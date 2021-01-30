var ds1theme = document.getElementById("ds1t");
var ds3theme = document.getElementById("ds3t");
var themesel = document.getElementById("theme");
var stylesel = document.getElementById("style");
var fontel = document.getElementById("fontp");
var fontsel = document.getElementById("font");
var portraitel = document.getElementById("portraitp");
var portraitsel = document.getElementById("portrait");
var uisel = document.getElementById("ui");

loadCookies();

async function loadCookies() {
	setFont(getCookie("font")||fontsel.value);
	setTheme(getCookie("theme")||themesel.value);
	//setStyle(getCookie("style")||stylesel.value);
	//setUI(getCookie("ui")||uisel.value);
	//setPortrait(getCookie("portrait")||portraitsel.value);

	drawtocanvas();
}

function getCookie(cname) {
	var name = cname + "="
	var cookiestr = decodeURIComponent(document.cookie);
	var cookiearr = cookiestr.split(";");
	for(var i = 0; i <cookiearr.length; i++) {
	    var c = cookiearr[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return undefined;
}

async function saveCookie(name, value) {
	var now = new Date();
	now.setFullYear(now.getFullYear() + 50);
	now = now.toUTCString();
	document.cookie = `${name}=${value}; expires=${now}`;
}

function setFont(font) {
	signfont = font;
	if (fontsel.value != font) {
		fontsel.value = font;
	}

	saveCookie("font", font);
}

function setTheme(theme) {
	if (theme == "ds1") {
		ds1theme.disabled = false;
		ds3theme.disabled = true;
	} else {
		ds1theme.disabled = true;
		ds3theme.disabled = false;
	}
	if (themesel.value != theme) {
		themesel.value = theme;
	}

	saveCookie("theme", theme);
}

/*
function setStyle(style) {
	if (style=="floor") {
		fontel.style.display = "";
		portraitel.style.display = "none";
	} else {
		fontel.style.display = "none";
		portraitel.style.display = "";
	}
	if (stylesel.value != style) {
		stylesel.value = style;
	}

	imgStyle = style;

	saveCookie("style", style);
}

function setPortrait(portrait) {
	if (portraitsel.value != portrait) {
		portraitsel.value = portrait;
	}

	saveCookie("portrait", portrait);
}

function setUI(ui) {
	if (uisel.value != ui) {
		uisel.value = ui;
	}

	saveCookie("ui", ui);
}
*/