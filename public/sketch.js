// https://www.kindacode.com/article/javascript-get-current-date-time-in-yyyy-mm-dd-hh-mm-ss-format/


const MODE = 1  // "FINE ART";
// const MODE = 2  // basic image
// const MODE = 5 // all debug messages

NOISESEED = hashFnv32a(fxhash);
// console.log("Noise seed: " + NOISESEED);

let exportPaper = {
  width: 4000,
  height: 4000
  // width: 3840,  // STAMMERSDORF
  // height: 2160  // STAMMERSDORF
}

let BACKGROUNDMARGIN = 200;
let MARGINDUFTORIGIN = 1500;
let DUFTRADIOMIN = 300;
let DUFTRADIOMAX = 350;
let LIGHTRADIOMIN = 200;
let LIGHTRADIOMAX = 400;
let AMBIENTRADIOMIN = 300;
let AMBIENTRADIOMAX = 600;
defineColorPalettes();

let scaleRatio;
let exportRatio;
let buffer;
let canvas;
let rescaling_width;
let rescaling_height;
let duftArea = {};
let duftCounty = {};

let PALETTE = getRandomFromList([
  "Red",
  "Greyscale",
  "Blue",
  "Blueey",
  "Paradise",
  "Hund",
  "Marienkäfer",
]);

function preload() {
}

function setup() {

  noiseSeed(NOISESEED);
  randomSeed(NOISESEED);
  // setAttributes('antialias', true);

  // console.log("Pixel density: " + pixelDensity())
  exportRatio /= pixelDensity();


  scaleDynamically();

  createLayers();
  defineColorPalettes();
  defineAllAreas();
  defineAllElements();
  createAllElements();
}


function draw() {

  // orbitControl(1, 1, 0.1);

  ambientLight(255, 255, 255);
  ambientMaterial(255);

  // IS THIS NEEDED????
  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(colors[PALETTE].background);

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
  // buffer.background(colors[PALETTE].background);
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


function createLayers() {
  canvas = createCanvas(rescaling_width, rescaling_height, WEBGL);
  buffer = createGraphics(rescaling_width, rescaling_height);

  lightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  highlightTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftTextureBuffer = createGraphics(rescaling_width, rescaling_height);
  duftShapeBuffer = createGraphics(rescaling_width, rescaling_height);
  lineBuffer = createGraphics(rescaling_width, rescaling_height);
}

function defineDuftOrigin() {
  duftOrigin = createVector(
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.width - MARGINDUFTORIGIN),
    getRandomFromInterval(0 + MARGINDUFTORIGIN, exportPaper.height - MARGINDUFTORIGIN)
  );
}

function defineDuftOrbit() {
  duftOrbit = (DUFTRADIOMAX - DUFTRADIOMIN) / 2 + DUFTRADIOMIN;
}

function defineDuftArea() {
  duftArea.orientation = getRandomFromList(["down", "left", "up", "right"]);

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
}

function defineDuftCounty() {
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
}

function defineAllAreas() {
  defineDuftOrigin();
  defineDuftOrbit();
  defineDuftArea();
  defineDuftCounty();
}

function createAllElements() {
  wallTexture = new Pixies(wallTextureData);

  ambients = new Shapes(ambientData);
  lights = new Shapes(lightData);
  highlights = new Shapes(highlightData);
  duft = new Shapes(duftData);
}

