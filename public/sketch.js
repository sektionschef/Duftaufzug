// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

logging.setLevel(SWITCH_LOGGING_LEVEL);

const MODE = 1  // "FINE ART";
// const MODE = 2  // basic image
// const MODE = 5 // all debug messages

console.info("fxhash: " + fxhash);
NOISESEED = hashFnv32a(fxhash);
logging.debug("Noise seed: " + NOISESEED);

let BACKGROUNDMARGIN = 200;
let MARGINDUFTORIGIN = 1500;
let DUFTRADIOMIN = 300;
let DUFTRADIOMAX = 600;
let LIGHTRADIOMIN = 200;
let LIGHTRADIOMAX = 300;
let AMBIENTRADIOMIN = 300;
let AMBIENTRADIOMAX = 500;

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
let duftCounty = {};

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
  ambientShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  ambientTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lineBuffer = createGraphics(rescaling_width, rescaling_height);


  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  // COLOR
  // backgroundColor = color(100);
  colorMode(HSB, 100);
  backgroundColor = color("#4d4f4e");
  ambientColor = [
    // color("#756e6d"),
    // color("#6e6b64"),
    color("#353633"),
    color("#33323b"),
    // color("#6e695d")
  ];
  duftColor = color(220, 6, 21, 2);
  lightColor = color(44, 8, 80, 5);
  highlightColor = color(70, 3, 89, 0.1);
  colorMode(RGB, 255);


  duftOrigin = createVector(
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.width - MARGINDUFTORIGIN),
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.height - MARGINDUFTORIGIN)
  );
  duftOrbit = (DUFTRADIOMAX - DUFTRADIOMIN) / 2 + DUFTRADIOMIN;

  // DUFT AREA
  duftArea.orientation = getRandomFromList(["down", "left", "up", "right"]);
  // duftArea.orientation = getRandomFromList(["down"]);

  if (duftArea.orientation == "down") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      duftOrigin.y - duftOrbit
    );
    duftArea.width = duftOrbit * 2;
    duftArea.height = (exportPaper.height - (duftOrigin.y - duftOrbit));
  } else if (duftArea.orientation == "left") {
    duftArea.position = createVector(
      0,
      duftOrigin.y - duftOrbit
    );
    duftArea.width = (duftOrigin.x + duftOrbit);
    duftArea.height = duftOrbit * 2;
  } else if (duftArea.orientation == "up") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      0
    );
    duftArea.width = (duftOrbit * 2);
    duftArea.height = (duftOrigin.y + duftOrbit);
  } else if (duftArea.orientation == "right") {
    duftArea.position = createVector(
      duftOrigin.x - duftOrbit,
      duftOrigin.y - duftOrbit
    )
    duftArea.width = (exportPaper.width - (duftOrigin.x - duftOrbit));
    duftArea.height = duftOrbit * 2;
  }

  duftArea.size = duftArea.width * duftArea.height;

  // DUFTCOUNTY
  duftExpander = duftOrbit * 2  // distance for DuftCounty

  if (duftArea.orientation == "down") {
    duftCounty.position = createVector(
      duftArea.position.x - duftExpander,
      duftArea.position.y - duftExpander / 4  // add a quarter
    );
    duftCounty.width = duftArea.width + duftExpander * 2;
    duftCounty.height = duftArea.height;
  } else if (duftArea.orientation == "left") {
    duftCounty.position = createVector(
      duftArea.position.x,
      duftArea.position.y - duftExpander
    );
    duftCounty.width = duftArea.width + duftExpander / 4;
    duftCounty.height = duftArea.height + duftExpander * 2;
  } else if (duftArea.orientation == "up") {
    duftCounty.position = createVector(
      duftArea.position.x - duftExpander,
      duftArea.position.y
    );
    duftCounty.width = duftArea.width + duftExpander * 2;
    duftCounty.height = duftArea.height + duftExpander / 4;
  } else if (duftArea.orientation == "right") {
    duftCounty.position = createVector(
      duftArea.position.x - duftExpander / 4,
      duftArea.position.y - duftExpander
    );
    duftCounty.width = duftArea.width;
    duftCounty.height = duftArea.height + duftExpander * 2;
  }

  // wallDataLegacy = {
  //   buffer: wallBuffer,
  //   inc: 0.01,  // noise increase for perlin noise
  //   colorSolid: 10,  // color of the boxes
  //   opacityValue: 5,  // opacity of boxes
  //   scl: 10,  // size of the cell, boxes
  //   distortion: 30,  // random misplacement of the boxes
  //   amountMax: 15, // how many rects per cell, max
  //   margin: BACKGROUNDMARGIN, // distance to the edge
  // }

  wallTextureData = {
    buffer: wallBuffer,
    inc: 0.005,  // noise increase for perlin noise
    gain: -10,
    colorBackground: backgroundColor,  // drawn pixels for background
    colorForeground: lessenColor(backgroundColor, 60),  // drawn pixels for noise
    opacityValue: 255,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 10,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE == 1) {
    // wallTexture = new noiseParticles(wallDataLegacy);
    wallTexture = new Pixies(wallTextureData);
  }

  ambientShapeData = {
    shapeCount: duftArea.size / 100000, // number of shapes - 70
    buffer: ambientShapeBuffer,
    radioMin: AMBIENTRADIOMIN, // size
    radioMax: AMBIENTRADIOMAX, // size
    radioDistortion: 200,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: 0,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(33),
    solidColorArea: ambientColor,
    opacityFillValue: 50,
    opacityStrokeValue: 255,
    duftOrbit: false,
    duftArea: false,
    duftCounty: true,
    blur: 10,
  }
  ambientShape = new Shapes(ambientShapeData);

  ambientTextureData = {
    buffer: ambientTextureBuffer,
    inc: 0.008,  // noise increase for perlin noise
    gain: 10,
    colorBackground: color(0, 0),  // drawn pixels for background
    colorForeground: color(50),  // drawn pixels for noise
    opacityValue: 10,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 20,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE == 1) {
    ambientTexture = new Pixies(ambientTextureData);
  }


  lightShapeData = {
    shapeCount: duftArea.size / 100000, // number of shapes - 70
    buffer: lightShapeBuffer,
    radioMin: LIGHTRADIOMIN, // size
    radioMax: LIGHTRADIOMAX, // size
    radioDistortion: 50,  // misplacement
    polygonCount: 1,  // how many overlapping polygons to draw
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(33),
    solidColorArea: [color("#908583"), color("#c8c3b7")],// lightColor, // color(230, 3),
    opacityFillValue: 50,
    opacityStrokeValue: 50,
    duftOrbit: false,
    duftArea: true,
    blur: 3,
  }
  lightShape = new Shapes(lightShapeData);


  // lightTextureDataLegacy = {
  //   buffer: lightTextureBuffer,
  //   inc: 0.4,  // noise increase for perlin noise
  //   colorSolid: 160,  // color of the boxes
  //   opacityValue: 30,  // opacity of boxes
  //   scl: 10,  // size of the cell, boxes
  //   distortion: 30,  // random misplacement of the boxes
  //   amountMax: 1, // how many rects per cell, max
  //   margin: 0, // distance to the edge
  // }

  lightTextureData = {
    buffer: lightTextureBuffer,
    inc: 0.008,  // noise increase for perlin noise
    gain: -30,
    colorBackground: color(160),  // drawn pixels for background
    colorForeground: color(0),  // drawn pixels for noise
    opacityValue: 255,  // opacity of boxes
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
    polygonCount: 3,  // how many overlapping polygons to drawo
    margin: 500,  // distance from edge
    curveTightness: 0.5,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(250),
    // [color("#fcf9f4"), color("#e3e0d9"), color("#d9d4da")]
    solidColorArea: [distortColor(highlightColor, 10), distortColor(highlightColor, 10), distortColor(highlightColor, 10)], // color(60, 5),
    duftOrbit: true,
    opacityFillValue: 50,
    opacityStrokeValue: 50,
    blur: 4  // undefined,
  }
  highlightShapes = new Shapes(highlightShapeData);

  duftShapeData = {
    buffer: duftShapeBuffer,
    shapeCount: 1, // number of shapes
    radioMin: DUFTRADIOMIN, // size
    radioMax: DUFTRADIOMAX, // size
    radioDistortion: 180,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: MARGINDUFTORIGIN,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidstrokeWeight: 50,
    solidColorStroke: color(20, 5),
    solidColorArea: duftColor,
    opacityFillValue: 55,
    opacityStrokeValue: 55,
    origin: duftOrigin,
    duft: true,
    duftOrbit: false,
    duftArea: false,
    blur: 4,
  }

  duftShape = new Shapes(duftShapeData);

  // mask
  // duftTextureDataLegacy = {
  //   buffer: duftTextureBuffer,
  //   inc: 0.01,  // noise increase for perlin noise
  //   colorSolid: 180,  // color of the boxes
  //   opacityValue: 10,  // opacity of boxes
  //   scl: 10,  // size of the cell, boxes
  //   distortion: 60,  // random misplacement of the boxes
  //   amountMax: 1, // how many rects per cell, max
  //   margin: 0, // distance to the edge
  // }
  duftTextureData = {
    buffer: duftTextureBuffer,
    inc: 0.01,  // noise increase for perlin noise
    gain: -30,
    colorBackground: duftColor,  // drawn pixels for background
    colorForeground: color(100),  // drawn pixels for noise
    opacityValue: 75,  // opacity of boxes
    distortion: 7,  // random misplacement of the boxes
    density: 10,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE <= 2) {
    // duftTexture = new noiseParticles(duftTextureDataLegacy);
    duftTexture = new Pixies(duftTextureData);
  }

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
    ambientMasked = maskBuffers(ambientTexture.buffer, ambientShape.buffer);
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
    buffer.drawingContext.filter = 'blur(0.5px)';
    buffer.image(wallTexture.buffer, 0, 0);
    buffer.pop()
  }

  if (MODE == 1) {
    buffer.image(ambientShape.buffer, 0, 0);
    buffer.image(ambientMasked, 0, 0);
  } else {
    buffer.image(ambientShape.buffer, 0, 0);
  }

  // buffer.image(lightShape.buffer, 0, 0);
  // if (MODE == 1) {
  //   buffer.image(light, 0, 0);
  // }


  // buffer.image(highlightShapes.buffer, 0, 0);

  // buffer.image(duftShape.buffer, 0, 0);
  // if (MODE == 1) {
  //   buffer.image(duft, 0, 0);
  // }

  // buffer.image(dummyLine.buffer, 0, 0);

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

  // debug duftCounty
  if (MODE == 5) {
    buffer.push();
    buffer.rectMode(CORNER);
    buffer.stroke("cyan");
    buffer.strokeWeight(5 / exportRatio);
    buffer.noFill();
    buffer.rect(duftCounty.position.x / exportRatio, duftCounty.position.y / exportRatio, duftCounty.width / exportRatio, duftCounty.height / exportRatio);
    buffer.pop();
  }

  // debug canvas margin
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
