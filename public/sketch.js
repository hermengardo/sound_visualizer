var song;
var fft;
var button;
var xCoords = [];

function preload() {
  song = loadSound('sample/caminho-do-crusp-ônibus.mp3');
}

function setup () {
  createCanvas(1024, 1024);
  button = createButton('Play');
  button.mousePressed(toggle);
  fft = new p5.FFT(0.9, 32);
  // Initialize x-coordinates array
  var spacing = height / 32; // distribute the lines equally across the canvas
  for (var i = 0; i < 32; i++) { // Distribute the lines
    xCoords[i] = [];
    for (var j = 0; j < width; j++) {
      xCoords[i][j] = j
    }
  }
}

function toggle() {
  if (song.isPlaying()) {
    song.pause();
    noLoop(); // Stop the animation
  }
  else {
    song.play();
    loop(); // Resume the animation
  }
}

function draw() {
  if (song.isPlaying()) {
    background(0);
    noFill();
    var spectrum = fft.analyze();
    var spacing = height / 32;

    for (var i = 0; i < 32; i++) {
      var amplitude = spectrum[i];
      var y = (spacing * i) + (height / 64); // reverse y-axis and spacing
      var distortionFactor = 3.2;
      var yDistortion = map(distortionFactor * amplitude, 0, 255, -spacing / 2, spacing / 2);
      y += yDistortion;

      var time = song.currentTime();
      var x = map(time, 0, song.duration(), 0, width);
      xCoords[i].push({x: x, y: y});

      if (xCoords[i].length > 1) {
        stroke(255);
        strokeWeight(2);
        noFill();
        beginShape();
        for (var j = 0; j < xCoords[i].length; j++) {
          vertex(xCoords[i][j].x, xCoords[i][j].y);
        }
        endShape();
      }

      while (xCoords[i].length > 0 && xCoords[i][0].x < 0) {
        xCoords[i].shift();
      }
    }
  } else {
    noLoop();
  }
}
