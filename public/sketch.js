// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

logging.setLevel(SWITCH_LOGGING_LEVEL);

console.info("fxhash: " + fxhash);
NOISESEED = hashFnv32a(fxhash);
logging.debug("Noise seed: " + NOISESEED);

PALETTE = getRandomFromList(["greyscale", "full color complimentary", "full color triadic", "weak color complimentary", "weak color triadic", "dark color complimentary", "dark color triadic"]);
// PALETTE = getRandomFromList(["greyscale"]);  // STAMMERSDORF
console.info("Palette: " + PALETTE);

NUMBEROFELEMENTS = Math.round(getRandomFromInterval(10, 25));
NUMBEROFELEMENTS_LABEL = label_feature(NUMBEROFELEMENTS, 10, 25);
console.info("Number of elements: " + NUMBEROFELEMENTS_LABEL + ", " + NUMBEROFELEMENTS)

BRUSHLENGTHANDBREADTH = Math.round(getRandomFromInterval(100, 160));
BRUSHLENGTHANDBREADTH_LABEL = label_feature(BRUSHLENGTHANDBREADTH, 100, 160)
console.info("Brush length: " + BRUSHLENGTHANDBREADTH_LABEL + ", " + BRUSHLENGTHANDBREADTH)

BRUSHSTROKESIZE = getRandomFromInterval(1.5, 2.5);
BRUSHSTROKESIZE_LABEL = label_feature(BRUSHSTROKESIZE, 1.5, 2.5)
console.info("Brush stroke size: " + BRUSHSTROKESIZE_LABEL + ", " + BRUSHSTROKESIZE.toFixed(2))


GRIDVISIBLE = false  // maybie  getRandomFromList([true, false]);

CANVASROUGHNESS = 80;  // fix

NUMBERPAINTLAYERS = getRandomFromList([2]);  // best 2
GRIDBRIGHTNESSDIFF = -10;  // fix

BRUSHBRIGHTNESSNOISE = 10 // fix
if (PALETTE != "greyscale") {
  BRUSHCOLORNOISE = 10  // fix
} else if (PALETTE == "greyscale") {
  BRUSHCOLORNOISE = 0;
}
BRUSHANGLENOISE = getRandomFromInterval(Math.PI / 20, Math.PI / 80);  // best PI / 40
BRUSHANGLENOISE_LABEL = label_feature(BRUSHANGLENOISE, Math.PI / 80, Math.PI / 20)
console.info("Brush angle noise: " + BRUSHANGLENOISE_LABEL + ", " + BRUSHANGLENOISE.toFixed(2));
BRUSHBREADTHNOISE = 0.2;
BRUSHLENGTHNOISE = 0.2;
BRUSHFIBRESPARSENESS = Math.round(getRandomFromInterval(5, 7));  // 5  STAMMERSDORF
BRUSHFIBRESPARSENESS_LABEL = label_feature(BRUSHFIBRESPARSENESS, 5, 7)
console.info("Brush fibre sparseness: " + BRUSHFIBRESPARSENESS_LABEL + ", " + BRUSHFIBRESPARSENESS);


