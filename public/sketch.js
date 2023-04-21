var song;
var amp;
var button;

function toggleSong() {
	if (song.isPlaying()) {
		song.pause();
	}
	else {
		song.play();
	}
}

function preload() {
	song = loadSound('sample/cardinal.mp3');
}

function setup(){
	createCanvas(200, 200);
	button = createButton("Tocar");
	button.mousePressed(toggleSong);
	button2 = createButton("Pular");
	button2.mousePressed(jumpButton);
	song.play();
	amp = new p5.Amplitude();
}

function jumpButton(){
	var len = song.duration();
	song.jump(random(len));
}

function draw() {
	background(0);
	var vol = amp.getLevel();
	ellipse(100, 100, vol*200, vol*200);
	console.log(vol);
}