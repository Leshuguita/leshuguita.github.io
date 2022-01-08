var htmlBoard;
var htmlFace;

var game = {
	mineBoard:{},
	height:9,
	width:9,
	mines:10,
	flagCount:0,
	minesLeft:1,
	revealedTiles:0,
	clicks:0,
	startTime:0,
	state:"notStarted"
}

var timer = {seconds:0,timer};

var maxBoardTime = 10000;

var pressedTiles = [];

var tap = {timer,start:0,longLength:500};

let fitScreenState = false;

//-------
// TO DO
//-------

//leaderboard

// ------------------
// GAME LOGIC N STUFF
// ------------------

//prepare game on load
window.addEventListener("load", e => {
	htmlBoard = document.getElementById("board");
	htmlFace = document.getElementById("face");
	htmlBoard.addEventListener("contextmenu", e=>{e.preventDefault()});
	loadCookies();
	newGame(game.width,game.height,game.mines);
});

//resize
document.addEventListener("resize", e => {
	fitScreen(false);
});

//face clicks
document.addEventListener("mousedown", e => {
	if (e.target==htmlFace && e.button==0) {
		htmlFace.style.backgroundImage = "var(--pressed)";
	} else {
		if (e.button!=0||game.state=="lost"||game.state=="won") {return;}
		htmlFace.style.backgroundImage = "var(--surprised)";
	}
});

document.addEventListener("mouseup", e => {
	if (e.button!=0||game.state=="lost"||game.state=="won") {return;}
	htmlFace.style.backgroundImage = "var(--happy)";
});

document.addEventListener("mouseout", e => {
	if (e.button!=0) {return;}
	switch (game.state) {
		case "lost":
			htmlFace.style.backgroundImage = "var(--dead)";
			break;
		case "won":
			htmlFace.style.backgroundImage = "var(--sunglasses)";
			break;
		default:
			htmlFace.style.backgroundImage = "var(--happy)";
			break
	}

});

document.addEventListener("touchstart", e => {
	//e.preventDefault(); //throws error??
	if (e.target==htmlFace) {
		htmlFace.style.backgroundImage = "var(--pressed)";
	} else {
		if (game.state=="lost"||game.state=="won") {return;}
		htmlFace.style.backgroundImage = "var(--surprised)";
	}
});

document.addEventListener("touchend", e => {
	if (game.state=="lost"||game.state=="won") {return;}
	htmlFace.style.backgroundImage = "var(--happy)";
});

//resets game
function newGame(w,h,m) {
	document.activeElement.blur();
	htmlFace.style.backgroundImage = "var(--happy)";
	if (m>w*h-1) {
		console.error("Mines don't fit the board!")
		return;
	}
	clearTimeout(timer.timer);
	game.state = "notStarted";
	timer.seconds=0;
	game.width = w;
	game.height = h;
	game.mines = m;
	game.flagCount = 0;
	game.minesLeft = game.mines;
	game.mineBoard = {};
	game.clicks = 0;
	game.revealedTiles = 0;
	timerFunc();
	minesFunc();
	generateBoard(game.width,game.height,game.mines);
	fitScreen(false);
}

function generateBoard(w,h,m) {
	//choose mine spots
	for (var i=0;i<m;i++) {
		var x = Math.floor(Math.random()*w);
		var y = Math.floor(Math.random()*h);
		if (!game.mineBoard[x] || !game.mineBoard[x][y]) {
			makemine(x,y);
		} else {
			i--;
		}
	}

	var startTime = Date.now();
	//make table in the html
	//rows
	htmlBoard.innerHTML = "";
	for (var i=0;i<h;i++) {
		htmlBoard.innerHTML += `<tr id="row${i}"></tr>`;
		//columns
		for (var j=0;j<w;j++) {
			//stop if taken too long

			var node = document.createElement("TD");
			node.id=`${j}-${i}`;
			node.className="hidden";
			node.dataset.board=true;
			//node.innerHTML = `${(!game.mineBoard[j]||!game.mineBoard[j][i ])?"":"M"}`; //Mark mines for debug

			document.getElementById(`row${i}`).appendChild(node);

			if (Date.now()-startTime>maxBoardTime) {
				i=h;
				j=w;
				alert("Board took too long to generate!");
				newGame(30, 16, 100) //make a new board with expert size instead
			}
		}
	}
	//add click and right click event listener to table
	htmlBoard.addEventListener("mousedown", holdTile);
	htmlBoard.addEventListener("mouseup", click);
	//add hover listeners
	htmlBoard.addEventListener("mouseover", holdTile);
	htmlBoard.addEventListener("mouseout", removeIndividualBg);
	//add touch event listeners;
	htmlBoard.addEventListener("touchstart", startTap);
	htmlBoard.addEventListener("touchend", endTap);


}

