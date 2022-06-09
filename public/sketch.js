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
  test = loadImage("test.png");
}

function setup() {

  scaleDynamically();

  buffer = createGraphics(rescaling_width, rescaling_height);
  wallBuffer = createGraphics(rescaling_width, rescaling_height);
  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);

  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  noiseParticlesData = {
    inc: 0.03,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 5,  // opacity of boxes
    scl: 20,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 10, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

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

  wall = new noiseParticles(noiseParticlesData);

  darkShapes = new Shapes(darkShapeData);
  lightShapes = new Shapes(lightShapeData);

  // mask
  maskBufferData = {
    buffer: wallBuffer,
    inc: 0.03,  // noise increase for perlin noise
    colorSolid: 10,  // color of the boxes
    opacityValue: 255,  // opacity of boxes
    scl: 20,  // size of the cell, boxes
    distortion: 30,  // random misplacement of the boxes
    amountMax: 2, // how many rects per cell, max
    margin: 200, // distance to the edge
  }

  noisy = new noiseParticles(maskBufferData);

  maskPG = createGraphics(this.width, this.height);
  maskPG.clear();
  maskPG.scale(scaleRatio);

  maskPG.fill(255, 0, 0, 255);
  maskPG.circle(430, 430, 260);

  maskPG2 = createGraphics(this.width, this.height);
  maskPG2.clear();
  maskPG2.scale(scaleRatio);

  maskPG2.fill(0, 255);
  maskPG2.circle(430, 430, 60);

  recto = createGraphics(this.width, this.height);
  recto.clear();
  recto.scale(scaleRatio);

  recto.fill(0, 255);
  recto.rect(230, 230, 360, 360);


  // noisy.pg = noisy.pg.get();

  // (imgClone = test.get()).mask(maskPG.get());  // works
  // (imgClone = maskPG.get()).mask(maskPG2.get());  // works - das vordere bleibt, das hintere filtert alles raus wo im zweiten keine transparenz ist
  (imgClone = noisy.pg.get()).mask(recto.get());  // works - das vordere bleibt, das hintere filtert alles raus wo im zweiten keine transparenz ist

  // test.mask(noisy.pg);
  // noisy.pg.mask(maskPG);

  // brush.buffer = brush.buffer.get();
  // brush.buffer.mask(fog.buffer);
}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  buffer.clear();
  buffer.scale(scaleRatio);

  background(150);

  // buffer.background(BACKGROUNDCOLOR);


  // lightShapes.drawAll();
  // darkShapes.drawAll();

  // document
  // absolute value / exportRatio
  // DUMMY POSITIONING
  // buffer.push();
  // rectMode(CENTER);
  // buffer.fill("pink");
  // buffer.translate(getRandomFromInterval(exportPaper.width / 2, exportPaper.width) / exportRatio, 2000 / exportRatio);
  // buffer.rect(0, 0, 60 / exportRatio, 60 / exportRatio);
  // buffer.pop();

  // image(wall.pg, - width / 2, - height / 2);

  // image(buffer, - width / 2, - height / 2);

  // image(test, - width / 2, - height / 2);
  // image(noisy.pg, - width / 2, - height / 2);
  // image(maskPG, - width / 2, - height / 2);
  // image(maskPG2, - width / 2, - height / 2);
  // image(recto, - width / 2, - height / 2);
  // console.log(imgClone);
  // image(imgClone, - width / 2, - height / 2, imgClone.width / exportRatio, imgClone.height / exportRatio);  // nur das was kein alpha hat
  image(imgClone, - width / 2, - height / 2, imgClone.width, imgClone.height);  // nur das was kein alpha hat

  noLoop();
  // fxpreview()

  // console.info("safety check for diff resolutions same hash: " + fxrand());

}