function defineAllElements() {
  wallTextureData = {
    inc: 0.004,  // noise increase for perlin noise
    gain: -255,
    colorBackground: undefined, // colors[PALETTE].background,  // drawn pixels for background
    colorForeground: colors[PALETTE].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.65, // 0.65,  // random misplacement of the boxes
    density: 9, // 7,
    margin: BACKGROUNDMARGIN, // distance to the edge
  }

  TextureAData = {
    inc: 0.9,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[PALETTE].background,  // drawn pixels for background
    colorForeground: colors[PALETTE].falllAllNoise[0], // colors[PALETTE].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.5, // 0.65,  // random misplacement of the boxes
    density: 5, // 7,
    margin: 0, // distance to the edge
  }

  TextureBData = {
    inc: 0.0009,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[PALETTE].background,  // drawn pixels for background
    colorForeground: colors[PALETTE].falllAllNoise[1], // color(90),  // drawn pixels for noise
    distortion: 0.9, // 0.65,  // random misplacement of the boxes
    density: 12, // 7,
    margin: 0, // distance to the edge
  }

  TextureCData = {
    inc: 0.005,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[PALETTE].background,  // drawn pixels for background
    colorForeground: colors[PALETTE].falllAllNoise[2], // colors[PALETTE].backgroundnoise, // color(90),  // drawn pixels for noise
    distortion: 0.5, // 0.65,  // random misplacement of the boxes
    density: 12, // 7,
    margin: 0, // distance to the edge
  }

  TextureDuftData = {
    inc: 0.009,  // noise increase for perlin noise
    gain: 100,
    colorBackground: undefined, // colors[PALETTE].background,  // drawn pixels for background
    colorForeground: colors[PALETTE].duftNoise, // colors[PALETTE].backgroundnoise, // color(90),  // drawn pixels for noise
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
    solidColorStroke: colors[PALETTE].duft,
    solidColorArea: colors[PALETTE].fillAll,
    noiseColorArea: colors[PALETTE].falllAllNoise,
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
    solidColorStroke: colors[PALETTE].duft,
    solidColorArea: colors[PALETTE].fillAll,
    noiseColorArea: colors[PALETTE].falllAllNoise,
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
    solidColorStroke: colors[PALETTE].duft,
    solidColorArea: colors[PALETTE].fillAll,
    noiseColorArea: colors[PALETTE].falllAllNoise,
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
    solidColorArea: colors[PALETTE].duft,
    noiseColorArea: colors[PALETTE].duftNoise,
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
}


function defineColorPalettes() {
  colors = {
    "Greyscale": {
      // background: "#bbbbbb",
      // backgroundnoise: "#bbbbbb30",
      background: "#ffffff",
      backgroundnoise: "#ffffff60",
      fillAll: [
        "#444444",
        "#777777",
        "#cccccc"
      ],
      falllAllNoise: [
        "#444444",
        "#666666",
        "#cccccc"
      ],
      duft: "#222222",
      duftNoise: "#222222",
    },
    "Red": {
      // background: "#ffb3b0",
      // backgroundnoise: "#ffb3b030",
      background: "#ffffff",
      backgroundnoise: "#ffffff70",
      fillAll: [
        "#a6433f",
        "#ff6961",
        "#ffd9d8"
      ],
      falllAllNoise: [
        "#a6433f",
        "#ff6961",
        "#ffd9d8"
      ],
      duft: "#5c2523",
      duftNoise: "#5c2523",
    },
    "Blue": {
      background: "#ffffff",
      backgroundnoise: "#ffffff70",
      fillAll: [
        "#0000b3",
        "#809fff",
        "#bfcfff"
      ],
      falllAllNoise: [
        "#0000b3",
        "#809fff",
        "#bfcfff"
      ],
      duft: "#001f7d",
      duftNoise: "#001f7d",
    },
    "Blueey": {
      background: "#B0C4DE",
      backgroundnoise: "#B0C4DE30",
      fillAll: [
        "#034694",
        "#318CE7",
        "#7CB9E8"
      ],
      falllAllNoise: [
        "#034694",
        "#318CE7",
        "#7CB9E8"
      ],
      duft: "#041E42",
      duftNoise: "#041E42",
    },
    "Paradise": {
      background: "#dee0e6",
      backgroundnoise: "#dee0e630",
      fillAll: [
        "#1ac0c6",
        "#ff6150",
        "#ffa822"
      ],
      falllAllNoise: [
        "#1ac0c6",
        "#ff6150",
        "#ffa822"
      ],
      duft: "#134e6f",
      duftNoise: "#134e6f",
    },
    "Hund": {
      background: "#dee0e6",
      backgroundnoise: "#dee0e630",
      fillAll: [
        "#e74645",
        "#fb7756",
        "#fdfa66"
      ],
      falllAllNoise: [
        "#e74645",
        "#fb7756",
        "#fdfa66"
      ],
      duft: "#1ac0c6",
      duftNoise: "#1ac0c6",
    },
    "Marienkäfer": {
      background: "#ffffff",
      backgroundnoise: "#ffffff30",
      fillAll: [
        "#2c698d",
        "#bae8e8",
        "#e3f6f5"
      ],
      falllAllNoise: [
        "#2c698d",
        "#bae8e8",
        "#e3f6f5"
      ],
      duft: "#272643",
      duftNoise: "#272643",
    }
  }
}