function holdTile(e) {
	if ((e.buttons&1==1) && e.target.className=="hidden") {
		e.target.style.backgroundImage = "var(--clicked)";
	}
}

function removeIndividualBg(e) {
	e.target.style.backgroundImage = "";
}

function makemine(x,y) {
	if (game.mineBoard[x] == undefined) {
		game.mineBoard[x] = {}
	}

	game.mineBoard[x][y] = true;
}

//called on first click on board
function startGame() {
	game.state="started";
	game.startTime = Date.now();
	timer.timer = setInterval(timerFunc,"1000");
}

function loseGame() {
	htmlFace.style.backgroundImage = "var(--dead)";
	revealMines();
	clearTimeout(timer.timer);
	removeListeners();
	game.state = "lost";
}

function winGame() {
	htmlFace.style.backgroundImage = "var(--sunglasses)";
	revealBoard();
	clearTimeout(timer.timer);
	removeListeners();
	game.state = "won";
}

function removeListeners() {
	//remove click listeners
	htmlBoard.removeEventListener("mousedown", holdTile);
	htmlBoard.removeEventListener("mouseup", click);
	//remove "hover" listeners
	htmlBoard.removeEventListener("mouseover", holdTile);
	htmlBoard.removeEventListener("mouseout", removeIndividualBg);
	//remove touch event listeners;
	htmlBoard.removeEventListener("touchstart", startTap);
	htmlBoard.removeEventListener("touchend", endTap);
}

function startTap(e) {
	e.preventDefault();
	tap.start = Date.now();
	tap.timer = setTimeout(()=>{longTap(e)}, tap.longLength);
}

function endTap(e) {
	if (tap.timer) {
		clearTimeout(tap.timer);
	}

	//do normal click stuff
	if (Date.now()-tap.start<tap.longLength) {
		click(e);
	}
}

function longTap(e) {
	//flag tile
	var tile = e.target;
	var x = parseInt(tile.id.split("-")[0],10);
	var y = parseInt(tile.id.split("-")[1],10);

	let s = document.getElementsByName("tileScale")[0]
	let c = document.getElementById("flagCircle");
	c.classList.remove("grow")
	void c.offsetWidth
	c.style.left = e.touches[0].pageX-24 + "px"
	c.style.top = e.touches[0].pageY-24 + "px";

	c.classList.add("grow")

	flagTile(tile,x,y);
}

function click(e) {
	e.preventDefault();
	e.target.style.backgroundImage="";

	var tile = e.target;
	var x = parseInt(tile.id.split("-")[0],10);
	var y = parseInt(tile.id.split("-")[1],10);

	if (game.state=="notStarted") {
		startGame();
		if (game.mineBoard[x] && game.mineBoard[x][y]) {
			//if first is mine, move elsewhere
			delete game.mineBoard[x][y];
			makemine(Math.floor(Math.random()*game.width),Math.floor(Math.random()*game.height));
		}
	}

	if (e.button==2) {
		//if right click
		flagTile(tile,x,y);
	} else {
		//if left click
		if (tile.className=="hidden") {
			game.clicks++;
			pressedTiles.push({tile:tile,x:x,y:y,click:true,nReveal:true});
			pressTiles();
		}
	}

	if (game.revealedTiles==(game.width*game.height)-game.mines) {
		winGame();
	}
}

