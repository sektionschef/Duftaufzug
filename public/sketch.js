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

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  wallBuffer = createGraphics(rescaling_width, rescaling_height);
  maskBuffer = createGraphics(rescaling_width, rescaling_height);

  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  wallData = {
    buffer: wallBuffer,
    inc: 0.03,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 5,  // opacity of boxes
    scl: 20,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 10, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

  wall = new noiseParticles(wallData);

  lightShapeData = {
    shapeCount: 10, // number of shapes
    radioMin: 50, // size
    radioMax: 450, // size
    radioDistortion: 200,  // misplacement
    polygonCount: 10,  // how many overlapping polygons to draw
    opacityValue: 10,
    margin: 500,  // distance from edge
    curveTightness: -3,
    noColorStroke: false,
    solidColorStroke: 130,
    solidColorArea: 200,
  }

  darkShapeData = {
    shapeCount: 2, // number of shapes
    radioMin: 500, // size
    radioMax: 800, // size
    radioDistortion: 80,  // misplacement
    polygonCount: 3,  // how many overlapping polygons to draw
    opacityValue: 130,
    margin: 1200,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidColorStroke: 20,
    solidColorArea: 70,
  }

  darkShapes = new Shapes(darkShapeData);
  lightShapes = new Shapes(lightShapeData);

  // mask
  maskBufferData = {
    buffer: maskBuffer,
    inc: 0.03,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 255,  // opacity of boxes
    scl: 20,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 2, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

  noisy = new noiseParticles(maskBufferData);

  recto = createGraphics(this.width, this.height);
  recto.clear();
  recto.scale(scaleRatio);

  recto.fill(0, 255);
  recto.rect(230, 230, 360, 360);

  (noisyMasked = noisy.buffer.get()).mask(recto.get());  // works - das vordere bleibt, das hintere filtert alles raus, wo im zweiten keine transparenz ist
}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(BACKGROUNDCOLOR);

  // lightShapes.drawAll();
  // darkShapes.drawAll();

  // image(wall.pg, - width / 2, - height / 2);
  // image(noisyMasked, - width / 2, - height / 2);  // nur das was kein alpha hat

  // buffer.image(wall.buffer, 0, 0);
  buffer.image(noisyMasked, 0, 0);


  image(buffer, - width / 2, - height / 2);
  noLoop();
  // fxpreview()

  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
