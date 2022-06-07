// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

logging.setLevel(SWITCH_LOGGING_LEVEL);

console.info("fxhash: " + fxhash);
NOISESEED = hashFnv32a(fxhash);
logging.debug("Noise seed: " + NOISESEED);

let BACKGROUNDCOLOR = 120;

let scaleRatio;
let exportRatio;
let buffer;
let canvas;
let exportPaper = {
  width: 4000,
  height: 4000
  // width: 3840,  // STAMMERSDORF
  // height: 2160  // STAMMERSDORF
}
let rescaling_width;
let rescaling_height;

let fxhash_number;

function preload() {
}

function setup() {

  scaleDynamically();

  buffer = createGraphics(rescaling_width, rescaling_height);
  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);

  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();

  noiseSeed(NOISESEED);

  noiseParticlesData = {
    inc: 0.02,  // noise increase for perlin noise
    colorSolid: 20,  // color of the boxes
    opacityValue: 5,  // opacity of boxes
    scl: 20,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 10, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

  wall = new noiseParticles(noiseParticlesData);

}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(BACKGROUNDCOLOR);


  wall.showAll();
  draw_shape();

  // document
  // absolute value / exportRatio
  // DUMMY POSITIONING
  // buffer.push();
  // rectMode(CENTER);
  // buffer.fill("pink");
  // buffer.translate(getRandomFromInterval(exportPaper.width / 2, exportPaper.width) / exportRatio, 2000 / exportRatio);
  // buffer.rect(0, 0, 60 / exportRatio, 60 / exportRatio);
  // buffer.pop();
  image(buffer, - width / 2, - height / 2);


  noLoop();
  // fxpreview()

  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
