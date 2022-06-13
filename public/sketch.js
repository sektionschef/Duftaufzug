// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

logging.setLevel(SWITCH_LOGGING_LEVEL);

console.info("fxhash: " + fxhash);
NOISESEED = hashFnv32a(fxhash);
logging.debug("Noise seed: " + NOISESEED);

let BACKGROUNDCOLOR = 120;
let MARGINDUFTORIGIN = 1200;

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

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  wallBuffer = createGraphics(rescaling_width, rescaling_height);
  lightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);


  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  duftOrigin = createVector(
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.width - MARGINDUFTORIGIN),
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.height - MARGINDUFTORIGIN)
  );

  // wallData = {
  //   buffer: wallBuffer,
  //   inc: 0.01,  // noise increase for perlin noise
  //   colorSolid: 10,  // color of the boxes
  //   opacityValue: 5,  // opacity of boxes
  //   scl: 10,  // size of the cell, boxes
  //   distortion: 30,  // random misplacement of the boxes
  //   amountMax: 15, // how many rects per cell, max
  //   margin: 200, // distance to the edge
  // }

  // wall = new noiseParticles(wallData);
  // // wall = new noisePixel(wallData);  // alternative

  duftShapeData = {
    buffer: duftShapeBuffer,
    shapeCount: 1, // number of shapes
    radioMin: 600, // size
    radioMax: 800, // size
    radioDistortion: 180,  // misplacement
    polygonCount: 100,  // how many overlapping polygons to draw
    margin: MARGINDUFTORIGIN,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidstrokeWeight: 50,
    solidColorStroke: color(20, 5),
    solidColorArea: color(30, 5),
    origin: duftOrigin,
    duftOrbit: false,
  }

  duftShape = new Shapes(duftShapeData);

  // mask
  duftTextureData = {
    buffer: duftTextureBuffer,
    inc: 0.01,  // noise increase for perlin noise
    colorSolid: 180,  // color of the boxes
    opacityValue: 10,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 60,  // random misplacement of the boxes
    amountMax: 1, // how many rects per cell, max
    margin: 0, // distance to the edge
  }

  duftTexture = new noiseParticles(duftTextureData);

  // duftOrigin = duftShape.shapes[0].origin;
  duftOrbit = (duftShape.shapes[0].radioMax - duftShape.shapes[0].radioMin) / 2 + duftShape.shapes[0].radioMin;

  duftArea.orientation = getRandomFromList(["down", "left", "up", "right"]);

  if (duftArea.orientation == "down") {
    var posX = (duftOrigin.x - duftOrbit);
    var posY = (duftOrigin.y - duftOrbit);
    var widthX = duftOrbit * 2;
    var heightY = (exportPaper.height - (duftOrigin.y - duftOrbit));
  } else if (duftArea.orientation == "left") {
    var posX = 0;
    var posY = (duftOrigin.y - duftOrbit);
    var widthX = (duftOrigin.x + duftOrbit);
    var heightY = duftOrbit * 2;
  } else if (duftArea.orientation == "up") {
    var posX = (duftOrigin.x - duftOrbit);
    var posY = 0;
    var widthX = (duftOrbit * 2);
    var heightY = (duftOrigin.y + duftOrbit);
  } else if (duftArea.orientation == "right") {
    var posX = (duftOrigin.x - duftOrbit);
    var posY = (duftOrigin.y - duftOrbit);
    var widthX = (exportPaper.width - (duftOrigin.x - duftOrbit));
    var heightY = duftOrbit * 2;
  }
  duftArea.position = createVector(posX, posY);
  duftArea.width = widthX;
  duftArea.height = heightY;

  lightShapeData = {
    shapeCount: 70, // number of shapes
    buffer: lightShapeBuffer,
    radioMin: 300, // size
    radioMax: 350, // size
    radioDistortion: 150,  // misplacement
    polygonCount: 10,  // how many overlapping polygons to draw
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(33, 3),
    solidColorArea: color(230, 3),
    duftOrbit: false,
    duftArea: true,
  }
  lightShape = new Shapes(lightShapeData);


  lightTextureData = {
    buffer: lightTextureBuffer,
    inc: 0.4,  // noise increase for perlin noise
    colorSolid: 130,  // color of the boxes
    opacityValue: 30,  // opacity of boxes
    scl: 10,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 1, // how many rects per cell, max
    margin: 0, // distance to the edge
  }

  lightTexture = new noiseParticles(lightTextureData);

  // highlightShapeData = {
  //   buffer: highlightShapeBuffer,
  //   shapeCount: 10, // number of shapes
  //   radioMin: 50, // size
  //   radioMax: 250, // size
  //   radioDistortion: 170,  // misplacement
  //   polygonCount: 20,  // how many overlapping polygons to drawo
  //   margin: 500,  // distance from edge
  //   curveTightness: 0.5,
  //   noColorStroke: false,
  //   solidstrokeWeight: 50,
  //   solidColorStroke: color(60, 5),
  //   solidColorArea: color(250, 5),
  //   duftOrbit: true,
  // }
  // highlightShapes = new Shapes(highlightShapeData);

  // // MASKS
  duft = maskBuffers(duftTexture.buffer, duftShape.buffer);
  light = maskBuffers(lightTexture.buffer, lightShape.buffer);
}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(BACKGROUNDCOLOR);

  // buffer.image(wall.buffer, 0, 0);

  buffer.image(lightShape.buffer, 0, 0);
  buffer.image(light, 0, 0);

  // buffer.image(highlightShapes.buffer, 0, 0);

  buffer.image(duftShape.buffer, 0, 0);
  buffer.image(duft, 0, 0);

  // debug duftOrbit
  if (logging.getLevel() <= 2) {
    buffer.push();
    buffer.rectMode(CENTER);
    buffer.stroke("red");
    buffer.strokeWeight(1 / exportRatio);
    buffer.noFill();
    buffer.rect(duftOrigin.x / exportRatio, duftOrigin.y / exportRatio, duftOrbit * 2 / exportRatio, duftOrbit * 2 / exportRatio);
    buffer.pop();
  }

  // debug duftArea
  if (logging.getLevel() <= 2) {
    buffer.push();
    buffer.rectMode(CORNER);
    buffer.stroke("purple");
    buffer.strokeWeight(5 / exportRatio);
    buffer.noFill();
    buffer.rect(duftArea.position.x / exportRatio, duftArea.position.y / exportRatio, duftArea.width / exportRatio, duftArea.height / exportRatio);
    buffer.pop();
  }

  image(buffer, - width / 2, - height / 2);

  noLoop();
  // fxpreview()


  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
