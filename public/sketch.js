var song;
var fft;
var button;
var xCoords = [];
var displacements = [];
var finalPositions = []; // Array to store the final positions of the lines


function preload() {
  song = loadSound('sample/cardinal.mp3');
}

function setup () {
  createCanvas(256, 256);
  colorMode(HSB);
  angleMode(DEGREES);
  button = createButton('play');
  button.mousePressed(toggle);
  fft = new p5.FFT(0.9, 16);

  // Initialize y-coordinates array
  var numPoints = width;
  var pointSpacing = width/numPoints;
  for (var i = 0; i < 16; i++) {
    xCoords[i] = [];
    displacements[i] = 0; // Set each displacement to 0
    for (var j = 0; j < numPoints; j++) {
      xCoords[i][j] = j * pointSpacing;
    }
  }
}

function toggle() {
  if (song.isPlaying()) {
    song.pause();
    noLoop(); // Stop the animation
    finalPositions = []; // Clear the final positions array
    for (var i = 0; i < 16; i++) {
      finalPositions[i] = displacements[i]; // Store the final position of each line
    }
    for (var i = 0; i < 16; i++) {
      displacements[i] = finalPositions[i]; // Set the current position of each line to the final position
    }
  }
  else {
    song.play();
    loop(); // Resume the animation
  }
}

function draw() {
  background(0);
  noFill();
  var spectrum = fft.analyze();
  var spacing = height/16;
  var numPoints = width;
  var pointSpacing = width/numPoints;
  var amplitudeFactor = 0.01;
  for (var i = 0; i < 16; i++) {
    var amplitude = spectrum[i];
    var displacement = map(amplitude, 0, 255, 0, amplitudeFactor);
    displacements[i] += displacement;
    stroke(255);
    beginShape();
    curveVertex(xCoords[i][0], spacing * i);
    for (var j = 1; j < numPoints-1; j++) {
      var x = xCoords[i][j];
      var y = spacing * i + displacements[i] * random(-1, 1); // Replace sin() with random()
      curveVertex(x, y);
    }
    curveVertex(xCoords[i][numPoints-1], spacing * i);
    endShape();
  }
}
