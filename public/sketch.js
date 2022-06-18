// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

logging.setLevel(SWITCH_LOGGING_LEVEL);

// const MODE = 1  // "FINE ART";
const MODE = 1  // basic image
// const MODE = 5 // all debug messages

console.info("fxhash: " + fxhash);
NOISESEED = hashFnv32a(fxhash);
logging.debug("Noise seed: " + NOISESEED);

let BACKGROUNDMARGIN = 200;
let MARGINDUFTORIGIN = 1500;
let DUFTRADIOMIN = 300;
let DUFTRADIOMAX = 600;
let LIGHTRADIOMIN = 100;
let LIGHTRADIOMAX = 150;

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

let duftArea = {};

function preload() {
}

function setup() {

  scaleDynamically();
  setAttributes('antialias', true);

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  wallBuffer = createGraphics(rescaling_width, rescaling_height);
  lightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lineBuffer = createGraphics(rescaling_width, rescaling_height);


  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  // COLOR
  colorMode(HSB, 100);
  backgroundColor = color(150, 3, 31, 100);
  duftColor = color(220, 6, 21, 2);
  lightColor = color(44, 8, 80, 5);
  highlightColor = color(70, 3, 89, 0.1);
  colorMode(RGB, 255);


  duftOrigin = createVector(
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.width - MARGINDUFTORIGIN),
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.height - MARGINDUFTORIGIN)
  );
  duftOrbit = (DUFTRADIOMAX - DUFTRADIOMIN) / 2 + DUFTRADIOMIN;

  duftArea.orientation = getRandomFromList(["down", "left", "up", "right"]);

  let duftAreaMargin = (BACKGROUNDMARGIN + LIGHTRADIOMIN)

  if (duftArea.orientation == "down") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      duftOrigin.y - duftOrbit
    );
    duftArea.width = duftOrbit * 2;
    duftArea.height = (exportPaper.height - (duftOrigin.y - duftOrbit) - duftAreaMargin);
  } else if (duftArea.orientation == "left") {
    duftArea.position = createVector(
      0 + duftAreaMargin,
      duftOrigin.y - duftOrbit
    );
    duftArea.width = (duftOrigin.x + duftOrbit) - duftAreaMargin;
    duftArea.height = duftOrbit * 2;
  } else if (duftArea.orientation == "up") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      0 + duftAreaMargin
    );
    duftArea.width = (duftOrbit * 2);
    duftArea.height = (duftOrigin.y + duftOrbit) - duftAreaMargin;
  } else if (duftArea.orientation == "right") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      duftOrigin.y - duftOrbit
    )
    duftArea.width = (exportPaper.width - (duftOrigin.x - duftOrbit) - duftAreaMargin);
    duftArea.height = duftOrbit * 2;
  }

  duftArea.size = duftArea.width * duftArea.height;

  wallDataLegacy = {
    buffer: wallBuffer,
    inc: 0.01,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 5,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  wallData = {
    buffer: wallBuffer,
    inc: 0.008,  // noise increase for perlin noise
    colorBackground: backgroundColor,  // drawn pixels for background
    colorForeground: color(0),  // drawn pixels for noise
    opacityValue: 75,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 10,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE == 1) {
    // wallTexture = new noiseParticles(wallDataLegacy);
    wallTexture = new Pixies(wallData);
  }

  duftShapeData = {
    buffer: duftShapeBuffer,
    shapeCount: 1, // number of shapes
    radioMin: DUFTRADIOMIN, // size
    radioMax: DUFTRADIOMAX, // size
    radioDistortion: 180,  // misplacement
    polygonCount: 100,  // how many overlapping polygons to draw
    margin: MARGINDUFTORIGIN,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidstrokeWeight: 50,
    solidColorStroke: color(20, 5),
    solidColorArea: duftColor,
    opacityFillValue: 255,
    opacityStrokeValue: 255,
    origin: duftOrigin,
    duftOrbit: false,
  }

  duftShape = new Shapes(duftShapeData);

  // mask
  duftTextureDataLegacy = {
    buffer: duftTextureBuffer,
    inc: 0.01,  // noise increase for perlin noise
    colorSolid: 180,  // color of the boxes
    opacityValue: 10,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 60,  // random misplacement of the boxes
    amountMax: 1, // how many rects per cell, max
    margin: 0, // distance to the edge
  }
  duftTextureData = {
    buffer: duftTextureBuffer,
    inc: 0.008,  // noise increase for perlin noise
    colorBackground: color(180),  // drawn pixels for background
    colorForeground: color(0),  // drawn pixels for noise
    opacityValue: 10,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 10,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE <= 2) {
    // duftTexture = new noiseParticles(duftTextureDataLegacy);
    duftTexture = new Pixies(duftTextureData);
  }

  lightShapeData = {
    shapeCount: duftArea.size / 10000, // number of shapes - 70
    buffer: lightShapeBuffer,
    radioMin: LIGHTRADIOMIN, // size
    radioMax: LIGHTRADIOMAX, // size
    radioDistortion: 150,  // misplacement
    polygonCount: 1,  // how many overlapping polygons to draw
    margin: 500,  // distance from edge
    curveTightness: -0.5,
    noColorStroke: true,
    solidstrokeWeight: 50,
    solidColorStroke: color(33),
    solidColorArea: [color("#908583"), color("#c8c3b7")],// lightColor, // color(230, 3),
    opacityFillValue: 50,
    opacityStrokeValue: 50,
    duftOrbit: false,
    duftArea: true,
    blur: 1,
  }
  lightShape = new Shapes(lightShapeData);


  lightTextureDataLegacy = {
    buffer: lightTextureBuffer,
    inc: 0.4,  // noise increase for perlin noise
    colorSolid: 160,  // color of the boxes
    opacityValue: 30,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 1, // how many rects per cell, max
    margin: 0, // distance to the edge
  }

  lightTextureData = {
    buffer: lightTextureBuffer,
    inc: 0.008,  // noise increase for perlin noise
    colorBackground: color(160),  // drawn pixels for background
    colorForeground: color(0),  // drawn pixels for noise
    opacityValue: 10,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 20,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE == 1) {
    // lightTexture = new noiseParticles(lightTextureDataLegacy);
    lightTexture = new Pixies(lightTextureData);
  }

  highlightShapeData = {
    buffer: highlightShapeBuffer,
    shapeCount: 15, // number of shapes
    radioMin: 50, // size
    radioMax: 150, // size
    radioDistortion: 170,  // misplacement
    polygonCount: 100,  // how many overlapping polygons to drawo
    margin: 500,  // distance from edge
    curveTightness: 0.5,
    noColorStroke: true,
    solidstrokeWeight: 50,
    solidColorStroke: highlightColor, // color(60, 5),
    solidColorArea: color(250, 5),
    duftOrbit: true,
    opacityFillValue: 255,
    opacityStrokeValue: 255,
    blur: undefined,
  }
  highlightShapes = new Shapes(highlightShapeData);


  LineData = {
    buffer: lineBuffer,
    shapeCount: 10, // number of shapes
    radioMin: 50, // size
    radioMax: 250, // size
    radioDistortion: 170,  // misplacement
    polygonCount: 20,  // how many overlapping polygons to drawo
    margin: 500,  // distance from edge
    curveTightness: 0.5,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(60, 5),
    solidColorArea: color(250, 5),
    duftOrbit: true,
  }
  dummyLine = new Lines(LineData);

  // // MASKS
  if (MODE == 1) {
    duft = maskBuffers(duftTexture.buffer, duftShape.buffer);
    light = maskBuffers(lightTexture.buffer, lightShape.buffer);
  }
}


