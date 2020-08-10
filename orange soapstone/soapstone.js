var html_templates = document.getElementById("templates");
var html_categories = document.getElementById("categories");
var html_options = document.getElementById("options");
var image = document.getElementById("image");
var canvas = document.getElementById("output");
var ctx = canvas.getContext("2d");

var croppedcan = document.getElementById("cropped");
var croppedctx = croppedcan.getContext("2d");

var blurcan = document.getElementById("blurmask");
var blurctx = blurcan.getContext("2d");

var noisecan = document.getElementById("noiselayer");
var noisectx = noisecan.getContext("2d");

var noiseImage = noisectx.createImageData(canvas.width, canvas.height);
var noiseData = noiseImage.data;

var selectedtemp = "**** ahead"
var selectedcat = "Characters"
var selectedopt = "Enemy"

var fullstring = ""

var lines = []

var templatesarr = []
var categoriesdict = []

var template_html = ""
var categories_html = ""
var options_html = ""

var images = ['anorLondo.jpg', 'firelinkShrine.jpg', 'lowerUndeadBurg.jpg', 'praiseTheSun.jpg', 'undeadBurg.jpg'];
$("html").css({'background-image': 'url(bg/places/' + images[Math.floor(Math.random() * images.length)] + ')'});

noise.seed(Math.random());
filltemp();
fillcat();
generatenoise();

//fill templates in html
function filltemp() {
	$.getJSON("./templates.json", function( data ) {
		$.when($.each( data, function( key, val ) {
			templatesarr.push(val);
		})).then( () => {
				template_html = "";
				templatesarr.forEach( (thing,id) => {
					var c = ""
				if (thing == selectedtemp) {
					c = "checked";
				}
					var input = "<td><input type='radio' onclick='updateselected()' id='" + thing + "' name= 'templates' "+ c +" />";
					var label = "<label for='" + thing + "'>" + thing + "</label></td><br>";
					template_html+= input + label;
				});
			}).then( () => {
				html_templates.innerHTML = template_html;
				formheight();
			});
	});
}

//fill categories in html
function fillcat() {
	$.getJSON("./categories.json", function( data ) {
		$.when($.each( data, function( k, val ) {
			categoriesdict.push({
		    	key: k,
		   		value: val
		   	});
		})).then( () => {
			categoriesdict.forEach( (thing,id) => {
				var c = ""
				if (thing.key == selectedcat) {
					c = "checked";
				}
				var input = "<td><input onclick='updatecat();fillobj()' type='radio' id='" + thing.key + "' name= 'categories' "+ c +" />";
				var label = "<label for='" + thing.key + "'>" + thing.key + "</label></td><br>";
				categories_html+= input + label;
			});
		}).then( () => {
			html_categories.innerHTML = categories_html;
			fillobj();
		});
	});
}

//fill objects in html
function fillobj() {
	categoriesdict.forEach( (thing) => {
		if (thing.key == selectedcat) {
			options_html = "";
			thing.value.forEach( (v) => {
			var c = ""
			if (v == selectedopt) {
				c = "checked";
			}
			var input = "<td><input type='radio' onclick='updateselected()' id='" + v + "' name= 'options' "+ c +" />";
			var label = "<label for='" + v + "'>" + v + "</label></td><br>";
			options_html += input + label
		});
	}
	});

    html_options.innerHTML = options_html;
}

function updateselected() {
	$("input[type='radio']:checked").each(function() {
       	if ($(this).attr("name") == "templates") {
       		selectedtemp = $("label[for='"+$(this).attr("id")+"']").text();
       	} else if ($(this).attr("name") == "options") {
       		selectedopt = $("label[for='"+$(this).attr("id")+"']").text();
       	}
    });

    generatestring();

}

function updatecat() {
	$("input[type='radio']:checked").each(function() {
		if ($(this).attr("name") == "categories") {
	       	selectedcat = $("label[for='"+$(this).attr("id")+"']").text();
	    }
	});
}

