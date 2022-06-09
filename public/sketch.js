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
  highlightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);


  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  wallData = {
    buffer: wallBuffer,
    inc: 0.009,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 5,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 10, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

  wall = new noiseParticles(wallData);

  duftShapeData = {
    buffer: duftShapeBuffer,
    shapeCount: 1, // number of shapes
    radioMin: 600, // size
    radioMax: 800, // size
    radioDistortion: 180,  // misplacement
    polygonCount: 16,  // how many overlapping polygons to draw
    opacityValue: 30,
    margin: 1200,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidColorStroke: 20,
    solidColorArea: 30,
    duftOrbit: false,
  }

  duftShape = new Shapes(duftShapeData);

  // mask
  duftTextureData = {
    buffer: duftTextureBuffer,
    inc: 0.01,  // noise increase for perlin noise
    colorSolid: 0,  // color of the boxes
    opacityValue: 10,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 60,  // random misplacement of the boxes
    amountMax: 30, // how many rects per cell, max
    margin: 0, // distance to the edge
  }

  duftTexture = new noiseParticles(duftTextureData);

  duftOrigin = duftShape.shapes[0].origin;
  duftOrbit = (duftShape.shapes[0].radioMax - duftShape.shapes[0].radioMin) / 2 + duftShape.shapes[0].radioMin;

  highlightShapeData = {
    buffer: highlightShapeBuffer,
    shapeCount: 20, // number of shapes
    radioMin: 50, // size
    radioMax: 650, // size
    radioDistortion: 250,  // misplacement
    polygonCount: 10,  // how many overlapping polygons to draw
    opacityValue: 10,
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidColorStroke: 130,
    solidColorArea: 200,
    duftOrbit: true,
  }
  highlightShapes = new Shapes(highlightShapeData);

  // MASKS
  (duft = duftTexture.buffer.get()).mask(duftShape.buffer.get());  // works - das vordere bleibt, das hintere filtert alles raus, wo im zweiten keine transparenz ist
}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(BACKGROUNDCOLOR);

  buffer.image(wall.buffer, 0, 0);

  // DEBUG single buffers
  // on canvas directly not buffer:
  // image(wall.buffer, - width / 2, - height / 2);
  // buffer.image(duftTexture.buffer, 0, 0);

  buffer.image(highlightShapes.buffer, 0, 0);

  buffer.image(duftShape.buffer, 0, 0);
  buffer.image(duft, 0, 0);

  if (logging.getLevel() <= 1) {
    // debug duftOrbit
    buffer.push();
    buffer.rectMode(CENTER);
    buffer.stroke("red");
    buffer.strokeWeight(1 / exportRatio);
    buffer.noFill();
    buffer.rect(duftOrigin.x / exportRatio, duftOrigin.y / exportRatio, duftOrbit * 2 / exportRatio, duftOrbit * 2 / exportRatio);
    buffer.pop();
  }

  image(buffer, - width / 2, - height / 2);

  noLoop();
  // fxpreview()


  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
