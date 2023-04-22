var song;
var fft;
var button;
var xCoords = [];
var displacements = [];

function preload() {
  song = loadSound('sample/cardinal.mp3');
}

function setup() {
  createCanvas(256, 256);
  colorMode(HSB);
  angleMode(DEGREES);
  button = createButton('play');
  button.mousePressed(toggle);
  fft = new p5.FFT(0.9, 16);

  // Initialize y-coordinates array
  var numPoints = width;
  var pointSpacing = width / numPoints;
  for (var i = 0; i < 16; i++) {
    xCoords[i] = [];
    displacements[i] = 0; // set initial displacement to zero
    for (var j = 0; j < numPoints; j++) {
      xCoords[i][j] = j * pointSpacing;
    }
  }
}

function toggle() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function draw() {
  background(0);
  noFill();
  var spectrum = fft.analyze();
  var spacing = height / (16 + 1); // adjust spacing to center the 16 lines
  var numPoints = width;
  var pointSpacing = width / numPoints;
  var amplitudeFactor = 5;
  for (var i = 0; i < 16; i++) {
    var amplitude = spectrum[i];
    var displacement = map(amplitude, 0, 255, 0, amplitudeFactor);
    displacements[i] = lerp(displacements[i], displacement, 0.1);
    stroke(255);
    beginShape();
    curveVertex(xCoords[i][0], spacing * (i + 1)); // adjust y-coordinates to center the lines
    for (var j = 1; j < numPoints - 1; j++) {
      var x = xCoords[i][j];
      var y = spacing * (i + 1) + displacements[i] * sin(map(x, 0, width, 0, 360));
      curveVertex(x, y);
    }
    curveVertex(xCoords[i][numPoints - 1], spacing * (i + 1)); // adjust y-coordinates to center the lines
    endShape();
  }
}