//loops over the "to press" array until empty
function pressTiles() {
	while (pressedTiles.length>0) {
		pressTile(pressedTiles[0].tile,pressedTiles[0].x,pressedTiles[0].y,pressedTiles[0].click,pressedTiles[0].nReveal);
		pressedTiles.shift();
	}
}

//shows all tiles
function revealBoard() {
	game.state="ended";
	htmlBoard.removeEventListener("click", click);
	htmlBoard.removeEventListener("contextmenu", click);
	for (var i=0;i<game.width;i++) {
		for (var j=0;j<game.height;j++) {
			var tile = document.getElementById(`${i}-${j}`);
			switch (tile.className) {
				case "flag":
					if (!game.mineBoard[i] || !game.mineBoard[i][j]) {
						tile.className="minex";
					}
					break;
				case "hidden":
					pressTile(tile,i,j,false,false);
					break;
			}
		}
	}
}

//shows all mines, and wrong flags
function revealMines() {
	for (var i=0;i<game.width;i++) {
		for (var j=0;j<game.height;j++) {
			var tile = document.getElementById(`${i}-${j}`);
			switch (tile.className) {
				case "flag":
					if (!game.mineBoard[i] || !game.mineBoard[i][j]) {
						tile.className="minex";
					}
					break;
				case "hidden":
					if (game.mineBoard[i] && game.mineBoard[i][j]) {
						tile.className="mine";
					}
					break;
			}
		}
	}
}

function pressTile(tile,x,y,click,nReveal) {
	var around = 0;
	var aroundTiles = [];

	if (tile.className!="hidden") {
		return;
	}

	if (game.mineBoard[x] && game.mineBoard[x][y]) {
		//is mine, end game
		if (click) {
			tile.className = "minered";
			loseGame();
		} else {
			tile.className = "mine";
		}
		return;
	}

	for (i=-1;i<=1;i++) {
		for (j=-1;j<=1;j++) {
			var bx = x+i;
			var by = y+j;
			//count mines around tile
			if (game.mineBoard[bx] && game.mineBoard[bx][by]) {
				around++
			}
			//check surrounding tiles, only if tile exists, is not self, and nReveal is true
			if (!(i==0 && j==0) && bx>=0 && bx<game.width && by>=0 && by<game.height && nReveal) {
				var newTile = document.getElementById(`${bx}-${by}`);
				if (newTile.className=="hidden") {
					aroundTiles.push({tile:newTile,x:bx,y:by,click:false,nReveal:true});
				}
			}
		}
	}

	if (around>0) {
		tile.className = "tile" + around;
		game.revealedTiles++;
		return 0;
	} else {
		tile.className = "empty";
		game.revealedTiles++;
		pressedTiles = [...pressedTiles,...aroundTiles];
		return aroundTiles.length;
	}
}

function flagTile(tile,x,y) {
	if (tile.className == "hidden") {
		tile.className = "flag";
		game.flagCount++

		if (game.mineBoard[x] && game.mineBoard[x][y]) {
			game.minesLeft--
		}
	} else if (tile.className == "flag") {
		tile.className = "hidden";
		game.flagCount--

		if (game.mineBoard[x] && game.mineBoard[x][y]) {
			game.minesLeft++
		}
	}

	minesFunc();
}

//handles changing the timer and counting seconds
function timerFunc() {
	if (game.state=="started") {
		timer.seconds++;
	}
	var htmlTimer = document.getElementById("timer");
	var three = ('000'+timer.seconds).slice(-3).toString()
	htmlTimer.children[0].className = "number"+three[0];
	htmlTimer.children[1].className = "number"+three[1];
	htmlTimer.children[2].className = "number"+three[2];
}

//handles mines counter
function minesFunc() {
	var htmlCount = document.getElementById("mineCounter");
	var three = ('000'+Math.abs(game.mines-game.flagCount)).slice(-3).toString();
	htmlCount.children[0].className = "number"+((game.mines-game.flagCount)<0? "-":three[0]);
	htmlCount.children[1].className = "number"+three[1];
	htmlCount.children[2].className = "number"+three[2];
}

//-------
//Options
//-------

//hide custom dropdown if lost focus
document.getElementById("customDD").addEventListener("focusout", e => {
	if (!event.currentTarget.contains(event.relatedTarget)) {
		hideCustom();
	}
});

