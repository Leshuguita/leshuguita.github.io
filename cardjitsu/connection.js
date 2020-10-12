var peer = new Peer(); 

var conn;

var recievedcard;

peer.on('open', function(id) {
  console.log('My peer ID is: ' + id);
  document.getElementById("myid").innerHTML = peer.id;
});

//only when recieving a connection
peer.on('connection', function(con) {
	conn = con;
	setupconn();
});

peer.on('error', function(err) {
	console.log(err);
});


function connect() {
	var val = document.getElementById("targetid").value;
	if (peer.id == val) {
		console.log("Cannot connect to self!")
		return;
	}
	if (peer.id == null) {
		console.log("Peer not ready yet!")
		return;
	}
	if (val=="") {
		console.log("You have to specify someone to connect to!")
		return;
	}

	conn = peer.connect(val);
	setupconn();
	
}

function send(data) {
	try {
		conn.send(data);
	} catch(e) {
		console.log(e);
	}
}

function setupconn() {
	document.getElementById("connectionUI").style.display="none"
	console.log("connected to " + conn.peer);

	gamesetup();

	conn.on('data', function(data) {
		//recieve data
		console.log('Received', data);
		if (data.element!=null) {
			recievedcard = data;
		}
	});
}