var html_templates = document.getElementById("templates");
var html_categories = document.getElementById("categories");
var html_options = document.getElementById("options");
var html_conjunctions = document.getElementById("conjf");
var html_maintable = document.getElementById("lines");
var html_contable = document.getElementById("conjt");
var canvas = document.getElementById("output");
var ctx = canvas.getContext("2d");

var croppedcan = document.getElementById("cropped");
var croppedctx = croppedcan.getContext("2d");

var blurcan = document.getElementById("blurmask");
var blurctx = blurcan.getContext("2d");

var noisecan = document.getElementById("noiselayer");
var noisectx = noisecan.getContext("2d");

var canvassize = {
	one: {width:600,height:300},
	two: {width:800,height:400}
}

var noiseImage = noisectx.createImageData(canvas.width, canvas.height);
var noiseData = noiseImage.data;

var data;

var currentPhrase = 0;
var usetwo = false;

var imgStyle = "floor";

var selectedtemp = "**** ahead";
var selectedcat = "Characters";
var selectedopt = "Enemy";

var selectedcon = "And then";

var selectedtemp2 = "**** ahead";
var selectedcat2 = "Characters";
var selectedopt2 = "Enemy";

var fullstring = "";

var lines = [];

var signfont = "message";

var template_html = "";
var categories_html = "";
var options_html = "";

var images = ['anorLondo.webp', 'firelinkShrine.webp', 'lowerUndeadBurg.webp', 'praiseTheSun.webp', 'undeadBurg.webp', 'firelinkShrineDS3.webp','banner.webp','ariandel.webp','ariamis.webp'];
$("html").css({'background-image': 'url(bg/places/' + images[Math.floor(Math.random() * images.length)] + ')'});


getdata().catch(e => console.log(e)).then( (v) => {
	filltemp();
	fillcat();
	fillcon();
	formheight();
});
useTwo();
noise.seed(Math.random());
generatenoise();
changeTabs("first");

async function getdata() {
	await $.getJSON("./data.json", d => {
		data = d;
	})
}
//fill templates in html
async function filltemp() {
	template_html = "";
	data.templates.forEach( (thing) => {
		var c = ""
		if (thing == selectedtemp) {
			c = "checked";
		}
		var input = "<td><input type='radio' class='tableInp' onclick='updateselected()' id='" + thing + "' name= 'templates' "+ c +" />";
		var label = "<label class='tableLabel' for='" + thing + "'>" + thing + "</label></td><br>";
		template_html+= input + label;
	});

	html_templates.innerHTML = template_html;
}

//fill categories in html
async function fillcat() {
	categories_html = "";
	var cat = selectedcat;
	if (currentPhrase==1) {
		cat = selectedcat2;
	}
	Object.keys(data.categories).forEach( (key) => {
		var c = ""
		if (key == cat) {
			c = "checked";
		}
		var input = "<td><input onclick='updatecat();fillobj()' type='radio' class='tableInp' id='" + key + "' name= 'categories' "+ c +" />";
		var label = "<label class='tableLabel' for='" + key + "'>" + key + "</label></td><br>";
		categories_html+= input + label;
	});

	html_categories.innerHTML = categories_html;
	fillobj();
}

//fill objects in html
function fillobj() {
	var cat = selectedcat;
	if (currentPhrase==1) {
		cat = selectedcat2;
	}
	var opt = selectedopt;
	if (currentPhrase==1) {
		opt = selectedopt2;
	}

	Object.keys(data.categories).forEach( (key) => {
		if (key == cat) {
			options_html = "";
			data.categories[key].forEach( (v) => {
				var c = ""
				if (v == opt) {
					c = "checked";
				}
				var input = "<td><input type='radio' onclick='updateselected()' class='tableInp' id='" + v + "' name= 'options' "+ c +" />";
				var label = "<label class='tableLabel' for='" + v + "'>" + v + "</label></td><br>";
				options_html += input + label
			});
		}
	});

    html_options.innerHTML = options_html;
}