function showCustom() {
	var dropdown = document.getElementById("customDD");
	var button = document.getElementById("customButton");

	dropdown.style.display = "block";
	dropdown.style.top = button.getBoundingClientRect().top+button.height+"px";
	dropdown.style.left = button.getBoundingClientRect().left+"px";
	dropdown.focus();
	button.style.backgroundColor = "var(--button_color)";
	button.style.color = "#ffffff";
}

function hideCustom() {
	var dropdown = document.getElementById("customDD");
	var button = document.getElementById("customButton");

	dropdown.style.display = "";
	button.style.backgroundColor = "";
	button.style.color = "";
}

//checks custom values, setting them to max/min if invalid, creating a new game otherwise
function customOK() {
	var form = document.getElementById("customF");
	var targetW = Math.max(5,form.elements.width.value);
	var targetH = Math.max(5,form.elements.height.value);
	var targetM = Math.max(1,Math.min(form.elements.mines.value,targetW*targetH-1));
	if (form.elements.width.value!=targetW || form.elements.height.value!=targetH || form.elements.mines.value!=targetM) {
		form.elements.width.value=targetW;
		form.elements.height.value=targetH;
		form.elements.mines.value=targetM;
		return;
	}
	maxBoardTime = form.elements.time.value*1000;
	newGame(form.elements.width.value,form.elements.height.value,form.elements.mines.value)
	saveCookies('game');
}

//changes board scale, limiting to 4x if manual
function setScale(s,limit) {
	var limited = Math.min(4,Math.max(0.5,s.value));
	if (limit) {s.value=limited}
	if (s.name=="textScale") {
		document.documentElement.style.setProperty('--text_scale', s.value);
		fitScreen(false);
	} else {
		document.getElementById("game").style.transform = `scale(${s.value},${s.value})`;
	}
	saveCookies('display');
}

//handles auto scaling
function fitScreen(toggle) {
	let input = document.getElementsByName("tileScale")[0];
	if (toggle) {
		input.disabled = !input.disabled;
		fitScreenState = !fitScreenState;
		document.getElementById("fit").classList.toggle("checked");
	}
	if (fitScreenState) {
		let game = document.getElementById("game");
		input.value = 1;
		setScale(input, false);
		let boardWidth = game.offsetWidth;
		let boardHeight = game.offsetHeight;

		let availWidth = document.documentElement.clientWidth - getScrollbarWidth();
		let availHeight = document.documentElement.clientHeight - game.offsetTop;

		let newScale = Math.min(availWidth/boardWidth , availHeight/boardHeight);

		input.value = newScale;
		setScale(input, false);
		saveCookies('display');
	}
}

function changeTheme(url) {
	var arr =url.split(",")
	var t = arr[0];
	var m = arr[1];
	var i = arr[2];
	var c = arr[3];
	document.getElementById("theme").href = t;
	document.getElementById("mines").href = m;
	document.getElementById("icon").href = i;
	document.getElementsByName("theme-color")[0].content = c;
	setTimeout(()=>{fitScreen(false)},200);
	saveCookies('theme');
}

function alignBoard() {
	var a = document.getElementsByTagName("body")[0].style;
	var g = document.getElementById("game");
	var b = document.getElementById("align");
	b.blur()
	switch (a.textAlign) {
		case "":
		case "left":
			a.textAlign = "center";
			b.innerHTML = "<u>A</u>lign Right";
			g.style.transformOrigin = "top";
			break;
		case "center":
			a.textAlign = "right";
			b.innerHTML = "<u>A</u>lign Left";
			g.style.transformOrigin = "top right";
			break;
		case "right":
			a.textAlign = "left"
			b.innerHTML = "<u>A</u>lign Center";
			g.style.transformOrigin = "top left";
			break;
	}
	saveCookies('display');
}

