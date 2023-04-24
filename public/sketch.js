var song;
var fft;
var button;
var xCoords = [];

function preload() {
  song = loadSound('sample/picapau.mp3');
}

function setup() {
  createCanvas(1024, 1024);
  button = createButton('Play');
  button.mousePressed(playSong);
  fft = new p5.FFT(0.9, 64);
  fft.smooth(0.9);
  var spacing = height / 64;
  for (var i = 0; i < 64; i++) {
    xCoords[i] = [];
    for (var j = 0; j < width; j++) {
      xCoords[i][j] = j;
    }
  }
  setInterval(draw, 1000 / 60);
}

function playSong() {
  if (song.isPlaying()) {
    button.html('Play');
    song.pause();
    noLoop();
  } else {
    button.html('Stop');
    song.play();
    loop();
  }
}

function draw() {
  if (song.isPlaying()) {
    background(0);
    noFill();
    stroke(255);
    strokeWeight(1);
    var spectrum = fft.analyze();
    var spacing = height / 64;
    for (var i = 0; i < 128; i++) {
      var amplitude = spectrum[i] * 10;
      var y = (spacing * i) + (height / 32);
      var distortionFactor = 1;
      var yDistortion = map(amplitude, 0, 255, spacing * distortionFactor, -spacing * distortionFactor);
      y += yDistortion;
      var time = song.currentTime();
      var x = map(time, 0, song.duration(), 0, width);
      xCoords[i].push({
        x: x%width,
        y: y
      });
      if (xCoords[i].length > 1 && xCoords[i][xCoords[i].length - 1].x < 0) {
        xCoords[i] = [];
      }
      if (xCoords[i].length > 1) {
        beginShape();
        curveVertex(xCoords[i][0].x, xCoords[i][0].y);
        for (var j = 1; j < xCoords[i].length; j++) {
          curveVertex(xCoords[i][j].x, xCoords[i][j].y);
        }
        endShape();
      }
    }
  } else {
    noLoop();
    button.html('Play')
  }
}