//fill conjunctions in html
async function fillcon() {
	conjunctions_html = "";
	data.conjunctions.forEach( (thing) => {
		var c = ""
		if (thing == selectedcon) {
			c = "checked";
		}
		var input = "<td><input type='radio' class='tableInp' onclick='updateselected()' id='" + thing + "' name= 'conjunctions' "+ c +" />";
		var label = "<label class='tableLabel' for='" + thing + "'>" + thing + "</label></td><br>";
		conjunctions_html+= input + label;
	});

	html_conjunctions.innerHTML = conjunctions_html;
}

async function updateselected() {
	$("input[type='radio']:checked").each(function() {
       	if ($(this).attr("name") == "templates") {
       		if (currentPhrase == 1) {
       			selectedtemp2 = $("label[for='"+$(this).attr("id")+"']").text();
       		} else {
       			selectedtemp = $("label[for='"+$(this).attr("id")+"']").text();
       		}
       	} else if ($(this).attr("name") == "options") {
       		if (currentPhrase == 1) {
       			selectedopt2 = $("label[for='"+$(this).attr("id")+"']").text();
       		} else {
       			selectedopt = $("label[for='"+$(this).attr("id")+"']").text();
       		}
       	} else if ($(this).attr("name") == "conjunctions") {
       		selectedcon = $("label[for='"+$(this).attr("id")+"']").text();
       	}
    });

    usetwo = $('#usetwo').is(":checked");

    generatestring();

}

function updatecat() {
	$("input[type='radio']:checked").each(function() {
		if ($(this).attr("name") == "categories") {
			if (currentPhrase == 1) {
				selectedcat2 = $("label[for='"+$(this).attr("id")+"']").text();
			} else {
	       		selectedcat = $("label[for='"+$(this).attr("id")+"']").text();
	    	}
	    }
	});
}

function generatestring() {
	var w = canvassize.one.width
	fullstring = capitalizeFirstLetter(selectedtemp.replace(/[*]+/g, selectedopt.toLowerCase()));
	if (usetwo) {
		fullstring += (" "+selectedcon.toLowerCase()+" ").replace(" , ", ", ");
		fullstring += selectedtemp2.toLowerCase().replace(/[*]+/g, selectedopt2.toLowerCase());

		w = canvassize.two.width
	}

	fullstring = fullstring.replace(/(\u200B\S)|((\?|\!|\.)\s\S)/g, s => s.toUpperCase());

	lines = getLines(ctx,fullstring, w-50);
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
	if (usetwo) {
		canvas.width = canvassize.two.width;
		canvas.height = canvassize.two.height;
	} else {
		canvas.width = canvassize.one.width;
		canvas.height = canvassize.one.height;
	}

	blurcan.width = canvas.width;
	blurcan.height = canvas.height;

	if (imgStyle=="floor") {
		drawFloor();
	}

	//crop
	croppedctx.drawImage(canvas,0,0);
	cropImageFromCanvas(croppedctx);
}

function drawFloor() {
	noisecan.width = canvas.width;
	noisecan.height = canvas.height;
	noiseImage = noisectx.createImageData(canvas.width, canvas.height);
	noiseData = noiseImage.data;
	generatenoise();

	croppedcan.width=canvas.width;
	croppedcan.height=canvas.height;

	//blurred outline mask
	blurctx.clearRect(0, 0, canvas.width, canvas.height);
	
	blurctx.font = "100px " + signfont;
	blurctx.lineWidth = 20;
	blurctx.textAlign = "center";
	blurctx.filter = 'url(#displacementFilter) blur(5px)';

	lines.forEach( (line,id) => {
		blurctx.fillText(line, canvas.width/2, canvas.height/2 - (36*(lines.length-1)) + (72*id) + 18);
		blurctx.strokeText(line, canvas.width/2, canvas.height/2 - (36*(lines.length-1)) + (72*id) + 18);
	});

	//combine noise and mask
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.drawImage(blurcan,0,0);
	ctx.globalCompositeOperation = "source-in";
	ctx.drawImage(noisecan,0,0);
	ctx.globalCompositeOperation = "source-over";

	ctx.font = "100px " + signfont;
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	
	lines.forEach( (line,id) => { 
		ctx.fillText(line, canvas.width/2, canvas.height/2 - (36*(lines.length-1)) + (72*id) + 18);
	});
}

