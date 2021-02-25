//fecha aqui
var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

var hidden=false;

var lastupdate = Date.now();


var possiblechars = [0x003A,0x002E,0x0022,0x003D,0x00B7,0x002A,0x002B,0x002D,0x003C,0x003E,0x0030,0x0031,0x0032,0x0033,0x0034,0x0035,0x0036,0x0037,0x0038,0x0039,0xFF88,0xFF7D,0xFF80,0xFF87,0xFF8D,0xFF79,0xFF92,0xFF74,0xFF76,0xFF77,0xFF91,0xFF95,0xFF97,0xFF7E,0xFF8A,0xFF90,0xFF8B,0xFF70,0xFF73,0xFF7C,0xFF85,0xFF93,0xFF86,0xFF7B,0xFF78,0xFF82,0xFF75,0xFF98,0xFF8E,0xFF83,0xFF8F,0xFF71,];
//ASCII in hex because halfwidth katakana

var cellwidth=15
var cellheight=30
//cells: 15px*30px

var columns = [];
var drops = [];
//One drop per column seems fine. Good, it's easier

init();

document.addEventListener('visibilitychange', function(event) {
  if (document.hidden) {
    hidden=true;
  } else {
    hidden=false;
    lastupdate=Date.now();
    window.requestAnimationFrame(mainloop);
  }
});

function makeColumns() {
	var cols = Math.floor(canvas.width/cellwidth) + 1;
	for (i = 0; i < cols; i++) {
		columns.push(makeRow());
		drops.push({
			y:0,
			length:0,
			speed:0
		})
	}
}

function makeRow() {
	var rows = Math.floor(canvas.height/cellheight)+1;
	var row = [];
	for (o = 0; o < rows; o++) {
		var ch = {
			character: possiblechars[Math.floor(Math.random()*possiblechars.length)],
			timer: 1000+Math.floor(Math.random()*3600),
			state: 0,
			//0=off,1=fade,2=normal,3=white
		}
		row.push(ch);
	}
	return row;
}

function init() {
	makeColumns();

	//generate drops
	drops.forEach((drop,id)=>{
		addDrop(id);
	});
}

function mainloop(now) {
	var delta = now - lastupdate;
 	lastupdate = now;

 	delta = Math.max(delta,0);

 	update(delta);
 	draw();

 	if (!hidden) {
		window.requestAnimationFrame(mainloop);
	}
}

function update(delta) {
	//update char timers
	columns.forEach((row,x)=>{
		row.forEach((ch,y)=>{
			if (ch.timer<=0) {
				ch.timer = 1000+Math.floor(Math.random()*3600);
				ch.character = possiblechars[Math.floor(Math.random()*possiblechars.length)];
			} else {
				ch.timer=ch.timer-delta;
			}
		});
	});

	//update drops
	drops.forEach((drop,id)=>{
		drop.y=drop.y+drop.speed*delta;
		if (drop.y-drop.length*cellheight > canvas.height) {
			addDrop(id);
		}
	});

	//update char state
	columns.forEach((row,x)=>{
		row.forEach((ch,y)=>{
			var drop = drops[x];
			if (y*cellheight<=drop.y) {
					
				if (y*cellheight>=drop.y-cellheight) {
					ch.state = 3
				} else if (y*cellheight>=drop.y-3*(drop.length*cellheight)/4) {
					ch.state = 2
				} else if (y*cellheight>=drop.y-drop.length*cellheight) {
					ch.state = 1
				} else {
					ch.state = 0
				}
			} else {
				ch.state = 0
			}
		});
	});

}

function draw() {
	
	ctx.fillStyle = "#181818";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	
	ctx.textAlign = "center";
	ctx.font = "bold 25px Lucida Console";
	columns.forEach((row,x)=>{
		row.forEach((ch,y)=>{

			if (ch.state == 3) {
				ctx.fillStyle = "#585858";
			} else if (ch.state == 2) {
				ctx.fillStyle = "#383838";
			} else if (ch.state == 1) {
				ctx.fillStyle = "#282828";
			} else {
				ctx.fillStyle = "#181818";
			}

			ctx.fillText(String.fromCharCode(ch.character),x*cellwidth+cellwidth/2,y*cellheight);
		})
	})
	
	ctx.fillStyle = "#383838";

	ctx.textAlign = "left";
	ctx.font = "bold 15px Verdana";
	ctx.fillText("Digital Rain", 10, window.innerHeight - 10);

}

function addDrop(index) {
	var drop = {
		y:0,
		length:5+Math.floor(Math.random()*15),
		speed:0.01+Math.random()*0.3
	}

	drops[index] = drop;
}

window.requestAnimationFrame(mainloop);