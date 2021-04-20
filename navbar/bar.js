var navbarIframe = window.frameElement;
resizeIFrame();

function resizeIFrame() {
	navbarIframe.height = document.getElementById("content").scrollHeight+2;
	console.log(navbarIframe.height)
	navbarIframe.style.height = navbarIframe.height + "px";
}

document.getElementById("content").addEventListener("click", e =>{
	e.target.focus();
});

document.getElementById("content").addEventListener("focusout", e =>{
	if (!event.currentTarget.contains(event.relatedTarget)) {
		filter(null,"none");
    }
});

function filter(e, thing) {
	var things = document.getElementById("things");
	var items = things.children;
	
	removeUnder();

	if (thing=="none") {
		things.style.padding="0px";
	} else {
		things.style.padding="";
	}

	if (e) {
		e.currentTarget.style.borderBottom= "3px solid white";
	}

	for (i = 0; i < items.length; i++) {
		items[i].classList.add("invisible");
	}

	items = document.getElementsByClassName(thing);
	for (i = 0; i < items.length; i++) {
		items[i].classList.remove("invisible");
	}

	resizeIFrame();
}

function removeUnder() {
	cats = document.getElementById("categories").children;
	for (i=0;i<cats.length;i++) {
		cats[i].style.borderBottom="";
	}
}