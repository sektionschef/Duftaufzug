
function create_noise_fog(
    // custom_width,
    // custom_height,
    // colorObject1,
    // colorObject2,
    // inc,
    // noiseDetailLod,
    // noiseDetailFalloff,
    // opacityValue,
) {

    // noiseDetail(noiseDetailLod, noiseDetailFalloff);
    // let buffer = createGraphics(custom_width, custom_height);

    let colorObject1 = color("red");
    let colorObject2 = color("blue");
    let inc = 0.01;
    let opacityValue = 255;

    let yoff = 0;
    buffer.loadPixels();
    for (let y = 0; y < buffer.height; y++) {
        let xoff = 0;
        for (let x = 0; x < buffer.width; x++) {
            let index = (x + y * buffer.width) * 4;

            // let r = noise(xoff, yoff) * 255;
            // buffer.pixels[index + 0] = r;
            // buffer.pixels[index + 1] = r;
            // buffer.pixels[index + 2] = r;
            // buffer.pixels[index + 3] = r;  // 255

            // CUSTOM COLOR
            // let gain = 50;
            // let r = noise(xoff, yoff);
            // buffer.pixels[index + 0] = colorObject.levels[0] + r * gain;
            // buffer.pixels[index + 1] = colorObject.levels[1] + r * gain;
            // buffer.pixels[index + 2] = colorObject.levels[2] + r * gain;
            // buffer.pixels[index + 3] = opacityValue;

            // mix colors
            let r = noise(xoff, yoff);
            let mixedColor = lerpColor(colorObject1, colorObject2, r)
            buffer.pixels[index + 0] = mixedColor.levels[0];
            buffer.pixels[index + 1] = mixedColor.levels[1];
            buffer.pixels[index + 2] = mixedColor.levels[2];
            buffer.pixels[index + 3] = opacityValue;




            // let r = noise(xoff, yoff) * getRandomFromInterval(0, 80);
            // let g = noise(xoff, yoff) * getRandomFromInterval(0, 80);
            // let b = noise(xoff, yoff) * getRandomFromInterval(0, 80);
            // buffer.pixels[index + 0] = colorObject.levels[0] + r;
            // buffer.pixels[index + 1] = colorObject.levels[1] + g;
            // buffer.pixels[index + 2] = colorObject.levels[2] + b;
            // buffer.pixels[index + 3] = opacityValue;

            xoff += inc;
        }
        yoff += inc;
    }
    buffer.updatePixels();

    return buffer;
}



function get_dirty(
    // custom_width,
    // custom_height,
    // colorObject1,
    // colorObject2,
    // inc,
    // noiseDetailLod,
    // noiseDetailFalloff,
    // opacityValue,
) {

    // noiseDetail(noiseDetailLod, noiseDetailFalloff);
    // let buffer = createGraphics(custom_width, custom_height);

    let colorObject1 = color("red");
    let colorObject2 = color("blue");
    let inc = 0.1;
    let opacityValue = 255;

    let scl = 100;
    let cols = floor(exportPaper.width / scl);
    let rows = floor(exportPaper.height / scl);


    let zoff = 0;
    var yoff = 0;
    for (var y = 0; y < rows; y++) {
        var xoff = 0;
        for (var x = 0; x < cols; x++) {
            var index = x + y * cols;

            // let yoff = 0;
            // for (let y = 0; y < exportPaper.height; y++) {
            //     let xoff = 0;
            //     for (let x = 0; x < exportPaper.width; x++) {
            //         let index = (x + y * exportPaper.width) * 4;

            // mix colors
            let r = noise(xoff, yoff, zoff);

            buffer.push();
            buffer.translate(x * cols / exportRatio, y * rows / exportRatio);
            // buffer.noFill();
            buffer.fill(133, r * 255);
            buffer.stroke(100, 10);
            // buffer.noStroke();
            buffer.rect(0, 0, 10, 10);
            buffer.pop();

            xoff += inc;
        }
        yoff += inc;
    }

    return buffer;
}

