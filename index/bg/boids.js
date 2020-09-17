//9-9-2020
const pi = Math.PI;
var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

var lastupdate = Date.now();

var mouse = {x:0,y:0};

var boidamount = 500;

var boidsize = 3;
var avoidrad = 15;
var alignrad = 40;
var approachrad = 100;
var sightangle = 120;
var minspeed = 80;
var maxspeed = 100;
var alignstr = 0.0002;
var cohstr = 0.0005;
var avoidstr = 0.002;

var mouserad = 30;
var mousestr = 0.005;

var boids = [];
var copyb = [];

var hidden = false;

init();

window.onmousemove = function (){
    mouse.x = window.event.clientX;
    mouse.y = window.event.clientY;
}

document.addEventListener('visibilitychange', function(event) {
  if (document.hidden) {
    hidden=true;
  } else {
    hidden=false;
    lastupdate=Date.now();
    window.requestAnimationFrame(mainloop);
  }
});

function init() {
	for (i=1;i<=boidamount;i++) {

		var boid = {
			x:Math.random()*canvas.width,
			y:Math.random()*canvas.height,
			dir:topi(Math.random()*2*pi),
			speed:(minspeed + Math.random()*(maxspeed-minspeed))/1000,
		};

		boids.push(boid);
	}
}

function mainloop(now) {
	var delta = now - lastupdate;
 	lastupdate = now;

 	delta = Math.max(delta,0);

 	if (delta>60) {
 		boids.pop();
 	}

 	update(delta);
 	draw();

 	if (!hidden) {
		window.requestAnimationFrame(mainloop);
	}
}

function update(delta) {
	copyb = JSON.parse(JSON.stringify(boids))

	boids.forEach((boid, id) => {
		boid.dir=topi(boid.dir);
		var avoidb = [];
		var approachb = [];
		var alignb = [];

		copyb.forEach((b,i) => {
			if (id!=i) {
				var a = sightangle*pi/180;
				var c = fatan2(b.y - boid.y, b.x - boid.x)
				if (c < boid.dir+a || c > boid.dir-a) {
					var d=dist(boid.x,boid.y,b.x,b.y);
					if (d<avoidrad) {
						avoidb.push(b);	
					}
					if (d<approachrad) {
						approachb.push(b);	
					}
					if (d<alignrad) {
						alignb.push(b);	
					}
				}
			}
		});

		align(boid,alignb,delta);
		avoid(boid,avoidb,delta);
		cohesion(boid,approachb,delta);

		avoidwalls(boid,delta);
		followmouse(boid,delta);

		boid.x+=Math.cos(boid.dir)*boid.speed*delta;
		boid.y+=Math.sin(boid.dir)*boid.speed*delta;
	});
}

function followmouse(boid,delta) {
	var d = dist(boid.x,boid.y,mouse.x,mouse.y);
	if (d<mouserad) {
		var angleto = fatan2(mouse.y - boid.y, mouse.x - boid.x);
		boid.dir+=topi((angleto-boid.dir)+pi)*mousestr*delta*(d/mouserad);
	}
}

function avoidwalls(boid,delta) {
	boid.x=(boid.x+canvas.width)%canvas.width;
	boid.y=(boid.y+canvas.height)%canvas.height;

}

function cohesion(boid,near,delta) {
	if (near.length>0) {
		var averagepos = {x:0,y:0};
		near.forEach( (b) => {
			averagepos.x += b.x;
			averagepos.y += b.y;
		});
		averagepos.x/=near.length;
		averagepos.y/=near.length;

		var angleto = topi(fatan2(averagepos.y - boid.y,averagepos.x - boid.x));
		boid.dir += topi(angleto-boid.dir)*cohstr*delta;
	}
}

function align(boid,near,delta) {
	near.forEach( (b) => {
		boid.dir += topi(b.dir - boid.dir)*alignstr*delta;
	});
}

function avoid(boid,near,delta) {
	near.forEach( (b) => {
		var angleto = topi(fatan2(b.y - boid.y, b.x - boid.x));
		boid.dir+=topi((angleto-boid.dir)+pi)*avoidstr*delta*(dist(boid.x,boid.y,b.x,b.y)/avoidrad);
	});
}

function topi(x) {
	return x%(2*pi)-pi;
}

function fatan2(y,x) {
	var ax = Math.abs(x);
	var ay = Math.abs(y);
	var a = Math.min(ax, ay) / Math.max(ax, ay);
	var s = a * a;
	var r = ((-0.0464964749 * s + 0.15931422) * s - 0.327622764) * s * a + a;
	if (Math.abs(y) > Math.abs(x)) {
		r = 1.57079637 - r
	}
	if (x < 0) {
		r = 3.14159274 - r
	}
	if (y < 0) {
		r = -r
	}
	return r;
}

function draw() {
	
	ctx.fillStyle = "#181818";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	ctx.fillStyle = "#383838";

	boids.forEach((boid, id) => {
		//Triangle
		ctx.beginPath();
		ctx.moveTo(boid.x+2*boidsize*Math.cos(boid.dir),boid.y+2*boidsize*Math.sin(boid.dir));
		ctx.lineTo(boid.x+2*boidsize*Math.cos(boid.dir+4*pi/5),boid.y+2*boidsize*Math.sin(boid.dir+4*pi/5));
		ctx.lineTo(boid.x+boidsize*Math.cos(boid.dir + pi),boid.y+boidsize*Math.sin(boid.dir + pi));
		ctx.lineTo(boid.x+2*boidsize*Math.cos(boid.dir-4*pi/5),boid.y+2*boidsize*Math.sin(boid.dir-4*pi/5));
		ctx.closePath();
		ctx.fill();

	});

	ctx.font = "bold 15px Verdana";
	ctx.fillText("Boids", 10, canvas.height - 10);

}

function topi(r) {
	return fatan2(Math.sin(r),Math.cos(r));
}

function dist(x,y,x2,y2) {
	return Math.hypot(x-x2,y-y2);
}

function lerp(value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return (1 - amount) * value1 + amount * value2;
}

window.requestAnimationFrame(mainloop);