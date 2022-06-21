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

let color_profile = getRandomFromList(["greyscale"]);

function preload() {
}

function setup() {

  scaleDynamically();
  setAttributes('antialias', true);

  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  // wallBuffer = createGraphics(rescaling_width, rescaling_height);
  lightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  // ambientShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  // ambientTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  // ambientBuffer = createGraphics(rescaling_width, rescaling_height);
  // ambientBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lineBuffer = createGraphics(rescaling_width, rescaling_height);


  logging.debug("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();  // FOR EACH BUFFER??

  noiseSeed(NOISESEED);

  colors = {
    "greyscale": {
      background: color("#aaaaaa"),
      backgroundnoise: color("#bbbbbb60"),
      darkA: [color("#555555"), color("#444444"), color("#666666")],
      darkAnoise: [color("#666666"), color("#555555"), color("#777777")],
      lightA: [color("#777777"), color("#888888"), color("#999999")],
      lightAnoise: [color("#888888"), color("#999999"), color("#aaaaaa")],
      highlightA: [color("#cccccc"), color("#dddddd"), color("#eeeeee")],
      highlightAnoise: [color("#dddddd"), color("#eeeeee"), color("#ffffff")],

      duft: color("#222222"),
      duftNoise: color("#22222260"),
    }
  }

  // COLOR
  // colorMode(HSB, 100);
  // ambientColor = colorPaletteDark;
  // lightColor = colorPaletteLight;
  // highlightColor = colorPaletteGlow;
  // colorMode(RGB, 255);

  duftOrigin = createVector(
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.width - MARGINDUFTORIGIN),
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.height - MARGINDUFTORIGIN)
  );

  // DUFT AREA
  duftArea.orientation = getRandomFromList(["down", "left", "up", "right"]);
  // duftArea.orientation = getRandomFromList(["down"]);

  duftOrbit = (DUFTRADIOMAX - DUFTRADIOMIN) / 2 + DUFTRADIOMIN;
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

  wallTextureData = {
    // buffer: wallBuffer,
    inc: 0.005,  // noise increase for perlin noise
    gain: -255,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 7,  // random misplacement of the boxes
    density: 10,
    // amountMax: 15, // how many rects per cell, max
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  if (MODE == 1) {
    wallTexture = new Pixies(wallTextureData);
  }

  ambientData = {
    shapeCount: duftArea.size / 150000, // number of shapes
    radioMin: AMBIENTRADIOMIN, // size
    radioMax: AMBIENTRADIOMAX, // size
    radioDistortion: 200,  // misplacement
    polygonCount: 3,  // how many overlapping polygons to draw
    margin: 0,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(40),
    solidColorArea: colors[color_profile].darkA,
    noiseColorArea: colors[color_profile].darkAnoise,
    opacityFillValue: 200,
    opacityStrokeValue: 55,
    duftOrbit: false,
    duftArea: false,
    duftCounty: true,
    blur: 3,
    textureData: {
      inc: 0.008,  // noise increase for perlin noise
      gain: -60,  // COOL TO CHANGE
      colorBackground: undefined,// this.solidColorArea,  // drawn pixels for background
      distortion: 7,  // random misplacement of the boxes
      density: 10,
      // amountMax: 15, // how many rects per cell, max
      margin: 0, // distance to the edge
    }
  }
  ambients = new Shapes(ambientData);


  lightData = {
    shapeCount: duftArea.size / 150000, // number of shapes - 70
    radioMin: LIGHTRADIOMIN, // size
    radioMax: LIGHTRADIOMAX, // size
    radioDistortion: 150,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 50,
    solidColorStroke: color(100),
    solidColorArea: colors[color_profile].lightA,
    noiseColorArea: colors[color_profile].lightAnoise,
    opacityFillValue: 200,
    opacityStrokeValue: 55,
    duftOrbit: false,
    duftArea: true,
    blur: 2,
    textureData: {
      inc: 0.008,  // noise increase for perlin noise
      gain: -70,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 7,  // random misplacement of the boxes
      density: 10,
      // amountMax: 15, // how many rects per cell, max
      margin: 0, // distance to the edge
    }
  }
  lights = new Shapes(lightData);

  highlightData = {
    shapeCount: 5, // number of shapes
    radioMin: 50, // size
    radioMax: 150, // size
    radioDistortion: 120,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to drawo
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 150,
    solidColorStroke: color(70),
    solidColorArea: colors[color_profile].highlightA,
    noiseColorArea: colors[color_profile].highlightAnoise,
    duftOrbit: true,
    opacityFillValue: 70,
    opacityStrokeValue: 55,
    blur: 2,  // undefined,
    textureData: {
      inc: 0.008,  // noise increase for perlin noise
      gain: -60,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 7,  // random misplacement of the boxes
      density: 10,
      // amountMax: 15, // how many rects per cell, max
      margin: BACKGROUNDMARGIN, // distance to the edge
    }
  }
  highlights = new Shapes(highlightData);

  if (MODE == 1) {
    // highlightTexture = new Pixies(highlightTextureData);
  }

  duftData = {
    shapeCount: 1, // number of shapes
    radioMin: DUFTRADIOMIN, // size
    radioMax: DUFTRADIOMAX, // size
    radioDistortion: 180,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: MARGINDUFTORIGIN,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidstrokeWeight: 190,
    solidColorStroke: color(20, 5),
    solidColorArea: colors[color_profile].duft,
    noiseColorArea: colors[color_profile].duftNoise,
    opacityFillValue: 170,
    opacityStrokeValue: 55,
    origin: duftOrigin,
    duft: true,
    duftOrbit: false,
    duftArea: false,
    blur: 2,
    textureData: {
      inc: 0.008,  // noise increase for perlin noise
      gain: -60,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 7,  // random misplacement of the boxes
      density: 10,
      // amountMax: 15, // how many rects per cell, max
      margin: BACKGROUNDMARGIN, // distance to the edge
    }
  }
  duft = new Shapes(duftData);

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

}


function draw() {

  // orbitControl(1, 1, 0.1);

  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(colors[color_profile].background);

  if (MODE == 1) {
    buffer.push()
    buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(wallTexture.buffer, 0, 0);
    buffer.pop()
  }

  if (MODE == 1) {
    buffer.push();
    buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(ambients.buffer, 0, 0);
    // buffer.image(ambients.bufferMasked, 0, 0);
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(lights.buffer, 0, 0);
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(highlights.buffer, 0, 0);
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(duft.buffer, 0, 0);
    buffer.pop();
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
