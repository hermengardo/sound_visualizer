let song;
let fft;
let buttonFile;
let playButton;
let distortionSlider;
let widthSizeSlider;
let heightSizeSlider;
let loadingMsg;
let distortionLegend;
let widthSizeLegend;
let heightSizeLegend;
let FFTBinsSelect
let FFTBinsLegend;
let smoothSlider;
let smoothLegend;
const xCoords = new Array(1024).fill().map(() => []);

function preload() {
  song = loadSound('sample/cardinal.mp3');
}

function setup() {
  createCanvas(1024, 1024);
  background(0)
  buttonFile = createButton('Load');
  buttonFile.position(width / 2 - 170, height / 2 - 60);
  buttonFile.mousePressed(addSong);
  playButton = createButton('Play');
  playButton.position(width / 2 - 170, height / 2 - 30);
  playButton.mousePressed(toggleSong);
  playButton.attribute('disabled', true); // disable Play button until a song is loaded
  
  // Distortion slider with legend
  distortionLegend = createDiv('Distortion Factor');
  distortionLegend.style('color', '#fff');
  distortionLegend.position(width / 2 - 170, height / 2 + 1);
  distortionSlider = createSlider(1, 20, 1, 1);
  distortionSlider.position(width / 2 - 50, height / 2);
  
  // Width size slider with legend
  widthSizeLegend = createDiv('Width Size');
  widthSizeLegend.style('color', '#fff');
  widthSizeLegend.position(width / 2 - 170, height / 2 + 41);
  widthSizeSlider = createSlider(512, 2048, 1024, 32);
  widthSizeSlider.position(width / 2 - 50, height / 2 + 40);
  
  // Height size slider with legend
  heightSizeLegend = createDiv('Height Size');
  heightSizeLegend.style('color', '#fff');
  heightSizeLegend.position(width / 2 - 170, height / 2 + 81);
  heightSizeSlider = createSlider(512, 2048, 1024, 32);
  heightSizeSlider.position(width / 2 - 50, height / 2 + 80);

  // Height size slider with legend
  smoothLegend = createDiv('FFT Smoothing');
  smoothLegend.style('color', '#fff');
  smoothLegend.position(width / 2 - 170, height / 2 + 121);
  smoothSlider = createSlider(0, 1, 0.5, 0.1);
  smoothSlider.position(width / 2 - 50, height / 2 + 120);

  // FFT bins
  FFTBinsLegend = createDiv('FFT Bins');
  FFTBinsLegend.style('color', '#fff');
  FFTBinsLegend.position(width / 2 - 170, height / 2 + 161);
  FFTBinsSelect = createSelect();
  FFTBinsSelect.position(width / 2 - 50, height / 2 + 160);
  // Add options for powers of two
  for (let i = 1; i <= 10; i++) {
    const value = Math.pow(2, i);
    FFTBinsSelect.option(value);
  }
  FFTBinsSelect.selected(16);
  setInterval(drawSpectrum, 30);
}

function toggleSong() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
    playButton.html('Play');
  } else {
    song.play();
    loop();
    playButton.html('Stop');
    fft = new p5.FFT(smoothSlider.value(), FFTBinsSelect.value())
  }
}

function addSong() {
  var fileInput = createFileInput(function(file) {
    if (file.type === 'audio') {
      loadingMsg = createElement('p', 'Loading song...');
      loadingMsg.style('color', '#fff');
      loadingMsg.style('text-align', 'center');
      loadingMsg.position(width / 2 - 170, height / 2 + 180);
      song = loadSound(file.data, function() {
        console.log('Song loaded successfully');
        playButton.html('Play');
        loop();
        playButton.removeAttribute('disabled');
        loadingMsg.remove(); // remove loading message
      });
    } else {
      console.log('Invalid file type');
    }
  });
  fileInput.attribute('accept', 'audio/*');
  fileInput.attribute('hidden', 'true'); // add hidden attribute
  fileInput.position(0, height + 10);
  
  // Automatically open file browser when load button is clicked
  fileInput.elt.click();
}

function drawSpectrum() {
  if (!song.isPlaying()) {
    noLoop();
    playButton.html('Play');
    return;
  }

  const spectrum = fft.analyze();
  
  noFill();
  stroke(255);
  strokeWeight(1);

  const distortionFactor = distortionSlider.value();
  const widthSize = widthSizeSlider.value();
  const heightSize = heightSizeSlider.value();
  resizeCanvas(widthSize, heightSize);
  
  const numElements = spectrum.length;
  const spacing = heightSize / numElements;
  background(0);

  // gradually reduce opacity of buttons while song is playing
  buttonFile.style('opacity', buttonFile.style('opacity') - 0.01);
  playButton.style('opacity', playButton.style('opacity') - 0.01);
  distortionSlider.style('opacity', distortionSlider.style('opacity') - 0.01);
  widthSizeSlider.style('opacity', widthSizeSlider.style('opacity') - 0.01);
  heightSizeSlider.style('opacity', heightSizeSlider.style('opacity') - 0.01);
  distortionLegend.style('opacity', distortionLegend.style('opacity') - 0.01);
  widthSizeLegend.style('opacity', widthSizeLegend.style('opacity') - 0.01);
  heightSizeLegend.style('opacity', heightSizeLegend.style('opacity') - 0.01);
  FFTBinsLegend.style('opacity', FFTBinsLegend.style('opacity') - 0.01);
  FFTBinsSelect.style('opacity', FFTBinsSelect.style('opacity') - 0.01);
  smoothSlider.style('opacity', smoothSlider.style('opacity') - 0.01);
  smoothLegend.style('opacity', smoothLegend.style('opacity') - 0.01);

  spectrum.forEach((amplitude, i) => {
    const y = spacing * i;
    const yDistortion = map(amplitude, 0, 255, spacing * distortionFactor, -spacing * distortionFactor);
    const time = song.currentTime();
    const x = map(time, 0, song.duration(), 0, width);
    xCoords[i].push({ x: x % width, y: y + yDistortion });

    if (xCoords[i].length > 1 && xCoords[i][xCoords[i].length - 1].x < 0) {
      xCoords[i] = [];
    }

    if (xCoords[i].length > 1) {
      beginShape();
      curveVertex(xCoords[i][0].x, xCoords[i][0].y);
      for (let j = 1; j < xCoords[i].length; j++) {
        curveVertex(xCoords[i][j].x, xCoords[i][j].y);
      }
      endShape();
    }
  });
}

