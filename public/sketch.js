// https://www.kindacode.com/article/javascript-get-current-date-time-in-yyyy-mm-dd-hh-mm-ss-format/

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
let DUFTRADIOMAX = 350;
let LIGHTRADIOMIN = 200;
let LIGHTRADIOMAX = 400;
let AMBIENTRADIOMIN = 300;
let AMBIENTRADIOMAX = 600;

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

// let color_profile = getRandomFromList(["greyscale"]);
// let color_profile = getRandomFromList(["red"]);
// let color_profile = getRandomFromList(["blue"]);
// let color_profile = getRandomFromList(["blueey"]);
// let color_profile = getRandomFromList(["paradise"]);
// let color_profile = getRandomFromList(["hund"]);
// let color_profile = getRandomFromList(["marienkäfer"]);

let color_profile = getRandomFromList([
  "red",
  "greyscale",
  "blue",
  "blueey",
  "paradise",
  "hund",
  "marienkäfer",
]);
console.log(color_profile);

function preload() {
}

function setup() {

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);

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

  // FEATURE: TRANSPARECNTY VALUE
  colors = {
    "greyscale": {
      // background: color("#bbbbbb"),
      // backgroundnoise: color("#bbbbbb30"),
      background: color("#ffffff"),
      backgroundnoise: color("#ffffff60"),
      fillAll: [
        color("#444444"),
        color("#777777"),
        color("#cccccc")
      ],
      falllAllNoise: [
        color("#444444"),
        color("#666666"),
        color("#cccccc")
      ],
      duft: color("#222222"),
      duftNoise: color("#222222"),
    },
    "red": {
      // background: color("#ffb3b0"),
      // backgroundnoise: color("#ffb3b030"),
      background: color("#ffffff"),
      backgroundnoise: color("#ffffff70"),
      fillAll: [
        color("#a6433f"),
        color("#ff6961"),
        color("#ffd9d8")
      ],
      falllAllNoise: [
        color("#a6433f"),
        color("#ff6961"),
        color("#ffd9d8")
      ],
      duft: color("#5c2523"),
      duftNoise: color("#5c2523"),
    },
    "blue": {
      background: color("#ffffff"),
      backgroundnoise: color("#ffffff70"),
      fillAll: [
        color("#0000b3"),
        color("#809fff"),
        color("#bfcfff")
      ],
      falllAllNoise: [
        color("#0000b3"),
        color("#809fff"),
        color("#bfcfff")
      ],
      duft: color("#001f7d"),
      duftNoise: color("#001f7d"),
    },
    "blueey": {
      background: color("#B0C4DE"),
      backgroundnoise: color("#B0C4DE30"),
      fillAll: [
        color("#034694"),
        color("#318CE7"),
        color("#7CB9E8")
      ],
      falllAllNoise: [
        color("#034694"),
        color("#318CE7"),
        color("#7CB9E8")
      ],
      duft: color("#041E42"),
      duftNoise: color("#041E42"),
    },
    "paradise": {
      background: color("#dee0e6"),
      backgroundnoise: color("#dee0e630"),
      fillAll: [
        color("#1ac0c6"),
        color("#ff6150"),
        color("#ffa822")
      ],
      falllAllNoise: [
        color("#1ac0c6"),
        color("#ff6150"),
        color("#ffa822")
      ],
      duft: color("#134e6f"),
      duftNoise: color("#134e6f"),
    },
    "hund": {
      background: color("#dee0e6"),
      backgroundnoise: color("#dee0e630"),
      fillAll: [
        color("#e74645"),
        color("#fb7756"),
        color("#fdfa66")
      ],
      falllAllNoise: [
        color("#e74645"),
        color("#fb7756"),
        color("#fdfa66")
      ],
      duft: color("#1ac0c6"),
      duftNoise: color("#1ac0c6"),
    },
    "marienkäfer": {
      background: color("#ffffff"),
      backgroundnoise: color("#ffffff30"),
      fillAll: [
        color("#2c698d"),
        color("#bae8e8"),
        color("#e3f6f5")
      ],
      falllAllNoise: [
        color("#2c698d"),
        color("#bae8e8"),
        color("#e3f6f5")
      ],
      duft: color("#272643"),
      duftNoise: color("#272643"),
    }
  }


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
    inc: 0.004,  // noise increase for perlin noise
    gain: -255,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.65, // 0.65,  // random misplacement of the boxes
    density: 9, // 7,
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  TextureAData = {
    inc: 0.9,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].falllAllNoise[0], // colors[color_profile].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.5, // 0.65,  // random misplacement of the boxes
    density: 5, // 7,
    margin: 0, // distance to the edge
  }

  TextureBData = {
    inc: 0.0009,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].falllAllNoise[1], // color(90),  // drawn pixels for noise
    distortion: 0.9, // 0.65,  // random misplacement of the boxes
    density: 12, // 7,
    margin: 0, // distance to the edge
  }

  TextureCData = {
    inc: 0.005,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].falllAllNoise[2], // colors[color_profile].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.5, // 0.65,  // random misplacement of the boxes
    density: 12, // 7,
    margin: 0, // distance to the edge
  }

  TextureDuftData = {
    inc: 0.009,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[color_profile].background,  // drawn pixels for background
    colorForeground: colors[color_profile].duftNoise, // colors[color_profile].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.5, // 0.65,  // random misplacement of the boxes
    density: 7, // 7,
    margin: 0, // distance to the edge
  }

  ambientData = {
    shapeCount: duftArea.size / 110000, // number of shapes
    radioMin: AMBIENTRADIOMIN, // size
    radioMax: AMBIENTRADIOMAX, // size
    radioDistortion: 200,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: 0,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 3,
    solidColorStroke: colors[color_profile].duft,
    solidColorArea: colors[color_profile].fillAll,
    noiseColorArea: colors[color_profile].falllAllNoise,
    opacityFillValue: 150,
    opacityStrokeValue: 150,
    duftOrbit: false,
    duftArea: false,
    duftCounty: true,
    blur: 3,
    textureData: {
      inc: 0.009,  // noise increase for perlin noise
      gain: -255,  // -160 // COOL TO CHANGE
      colorBackground: undefined,// this.solidColorArea,  // drawn pixels for background
      distortion: 0.9,  // random misplacement of the boxes
      density: 10,
      // amountMax: 15, // how many rects per cell, max
      margin: 0, // distance to the edge
    }
  }


  lightData = {
    shapeCount: duftArea.size / 100000, // number of shapes - 70
    radioMin: LIGHTRADIOMIN, // size
    radioMax: LIGHTRADIOMAX, // size
    radioDistortion: 150,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to draw
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: false,
    solidstrokeWeight: 3,
    solidColorStroke: colors[color_profile].duft,
    solidColorArea: colors[color_profile].fillAll,
    noiseColorArea: colors[color_profile].falllAllNoise,
    opacityFillValue: 150,
    opacityStrokeValue: 150,
    duftOrbit: false,
    duftArea: true,
    blur: 1.5,
    textureData: {
      inc: 0.4,  // noise increase for perlin noise
      gain: -255,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 0.65,  // random misplacement of the boxes
      density: 6,
      // amountMax: 15, // how many rects per cell, max
      margin: 0, // distance to the edge
    }
  }

  highlightData = {
    shapeCount: 9, // number of shapes
    radioMin: 50, // size
    radioMax: 150, // size
    radioDistortion: 120,  // misplacement
    polygonCount: 2,  // how many overlapping polygons to drawo
    margin: 500,  // distance from edge
    curveTightness: 1,
    noColorStroke: true,
    solidstrokeWeight: 2,
    solidColorStroke: colors[color_profile].duft,
    solidColorArea: colors[color_profile].fillAll,
    noiseColorArea: colors[color_profile].falllAllNoise,
    duftOrbit: true,
    opacityFillValue: 150,
    opacityStrokeValue: 150,
    blur: 1,  // undefined,
    textureData: {
      inc: 0.4,  // noise increase for perlin noise
      gain: -255,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 0.65,  // random misplacement of the boxes
      density: 6,
      // amountMax: 15, // how many rects per cell, max
      margin: BACKGROUNDMARGIN, // distance to the edge
    }
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
    solidstrokeWeight: 4,
    solidColorStroke: color(20, 5),
    solidColorArea: colors[color_profile].duft,
    noiseColorArea: colors[color_profile].duftNoise,
    opacityFillValue: 170,
    opacityStrokeValue: 155,
    origin: duftOrigin,
    duft: true,
    duftOrbit: false,
    duftArea: false,
    blur: 1.5,
    textureData: {
      inc: 0.4,  // noise increase for perlin noise
      gain: -50,
      colorBackground: undefined,  // drawn pixels for background
      distortion: 0.65,  // random misplacement of the boxes
      density: 7,
      // amountMax: 15, // how many rects per cell, max
      margin: BACKGROUNDMARGIN, // distance to the edge
    }
  }

  wallTexture = new Pixies(wallTextureData);

  ambients = new Shapes(ambientData);
  lights = new Shapes(lightData);
  highlights = new Shapes(highlightData);
  duft = new Shapes(duftData);
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
    buffer.drawingContext.filter = 'blur(0.6px)';
    buffer.image(wallTexture.buffer, 0, 0);
    buffer.drawingContext.filter = 'none';
    buffer.pop()
  }

  if (MODE == 1) {
    buffer.push();
    buffer.drawingContext.filter = 'blur(0.1px)';
    buffer.image(ambients.buffer, 0, 0);
    buffer.drawingContext.filter = 'none';
    // buffer.image(ambients.bufferMasked, 0, 0);
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    buffer.drawingContext.filter = 'blur(0.1px)';
    buffer.image(lights.buffer, 0, 0);
    buffer.drawingContext.filter = 'none';
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    // buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(highlights.buffer, 0, 0);
    // this.buffer.drawingContext.filter = 'none';
    buffer.pop();
  }

  if (MODE == 1) {
    buffer.push()
    // buffer.drawingContext.filter = 'blur(0.2px)';
    buffer.image(duft.buffer, 0, 0);
    // this.buffer.drawingContext.filter = 'none';
    buffer.pop();
  }

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

  // DEBUG TEXTURES
  // buffer.clear();
  // buffer.background(colors[color_profile].background);
  // buffer.push()
  // // buffer.drawingContext.filter = 'blur(0.5px)';
  // buffer.image(textureA.buffer, 0, 0);
  // // buffer.image(textureB.buffer, 0, 0);
  // // buffer.image(textureC.buffer, 0, 0);
  // buffer.drawingContext.filter = 'none';
  // buffer.pop()

  image(buffer, - width / 2, - height / 2);

  noLoop();
  // fxpreview()


  // console.log("safety check for diff resolutions same hash: " + fxrand());

}
