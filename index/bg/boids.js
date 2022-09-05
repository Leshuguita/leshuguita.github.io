//9-9-2020
const pi = Math.PI;
var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

var lastupdate = Date.now();
var lastdelta = 0;

var mouse = {x:0,y:0};

const boidamount = 500;
const minboid = 20;

const boidsize = 3;
const avoidrad = 15;
const alignrad = 40;
const approachrad = 100;
const sightangle = 120;
const minspeed = 70;
const maxspeed = 90;
const alignstr = 0.0002;
const cohstr = 0.0005;
const avoidstr = 0.002;

const mouserad = 30;
const mousestr = 0.005;

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

		newBoid();
	}
}

function mainloop(now) {
	var delta = now - lastupdate;
 	lastupdate = now;

 	delta = Math.max(delta,0);

 	if (delta>30 && lastdelta>30) {
 		for (i=delta-30;i>0;i-=10) {
 			if (boids.length>minboid) {
 				boids.pop();
 			}
 		}
 	}

 	update(delta);
 	draw();

 	lastdelta=delta;

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
					var d=distsq(boid.x,boid.y,b.x,b.y);
					if (d<avoidrad*avoidrad) {
						avoidb.push(b);
					}
					if (d<approachrad*approachrad) {
						approachb.push(b);
					}
					if (d<alignrad*alignrad) {
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

		boid.life++

		boid.x+=Math.cos(boid.dir)*boid.speed*delta;
		boid.y+=Math.sin(boid.dir)*boid.speed*delta;
	});
}

function followmouse(boid,delta) {
	var d = distsq(boid.x,boid.y,mouse.x,mouse.y);
	if (d<mouserad*mouserad) {
		var angleto = fatan2(mouse.y - boid.y, mouse.x - boid.x);
		boid.dir+=topi((angleto-boid.dir)+pi)*mousestr*delta*(d/(mouserad*mouserad));
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
		boid.dir+=topi((angleto-boid.dir)+pi)*avoidstr*delta*(distsq(boid.x,boid.y,b.x,b.y)/(avoidrad*avoidrad));
	});
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

	ctx.fillStyle = "#181926";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.fillStyle = "#363a4f";

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
	ctx.fillText("Boids", 10, window.innerHeight - 10);

}

function topi(r) {
	return fatan2(Math.sin(r),Math.cos(r));
}

function distsq(x,y,x2,y2) {
	return (x-x2)*(x-x2)+(y-y2)*(y-y2);
}

function lerp(value1, value2, amount) {
	amount = amount < 0 ? 0 : amount;
	amount = amount > 1 ? 1 : amount;
	return (1 - amount) * value1 + amount * value2;
}

function newBoid() {
	var boid = {
		x:Math.random()*canvas.width,
		y:Math.random()*canvas.height,
		dir:topi(Math.random()*2*pi),
		speed:(minspeed + Math.random()*(maxspeed-minspeed))/1000,
	};

	boids.push(boid);
}
window.requestAnimationFrame(mainloop);