FIBREBRIGHTNESSNOISE = 3;
FIBRECOLORNOISE = 3;
FIBRESTROKESIZENOISE = 0.6;  // fix
FIBRESTARTLENGTHNOISE = getRandomFromInterval(30, 70);
console.info("Fibre start length: " + Math.round(FIBRESTARTLENGTHNOISE));
FIBREBREADTHNOISE = 0.2 // getRandomFromInterval(1, 5); cool 0.2
FIBREROTATIONNOISE = getRandomFromInterval(Math.PI / 30, Math.PI / 70); // PI / 30<->PI / 50
FIBREROTATIONNOISE_LABEL = label_feature(FIBREROTATIONNOISE, Math.PI / 70, Math.PI / 30)
console.info("Fibre rotation noise: " + FIBREROTATIONNOISE_LABEL + ", " + FIBREROTATIONNOISE.toFixed(2));
FIBREOPACITYNOISEBASE = Math.round(getRandomFromInterval(70, 140));
console.info("Fibre opacity noise: " + FIBREOPACITYNOISEBASE);
FIBRELENGTHPERLIN = 0.3;  // 0.01<->0.03
FIBREOPACITYPERLIN = 0.4;


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

  colorPalette = new ColorPalette();

  color1 = colorPalette.primaryColor;
  color2 = colorPalette.secondaryColor;

  logging.debug("color1:")
  logging.debug(color1);
  logging.debug("color2:")
  logging.debug(color2);


  color1b = saturateColorStatic(brightenColorStatic(color1, GRIDBRIGHTNESSDIFF), GRIDBRIGHTNESSDIFF);
  color1b = lerpColor(color1b, color(72, 61, 139), 0.1);  // add some blue
  color2b = saturateColorStatic(brightenColorStatic(color2, GRIDBRIGHTNESSDIFF), GRIDBRIGHTNESSDIFF);
  color2b = lerpColor(color2b, color(72, 61, 139), 0.1);  // add some blue

  // lineColor1 = brightenColorStatic(color1, +60);
  // lineColor1b = brightenColorStatic(color1b, +60);
  // lineColor1 = color(20, 150);
  // lineColor1b = color(20, 150);
  lineColor1 = color(color2);
  lineColor1b = color(color2b);

  colorMode(HSB);
  let canvasColor = fromHSBtoRGB(color(hue(color1), 4, CANVASROUGHNESS));
  colorMode(RGB);

  // canvasData = {
  //   custom_width: exportPaper.width,
  //   custom_height: exportPaper.height,
  //   posX: 0,
  //   posY: 0,
  //   colorObject: color(130),
  //   opacity: 50,  // 100
  //   cellPerLine: 150,
  //   strokeWeight_: 1,
  //   deviation: 0.3,
  // }

  agentPaintData1 = {
    customWidth: exportPaper.width,
    customHeight: exportPaper.height,
    posXImage: 0,
    posYImage: 0,
    colorObject: color(color1b),
    stepSize: 20,
    agentSize: 10,
    opacityLine: 2,
    opacityPoint: 2,
    lineLength: 20,
    loopSize: 100,
    numberAgents: 55,
  }

  agentPaintData2 = {
    customWidth: exportPaper.width,
    customHeight: exportPaper.height,
    posXImage: 0,
    posYImage: 0,
    colorObject: color(color2b),
    stepSize: 20,
    agentSize: 10,
    opacityLine: 2,
    opacityPoint: 2,
    lineLength: 20,
    loopSize: 100,
    numberAgents: 55,
  }

  backgroundSphereData = {
    custom_width: exportPaper.width,
    custom_height: exportPaper.height,
    posX: 0,
    posY: 0,
    // colorObject: color(255),  // cool
    // colorObject: color(255, 232, 189),  // cool
    elementSizeMin: 80,
    elementSizeMax: 180,
    colorObject: canvasColor,
    margin: -50,
    fillColorNoise: 10,
    fillColorOpacityMax: 70,
    noStroke: true,
    strokeWeight: 1,
    strokeColorNoise: 0,
    strokeOpacityMax: 2,
    numberQuantisizer: 8// getRandomFromInterval(5, 8),
  }

  frontGridData = {
    minSize: 200,  // 50
    maxSize: 700,  // 200
    numberRects: NUMBEROFELEMENTS,
    firstLevelColors: [color1],
    secondLevelColors: [color2],
    lineColor: lineColor1,
    padding: 200,
    firstShadow: true,
  }

  backGridData = {
    minSize: 550,  // 100
    maxSize: 1000,  // 500
    numberRects: NUMBEROFELEMENTS,
    firstLevelColors: [color1b],
    secondLevelColors: [color2b],
    lineColor: lineColor1b,
    padding: 200,
    firstShadow: false,
  }

  CanvasAgentData = {
    posXImage: 0,
    posYImage: 0,
    customWidth: exportPaper.width,
    customHeight: exportPaper.height,
    colorObject: color(150),
    stepSize: 60,  // 10 is hero
    agentSize: 8,
    opacityLine: 15,
    opacityPoint: 15,
    lineLength: 20,
    loopSize: 4000,
    numberAgents: 5,
  }

  // canvas = new CanvasOverlay(canvasData);
  canvasAgent = new DumbAgent(CanvasAgentData);
  agentPaint1 = new DumbAgent(agentPaintData1);
  agentPaint2 = new DumbAgent(agentPaintData2);
  backgroundSphere = new paintedSphere(backgroundSphereData);
  frontGrid = new IntersectGrid(frontGridData);
  backGrid = new IntersectGrid(backGridData);
}


function draw() {

  // orbitControl(1, 1, 0.1);
  ambientLight(255, 255, 255);
  ambientMaterial(255);

  buffer.clear();
  buffer.scale(scaleRatio);

  buffer.background(250);

  backgroundSphere.show();

  canvasAgent.show();

  backGrid.show();

  agentPaint1.show();
  agentPaint2.show();
  frontGrid.show();

  // canvas.show();

  // document
  // absolute value / exportRatio
  // DUMMY POSITIONING
  // buffer.push();
  // rectMode(CENTER);
  // buffer.fill("pink");
  // buffer.translate(getRandomFromInterval(exportPaper.width / 2, exportPaper.width) / exportRatio, 2000 / exportRatio);
  // buffer.rect(0, 0, 60 / exportRatio, 60 / exportRatio);
  // buffer.pop();

  image(buffer, -width / 2, - height / 2);

  noLoop();
  fxpreview()

  console.info("safety check for diff resolutions same hash: " + fxrand());

}