function drawMenu() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	if (!document.getElementById("ds1t").disabled) {
		var img = fetch("/menumsg/ds1base.webp").then(blob => ctx.drawImage(blob,0,0));
		canvas.width = img.width;
		canvas.height = img.height;
		//ctx.drawImage(img,0,0);
	}
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
	var height = document.getElementById("topRight").offsetHeight + document.getElementById("bottomRight").offsetHeight;
	html_options.style.height = height + "px";
	html_categories.style.height = height + "px";
	html_templates.style.height = height + "px";
	html_conjunctions.style.height = height + "px";
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

function changeTabs(tab) {
	if (tab=="first") {
		html_maintable.style.display = "table";
		html_contable.style.display = "none";
		document.getElementById("first").style.backgroundImage = "var(--selected)";
		document.getElementById("second").style.backgroundImage = "none";
		document.getElementById("conjtab").style.backgroundImage = "none";
		currentPhrase = 0;
	} else if (tab=="second") {
		html_maintable.style.display = "table";
		html_contable.style.display = "none";
		document.getElementById("first").style.backgroundImage = "none";
		document.getElementById("second").style.backgroundImage = "var(--selected)";
		document.getElementById("conjtab").style.backgroundImage = "none";
		currentPhrase = 1;
	} else if (tab=="conj") {
		html_maintable.style.display = "none";
		html_contable.style.display = "table";
		document.getElementById("first").style.backgroundImage = "none";
		document.getElementById("second").style.backgroundImage = "none";
		document.getElementById("conjtab").style.backgroundImage = "var(--selected)";
	}
	//reset temps
	$('input:radio[name=templates]').each(function () { 
		if (currentPhrase == 1) {
				if ($(this).prop('id') == selectedtemp2) {
					$(this).prop('checked', true);
				} else {
					$(this).prop('checked', false);
				}
			} else {
	       		if ($(this).prop('id') == selectedtemp) {
					$(this).prop('checked', true);
				} else {
					$(this).prop('checked', false);
				}
	    	}
		
	});
	//reset cats
	$('input:radio[name=categories]').each(function () { 
		if (currentPhrase == 1) {
				if ($(this).prop('id') == selectedcat2) {
					$(this).prop('checked', true);
				} else {
					$(this).prop('checked', false);
				}
			} else {
	       		if ($(this).prop('id') == selectedcat) {
					$(this).prop('checked', true);
				} else {
					$(this).prop('checked', false);
				}
	    	}
		
	});

	if(data) {
		fillobj();
	}
	updateselected();
}

function useTwo() {
	var b = document.getElementById("usetwolabel")
	updateselected();
	if (usetwo) {
		b.style.backgroundImage = "var(--selected)";
		b.innerHTML = "Use one";
		document.getElementById("second").disabled = false;
		document.getElementById("second").style.color = "";
		document.getElementById("conjtab").disabled = false;
		document.getElementById("conjtab").style.color = "";
	} else {
		b.style.backgroundImage = "none";
		b.innerHTML = "Use two";
		document.getElementById("second").disabled = true;
		document.getElementById("second").style.color = "gray";
		document.getElementById("conjtab").disabled = true;
		document.getElementById("conjtab").style.color = "gray";
		if (currentPhrase!=0) {
			changeTabs("first");
		}
	}
}

//Font: "Dark Souls Menu Font", SatoriLotus
//Sign font: "Ramadhan Karim", Mikrojihad Typography
//FileSaver.js: eligrey
//noisejs: josephg