function draw() {

  // orbitControl(1, 1, 0.1);

  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(backgroundColor);

  if (MODE == 1) {
    buffer.push()
    // buffer.drawingContext.filter = 'blur(0.7px)';
    buffer.image(wallTexture.buffer, 0, 0);
    buffer.pop()
  }

  buffer.image(lightShape.buffer, 0, 0);
  if (MODE == 1) {
    buffer.image(light, 0, 0);
  }

  buffer.image(highlightShapes.buffer, 0, 0);

  buffer.image(duftShape.buffer, 0, 0);
  if (MODE == 1) {
    buffer.image(duft, 0, 0);
  }

  buffer.image(dummyLine.buffer, 0, 0);

  // debug duftOrbit
  if (MODE == 5) {
    buffer.push();
    buffer.rectMode(CENTER);
    buffer.stroke("red");
    buffer.strokeWeight(3 / exportRatio);
    buffer.noFill();
    buffer.rect(duftOrigin.x / exportRatio, duftOrigin.y / exportRatio, duftOrbit * 2 / exportRatio, duftOrbit * 2 / exportRatio);
    buffer.pop();
  }

  // debug duftArea
  if (MODE == 5) {
    buffer.push();
    buffer.rectMode(CORNER);
    buffer.stroke("purple");
    buffer.strokeWeight(5 / exportRatio);
    buffer.noFill();
    buffer.rect(duftArea.position.x / exportRatio, duftArea.position.y / exportRatio, duftArea.width / exportRatio, duftArea.height / exportRatio);
    buffer.pop();
  }

  // debug duftArea
  if (MODE == 5) {
    buffer.push();
    buffer.rectMode(CORNER);
    buffer.stroke("black");
    buffer.strokeWeight(15 / exportRatio);
    buffer.noFill();
    buffer.rect(BACKGROUNDMARGIN / exportRatio, BACKGROUNDMARGIN / exportRatio, (exportPaper.width - BACKGROUNDMARGIN * 2) / exportRatio, (exportPaper.width - BACKGROUNDMARGIN * 2) / exportRatio);
    buffer.pop();
  }

  image(buffer, - width / 2, - height / 2);


  noLoop();
  // fxpreview()


  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