//handle keyboard shortcuts
window.addEventListener("keyup", e => {
	switch (e.key) {
		case "b":
		case "i":
		case "e":
			var button = document.getElementById(e.key+"Button")
			if (button == document.activeElement) {
				button.click();
			} else {
				button.focus();
			}
			break;
		case "c":
			if (document.getElementById("customDD").style.display=="") {
				document.getElementById("customButton").click();
			} else {
				hideCustom();
			}
			break;
		case "o":
			document.getElementsByName("tileScale")[0].focus();
			break;
		case "t":
			document.getElementsByName("textScale")[0].focus();
			break;
		case "m":
			document.getElementsByName("themeSelect")[0].focus();
			// No way to open it from js, click() does nothing
			break;
		case "f":
			var button = document.getElementById("fit");
			button.click();
			break;
		case "a":
			document.getElementById("align").click();
			break;
		case "Enter":
			//enter acts as click (or as OK in Custom dialogue)
			if (document.activeElement.className == "ddInput") {
				document.getElementById("customOK").click();
			} else {
				document.activeElement.click();
			}
			break;
	}
});

function getScrollbarWidth() {
  // Creating invisible container
  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll'; // forcing scrollbar to appear
  outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
  document.body.appendChild(outer);

  // Creating inner element and placing it in the container
  const inner = document.createElement('div');
  outer.appendChild(inner);

  // Calculating difference between container's full width and the child width
  const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

  // Removing temporary elements from the DOM
  outer.parentNode.removeChild(outer);

  return scrollbarWidth;
}

function saveCookies(type) {
	let d = new Date();
	d.setTime(d.getTime() + (12*31*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = `height=${game.height}; expires=${expires}; SameSite=Strict`;
	document.cookie = `width=${game.width}; expires=${expires}; SameSite=Strict`;
	document.cookie = `mines=${game.mines}; expires=${expires}; SameSite=Strict`;
	document.cookie = `tileScale=${fitScreenState?'fit':document.getElementsByName('tileScale')[0].value}; expires=${expires}; SameSite=Strict`;
	document.cookie = `textScale=${document.getElementsByName('textScale')[0].value}; expires=${expires}; SameSite=Strict`;
	document.cookie = `align=${document.getElementsByTagName("body")[0].style.textAlign}; expires=${expires}; SameSite=Strict`;
	document.cookie = `theme=${document.getElementsByName('themeSelect')[0].value}; expires=${expires}; SameSite=Strict`;
	document.cookie = `cwidth=${document.getElementsByName('width')[0].value}; expires=${expires}; SameSite=Strict`;
	document.cookie = `cheight=${document.getElementsByName('height')[0].value}; expires=${expires}; SameSite=Strict`;
	document.cookie = `cmines=${document.getElementsByName('mines')[0].value}; expires=${expires}; SameSite=Strict`;



}

function loadCookies() {
	let decodedCookie = decodeURIComponent(document.cookie).split('; ').map(a=>a.split('='));

	const values = ["cheight","cmines","cwidth","height","mines","width","align",'theme','textScale','tileScale'];
	values.forEach(v=>{
		const c = decodedCookie.find(c => c[0] == v);
		switch (v) {
			case "cheight":
			case "cmines":
			case "cwidth":
				document.getElementsByName(v.replace('c',''))[0].value = c ? c[1] : 10
				break;
			case "height":
			case "mines":
			case "width":
				if (c) {
					game[v]=parseInt(c[1]);
				}
				break;
			case "align":
				if (c) {
					document.getElementsByTagName("body")[0].style.textAlign = c[1];
					alignBoard();alignBoard();alignBoard(); // yeah this is easier than thinking
				}
				break;
			case 'theme':
				let t = document.getElementsByName('themeSelect')[0];
				t.value = c ? c[1] : 'css/xp.css,css/mines/xp.css,css/xp/favicon.ico,#0155eb';
				console.log(t.value);
				changeTheme(t.value);
				break;
			case 'textScale':
		 		let e =document.getElementsByName('textScale')[0];
				e.value = c ? c[1] : 1;
				setScale(e, true);
				break;
			case 'tileScale':
				if (c && c[1]=='fit') {
					fitScreen(true);
				} else {
					let e = document.getElementsByName('tileScale')[0];
					e.value = c ? c[1] : 1;
					setScale(e, true);
				}
				break;
			}
	});
}