function generatestring() {
	fullstring = capitalizeFirstLetter(selectedtemp.replace(/[*]+/g, selectedopt.toLowerCase()));
	lines = getLines(ctx,fullstring, canvas.width-30);
	drawtocanvas();
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generatenoise() {
	var scale=1.3

	var col1 = [54,-1,-30]
	var col2 = [239,135,58]
	var col3 = [235,218,129]
	var middle = 200

	for (var x = 0; x < canvas.width; x++) {	
		for (var y = 0; y < canvas.height; y++) {
			var value = noise.perlin2((x/100)*scale, (y/100)*scale);
			value+=1;
			value *= 128;

			var value2 = noise.perlin2((x/100)*scale*2, (y/100)*scale*2);
			value2+=1;
			value2 *= 128;

			var value3 = noise.perlin2((x/100)*scale*5, (y/100)*scale*5);
			value3+=1;
			value3 *= 128;


			value+=value2*0.4+value3*0.1;

			var cell = (x + y * canvas.width) * 4;

			if (value<middle) {
				noiseData[cell] = col1[0] + (value)*((col2[0]-col1[0])/middle);
				noiseData[cell + 1] = col1[1] + (value)*((col2[1]-col1[1])/middle);
				noiseData[cell + 2] = col1[2] + (value)*((col2[2]-col1[2])/middle);
			} else {
				noiseData[cell] = col2[0] + (value-middle)*((col3[0]-col2[0])/middle);
				noiseData[cell + 1] = col2[1] + (value-middle)*((col3[1]-col2[1])/middle);
				noiseData[cell + 2] = col2[2] + (value-middle)*((col3[2]-col2[2])/middle);
			}
			
			//data[cell + 3] = mdata[cell + 3]; // alpha.
			noiseData[cell + 3] = 255
		}
	}

	noisectx.putImageData(noiseImage,0,0);
}

function drawtocanvas() {
	croppedcan.width=canvas.width;
	croppedcan.height=canvas.height;

	//blurred outline mask
	blurctx.clearRect(0, 0, canvas.width, canvas.height);
	
	blurctx.font = "100px Message";
	blurctx.lineWidth = 20;
	blurctx.textAlign = "center";
	blurctx.filter = 'url(#displacementFilter) blur(5px)';

	lines.forEach( (line,id) => {
		blurctx.fillText(line, canvas.width/2, canvas.height/2 - (30*(lines.length-1)) + (60*id) + 15);
		blurctx.strokeText(line, canvas.width/2, canvas.height/2 - (30*(lines.length-1)) + (60*id) + 15);
	});

	//combine noise and mask
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(blurcan,0,0);
	ctx.globalCompositeOperation = "source-in";
	ctx.drawImage(noisecan,0,0);
	ctx.globalCompositeOperation = "source-over";

	ctx.font = "100px Message";
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	
	lines.forEach( (line,id) => { 
		ctx.fillText(line, canvas.width/2, canvas.height/2 - (30*(lines.length-1)) + (60*id) + 15);
	});

	//crop
	croppedctx.drawImage(canvas,0,0);
	cropImageFromCanvas(croppedctx);
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function copyImage() {
	//Doesn't keep transparency
	croppedcan.toBlob(blob => {
		navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
	},"image/png");
}

function saveImage() {
	croppedcan.toBlob(function(blob) {
    	saveAs(blob, fullstring + ".png");
	});
}

function formheight() {
	var height = html_templates.offsetHeight;
	html_options.style.height = height + "px";
	html_categories.style.height = height + "px";
}

function cropImageFromCanvas(ctx) {
  var canvas = ctx.canvas, 
    w = canvas.width, h = canvas.height,
    pix = {x:[], y:[]},
    imageData = ctx.getImageData(0,0,canvas.width,canvas.height),
    x, y, index;

  for (y = 0; y < h; y++) {
    for (x = 0; x < w; x++) {
      index = (y * w + x) * 4;
      if (imageData.data[index+3] > 0) {
        pix.x.push(x);
        pix.y.push(y);
      } 
    }
  }
  pix.x.sort(function(a,b){return a-b});
  pix.y.sort(function(a,b){return a-b});
  var n = pix.x.length-1;

  w = 1 + pix.x[n] - pix.x[0];
  h = 1 + pix.y[n] - pix.y[0];
  var cut = ctx.getImageData(pix.x[0], pix.y[0], w, h);

  canvas.width = w;
  canvas.height = h;
  ctx.putImageData(cut, 0, 0);
}

//Font: "Dark Souls Menu Font", SatoriLotus
//Sign font: "Ramadhan Karim", Mikrojihad Typography
//FileSaver.js: eligrey
//noisejs: josephg