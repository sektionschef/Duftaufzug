// trace, debug, info, warn, error
// const SWITCH_LOGGING_LEVEL = "warn";
const SWITCH_LOGGING_LEVEL = "info";
// const SWITCH_LOGGING_LEVEL = "debug";

const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = CANVAS_WIDTH;


// variable stuff
let SCALING_FACTOR = 1;
let rescaling_width;
let rescaling_height;
let preview_called = false;

let fxhash_number;
let xoff = 0;


logging.info("FXHASH: " + fxhash);

function preload() {
}

function setup() {

    pixelDensity(1);
    logging.setLevel(SWITCH_LOGGING_LEVEL);

    // let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL).parent('canvasHolder');
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT, WEBGL);

    NOISESEED = hashFnv32a(fxhash);
    logging.debug("Noise seed: " + NOISESEED);
    noiseSeed(NOISESEED);

    resize_canvas();


    //  NOT NECESSARY | 
    // flowfield = new FlowField(600, 300);

    // NOT NECESSARY | RANDOM AREAS
    // let minAreaSize = 100;
    // let maxAreaSize = 350;
    // let minPosX = - width / 2 - 50;
    // let minPosY = - height / 2 - 50;
    // let maxPosX = width / 2 + 50;
    // let maxPosY = height / 2 + 50;
    // // let colorArea = own color for each area
    // all_areas = []
    // for (let i = 0; i < 180; i++) {
    //     let random_color_code = getRandomFromList(["#123456", "#babdff", "#a0a3e8", "#9fa2ed", "#9799d1", "#fadc57"]);
    //     // let random_color_code = ("#babdff" + getRandomFromList(["f3", "cc", "99", "43"]))
    //     all_areas.push(
    //         new Paint(
    //             getRandomFromInterval(minAreaSize, maxAreaSize),
    //             getRandomFromInterval(minAreaSize, maxAreaSize),
    //             getRandomFromInterval(minPosX, maxPosX),
    //             getRandomFromInterval(minPosY, maxPosY),
    //             random_color_code
    //         ));
    // }

    // paperData = {
    //     custom_width: width,
    //     custom_height: height,
    //     posX: - width / 2,
    //     posY: - height / 2,
    //     colorObject: color(255, 5),
    // }
    // paper = new Corroded(paperData);

    // NOT NECESSARY |   
    // dots = Pattern.create_dots(width, height);
    // normal_noise = Pattern.create_noise(100, 100);
    // lines = Pattern.create_lines(width, height);
    // bars = Pattern.create_bars(width, height);
    // noise_fog = Pattern.create_noise_fog(width, height, color1, color3, 0.009, 12, 0.5, 255);
    // grainy_gradient = Pattern.create_grainy_gradient(width, height);


    // splatter = new SplitterSplatter();

    // binomial_points = [];

    // for (var i = 0; i < 500; i++) {
    //     x_input = getRandomFromInterval(1, 600)
    //     binomial_points.push(createVector(x_input, (betaPDF(x = 0.5, a = x_input, b = x_input) * 10)));
    // }
    // console.log(binomial_points);

}


function draw() {

    // orbitControl(1, 1, 0.1);
    ambientLight(255, 255, 255);
    ambientMaterial(255);

    background(200);

    // paper.show();
    // splatter.show();  // out


    // maska
    // brush.buffer = brush.buffer.get();
    // brush.buffer.mask(fog.buffer);

    // RANDOM AREAS
    // for (let area of all_areas) {
    //     area.show();
    //     image(area.buffer, area.posX, area.posY, area.buffer.width, area.buffer.height);
    // }

    // PERLIN NOISE
    // image(noise_fog, - width / 2, - height / 2, noise_fog.width, noise_fog.height);

    // image(backup, - width / 2, - height / 2, backup.width * SCALING_FACTOR, backup.height * SCALING_FACTOR);
    // image(backdown, - width / 2, - height / 2 + backup.height + backmiddle.height, backdown.width * SCALING_FACTOR, backdown.height * SCALING_FACTOR);

    // image(sphere, - sphere.width / 2, - sphere.height / 2, sphere.width * SCALING_FACTOR, sphere.height * SCALING_FACTOR);

    // image(backmiddle, - width / 2, - height / 2 + backup.height, backmiddle.width * SCALING_FACTOR, backmiddle.height * SCALING_FACTOR);
    // image(grainy_gradient, - width / 2, - height / 2, grainy_gradient.width, grainy_gradient.height);



    // BINOMIAL FUNCTION
    // for (var i = 0; i < binomial_points.length; i++) {
    //     push();
    //     strokeWeight(2);
    //     point(binomial_points[i].x, binomial_points[i].y);
    //     pop();
    // }


    // if (grid.boxes_completely_run == true && preview_called == false) {
    //   logging.debug("all work is done");
    //   fxpreview();
    //   preview_called = true;
    // }



    // PERLIN Noise
    // image(flowfield.update_noise(), 0, 0);


    // example for background layer of paintbrush
    // testSphere.show();

    // testPaint.show();


    noLoop();

}


// BINOMIAL FUNCTION
// https://github.com/royhzq/betajs
function betaPDF(x, a, b) {
    // Beta probability density function impementation
    // using logarithms, no factorials involved.
    // Overcomes the problem with large integers
    return Math.exp(lnBetaPDF(x, a, b))
}
function lnBetaPDF(x, a, b) {
    // Log of the Beta Probability Density Function
    return ((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x)) - lnBetaFunc(a, b)
}
function lnBetaFunc(a, b) {
    // Log Beta Function
    // ln(Beta(x,y))
    foo = 0.0;

    for (i = 0; i < a - 2; i++) {
        foo += Math.log(a - 1 - i);
    }
    for (i = 0; i < b - 2; i++) {
        foo += Math.log(b - 1 - i);
    }
    for (i = 0; i < a + b - 2; i++) {
        foo -= Math.log(a + b - 1 - i);
    }
    return foo
}

