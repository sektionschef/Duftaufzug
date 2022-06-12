// das vordere bleibt, das hintere filtert alles raus, wo im zweiten keine transparenz hat
function maskBuffers(textureBuffer, shapeBuffer) {
    var maskedBuffer;
    (maskedBuffer = textureBuffer.get()).mask(shapeBuffer.get());
    return maskedBuffer
}

function getRandomFromInterval(min, max) {
    return fxrand() * (max - min) + min;
}

function getRandomFromList(items) {
    return items[Math.floor(fxrand() * items.length)];
}

function distortColor(colorObject, max_diff) {
    if (typeof max_diff == "undefined") {
        max_diff = 10;
    }
    let red = (colorObject.levels[0] + getRandomFromInterval(-max_diff, max_diff));
    let green = (colorObject.levels[1] + getRandomFromInterval(-max_diff, max_diff));
    let blue = (colorObject.levels[2] + getRandomFromInterval(-max_diff, max_diff));
    let opacity = colorObject.levels[3];

    // not larger than 255 and not smaller than 0
    red = Math.min(Math.max(parseInt(red), 0), 255);
    green = Math.min(Math.max(parseInt(green), 0), 255);
    blue = Math.min(Math.max(parseInt(blue), 0), 255);

    return color(red, green, blue, opacity);
}

function brightenColor(colorObject, diff) {

    colorMode(HSB);
    brightnessNew = brightness(colorObject) + getRandomFromInterval(-diff, diff);
    resultingColor = color(hue(colorObject), saturation(colorObject), brightnessNew);

    // let diff_constant = getRandomFromInterval(-diff, diff)
    // let red = (colorObject.levels[0] + diff_constant);
    // let green = (colorObject.levels[1] + diff_constant);
    // let blue = (colorObject.levels[2] + diff_constant);
    // let opacity = colorObject.levels[3];

    // // not larger than 255 and not smaller than 0
    // red = Math.min(Math.max(parseInt(red), 0), 255);
    // green = Math.min(Math.max(parseInt(green), 0), 255);
    // blue = Math.min(Math.max(parseInt(blue), 0), 255);

    // return color(red, green, blue, opacity);
    colorMode(RGB);
    // return colorObject
    return resultingColor
}

function brightenColorStatic(colorObject, diff) {
    colorMode(HSB);
    brightnessNew = brightness(colorObject) + diff;
    resultingColor = color(hue(colorObject), saturation(colorObject), brightnessNew);
    colorMode(RGB);
    return resultingColor
}

function saturateColorStatic(colorObject, diff) {
    colorMode(HSB);
    saturationNew = saturation(colorObject) + diff;
    resultingColor = color(hue(colorObject), saturationNew, brightness(colorObject));
    colorMode(RGB);
    return resultingColor
}

function lessenColor(colorObject, diff) {
    let diff_constant = getRandomFromInterval(0, -diff)
    let red = colorObject.levels[0];
    let green = colorObject.levels[1];
    let blue = colorObject.levels[2];
    // let opacity = (colorObject.levels[3] - diff_constant);
    let opacity = constrain(colorObject.levels[3] + diff_constant, 0, 255);

    return color(red, green, blue, opacity);
}

function fromHSBtoRGB(colorObject) {
    colorMode(RGB);
    return color(red(colorObject), green(colorObject), blue(colorObject));
}

// calculate the scaling params - choose the limiting factor either height or width
function scaleDynamically() {

    scaleRatio = 1;  // scale to window width
    exportRatio = 5;  // scale to the export dimensions
    dynamicWidthRatio = exportPaper.width / windowWidth;
    dynamicHeightRatio = exportPaper.height / windowHeight;

    if (dynamicWidthRatio > dynamicHeightRatio) {
        logging.debug("Width is smaller than height. Width dominates")
        exportRatio = dynamicWidthRatio;
    } else {
        logging.debug("width is larger than height. Height dominates.")
        exportRatio = dynamicHeightRatio;
    }

    rescaling_width = exportPaper.width / exportRatio;
    rescaling_height = exportPaper.height / exportRatio;
}

// each time window.innerWidth changes
function windowResized() {
    logging.debug("Window is resized.");
    scaleDynamically()

    // redo
    resizeCanvas(rescaling_width, rescaling_height);
    buffer = createGraphics(rescaling_width, rescaling_height);

    wallBuffer = createGraphics(rescaling_width, rescaling_height);

    draw();
}

function keyTyped() {
    if (key === 'e' || key == 'E') {
        exportHighResolution();
    } else if (key === "r") {
        // reset_camera()
    } else if (key === "c") {
        // camera(0, 0, height * 1.5, 0, 0, 0, 0, 1, 0);
    }
}


function label_feature(value, min, max) {
    let label;
    let third = (max - min) / 3

    if (value < (min + third)) {
        label = "low"
    } else if (value < min + third * 2) {
        label = "medium"
    } else {
        label = "high"
    }
    return label
}


function hashFnv32a(str, asString, seed) {
    /*jshint bitwise:false  https://www.codegrepper.com/code-examples/javascript/js+hash+string+to+number */
    var i, l, hval = (seed === undefined) ? 0x811c9dc5 : seed;

    for (i = 0, l = str.length; i < l; i++) {
        hval ^= str.charCodeAt(i);
        hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
    }
    if (asString) {
        // Convert to 8 digit hex string
        return ("0000000" + (hval >>> 0).toString(16)).substr(-8);
    }
    return hval >>> 0;
}


function exportHighResolution() {
    scaleRatio = exportRatio;

    // Re-create buffer with exportRatio and re-draw
    buffer = createGraphics(scaleRatio * width, scaleRatio * height);
    draw();

    // Get timestamp to name the ouput file
    let timestamp = new Date().getTime();

    // Save as PNG
    save(buffer, str(timestamp), 'png');

    // Reset scaleRation back to 1, re-create buffer, re-draw
    scaleRatio = 1;
    buffer = createGraphics(width, height);
    draw();
}