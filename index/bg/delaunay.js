//17-9-2020
var canvas = document.getElementById("canvasbg");
var ctx = canvas.getContext("2d");

var lastupdate = Date.now();
var lastdelta = 0;

var hidden = false;

const maxSpeed =0.05;
const minPoints = 3;

points = [];
triangles = new Set;

generatepoints();
findtriangles();

//just so it doesnt look bad if you resize the window
window.addEventListener("resize", function(event) {
	generatepoints();
	findtriangles();
});

document.addEventListener('visibilitychange', function(event) {
  if (document.hidden) {
    hidden=true;
  } else {
    hidden=false;
    lastupdate=Date.now();
    window.requestAnimationFrame(mainloop);
  }
});

function generatepoints() {
	points = [];
	for (i=0;i<50;i++) {
		var x = Math.random()*canvas.width;
		var y = Math.random()*canvas.height;
		var angle = Math.random()*2*3.14159265359;
		var speed = Math.random()*maxSpeed;
		var vx = speed*Math.cos(angle);
		var vy = speed*Math.sin(angle);
		points.push({
			x: x,
			y: y,
			vx: vx,
			vy: vy
		});
	}

	//generate static point ouside of view, just so the edges look nice. Apparently if they are on the same y everything breaks???
	var amount = 5;
	var vdist = canvas.height/amount;
	var hdist = canvas.width/amount;

	for (i=0;i<amount+2;i++) {
		points.push({
			x: -30,
			y: vdist*i+Math.random()*60-30,
			vx:0,
			vy:0
		});
		points.push({
			x: canvas.width+30,
			y: vdist*i+Math.random()*60-30,
			vx: 0,
			vy: 0
		});
	}

	for (i=0;i<amount+2;i++) {
		points.push({
			x: hdist*i+Math.random()*60-30,
			y: -30+Math.random()*10-5,
			vx:0,
			vy:0
		});
		points.push({
			x: vdist*i+Math.random()*60-30,
			y: canvas.height+30+Math.random()*10-5,
			vx: 0,
			vy: 0
		});
	}
}

function mainloop(now) {
	var delta = now - lastupdate;
 	lastupdate = now;

 	delta = Math.max(delta,0);

 	if (delta>60 && lastdelta>60) {
 		for (i=delta-60;i>0;i-=30) {
 			if (points.length>28+minPoints) {
 				points.shift();
 			}
 		}
 	}

 	update(delta);
 	draw();

 	lastdelta = delta;

 	if (!hidden) {
		window.requestAnimationFrame(mainloop);
	}
	
}

function update(delta) {
	points.forEach((p)=>{
		if (p.vx==0 && p.vy==0) {

		} else {
			p.x+=p.vx*delta;
			p.y+=p.vy*delta;

			p.x=(p.x+canvas.width)%canvas.width;
			p.y=(p.y+canvas.height)%canvas.height;
		}
	});

	findtriangles();
}

function draw() {
	ctx.fillStyle = "#181818";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.strokeStyle = "#383838";

	//i am drawing a lot of edges more than once. i dont really care, works fine as is.
	triangles.forEach((triangle)=>{
		var iter = triangle.values();
		var s1 = iter.next().value;
		var s2 = iter.next().value;
		var s3 = iter.next().value;

		ctx.beginPath();
		ctx.moveTo(s1.x, s1.y);
		ctx.lineTo(s2.x, s2.y);
		ctx.lineTo(s3.x, s3.y);
		ctx.closePath();
		ctx.stroke();

		var height = Math.min(Math.max((s1.y+s2.y+s3.y)/3,0),canvas.height-39); //for some reasn if i dont take 39 from the min, white triangles appear at the bottom
		var color = Math.round(56 - (height/canvas.height)*32);
		ctx.fillStyle = "#" + color.toString(16) + color.toString(16) + color.toString(16);
		ctx.fill();
	});

	ctx.fillStyle = "#484848";
	
	points.forEach((p)=>{
		ctx.beginPath();
		ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	});

	ctx.fillStyle = "#383838";
	ctx.font = "bold 15px Verdana";
	ctx.fillText("Delanuay", 10, canvas.height - 10);
}

function findtriangles() {
	triangles = new Set;
	points.forEach((p1,i1)=>{
		points.forEach((p2,i2)=>{
			points.forEach((p3,i3)=>{
				//check they are different points
				if ((i1==i2) || (i1==i3) || (i2==i3)) {
				} else {

					//we only need 2 mediatrixes, the third will intersect in the same place
					//get the middle points
					var m1 = {
						x: p2.x+((p1.x-p2.x)/2),
						y: p2.y+((p1.y-p2.y)/2)
					};
					var m2 = {
						x: p3.x+((p2.x-p3.x)/2),
						y: p3.y+((p2.y-p3.y)/2)
					};

					//get the slopes of the mediatixes
					var s1 = 1/-((p1.y-m1.y)/(p1.x-m1.x));
					var s2 = 1/-((p2.y-m2.y)/(p2.x-m2.x));

					if (s1==s2) {
					}else{

						//get intersection of both lines
						var x = (m1.x*s1-m1.y-m2.x*s2+m2.y)/(s1-s2);
						var y = s1*(x-m1.x)+m1.y;

						//get radius of the cicrle (squared, i need it squared later anyways, this way is faster)
						var r = (p1.x-x)*(p1.x-x)+(p1.y-y)*(p1.y-y);

						//check if there are any points inside the circle
						var inside = points.some((p,i)=>{
							//check the point is not part of this triangle
							if ((i==i1) || (i==i2) || (i==i3)) {
							} else {

								//actual check
								if ((p.x-x)*(p.x-x)+(p.y-y)*(p.y-y)<=r) {
									return true;
								}
							}
						});

						//add to list if nothing inside
						if (inside==false){
							var set = new Set;
							set.add(p1);
							set.add(p2);
							set.add(p3);

							//sets dont have "some" apparently
							var dup = false;
							triangles.forEach((t)=>{
								if (eqSet(t,set)) {
									dup = true;
								}
							});

							if (!dup) {
								triangles.add(set);
							}
						}
					}
				}
			});
		});
	});
}

function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}

window.requestAnimationFrame(mainloop);