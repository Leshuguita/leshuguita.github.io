var deck = [
	{id:1,element:"fire",color:"blue",number:3},
	{id:6,element:"fire",color:"purple",number:6},
	{id:9,element:"fire",color:"yellow",number:2},
	{id:14,element:"snow",color:"orange",number:3},
	{id:17,element:"snow",color:"red",number:2},
	{id:20,element:"snow",color:"yellow",number:7},
	{id:22,element:"water",color:"blue",number:5},
	{id:23,element:"water",color:"green",number:2},
	{id:26,element:"water",color:"purple",number:4},
	{id:73,element:"fire",color:"yellow",number:10},
	{id:89,element:"water",color:"yellow",number:10},
	{id:81,element:"snow",color:"green",number:10}
];

var hand = [];


var canplay = false;

var playedcard;

var points = [];
var otherpoints = [];

function gamesetup() {
	

	shuffledeck();
	gethand();
	canplay = true;
}

function shuffledeck() {
	deck.sort(() => Math.random() - 0.5);
}

function gethand() {
	var h = document.getElementById("ownhand");
	h.innerHTML = "";
	hand = deck.splice(0,5);
	for (i=0;i<5;i++) {
		h.innerHTML +=
		`<div class="owncard" id= ${"own" + i} onclick=${"playcard("+ i +")"}>
			<p>${hand[i].element} ${hand[i].color} ${hand[i].number}</p>
		</div>`;
	}
}

function playcard(id) {
	if (canplay) {
		playedcard = [id,hand[id]];
		deck.push(hand.splice(id, 1)[0]);
		send(playedcard[1]);
		document.getElementById("own"+id).style.visibility = "hidden";
		canplay=false;
	}
}

function replacecard() {
	hand.splice(playedcard[0],0,deck.shift());
	var h = document.getElementById("own"+playedcard[0]);
	h.innerHTML = `<p>${hand[playedcard[0]].element} ${hand[playedcard[0]].color} ${hand[playedcard[0]].number}</p>`
	h.style.visibility="";
	playedcard=[];
	recievedcard=null;
	canplay=true;
}