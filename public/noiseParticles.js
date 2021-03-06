// class noiseParticles {

//     constructor(data) {

//         // noiseDetail(noiseDetailLod, noiseDetailFalloff);

//         this.buffer = data.buffer;
//         this.inc = data.inc;
//         this.colorSolid = data.colorSolid;
//         this.opacityValue = data.opacityValue;
//         this.scl = data.scl;
//         this.distortion = data.distortion;
//         this.amountMax = data.amountMax;
//         this.margin = data.margin;

//         this.width = exportPaper.width - 2 * this.margin;
//         this.height = exportPaper.height - 2 * this.margin;

//         this.cols = this.width / this.scl;
//         this.rows = this.height / this.scl;

//         this.particles = []

//         var yoff = 0;
//         for (var y = 0; y < this.rows; y++) {
//             var xoff = 0;
//             for (var x = 0; x < this.cols; x++) {

//                 let r = noise(xoff, yoff);

//                 for (var amount = 0; amount < r * this.amountMax; amount++) {

//                     // console.log(amount);

//                     this.particles.push(
//                         {
//                             posX: (this.margin + x * this.scl) + getRandomFromInterval(0, this.distortion),
//                             posY: (this.margin + y * this.scl) + getRandomFromInterval(0, this.distortion),
//                             colorObject: color(this.colorSolid, this.opacityValue),
//                             width: this.scl,
//                             height: this.scl

//                         }
//                     )
//                 }

//                 xoff += this.inc;
//             }
//             yoff += this.inc;
//         }

//         this.drawAll();
//     }

//     drawAll() {

//         this.buffer.clear();
//         this.buffer.scale(scaleRatio);

//         this.buffer.push();

//         // this.buffer.noFill();

//         // with RECT
//         this.buffer.noStroke();

//         for (var particle of this.particles) {

//             this.buffer.push();
//             this.buffer.fill(particle.colorObject);
//             this.buffer.translate(particle.posX / exportRatio, particle.posY / exportRatio);

//             this.buffer.rect(0, 0, particle.width / exportRatio, particle.height / exportRatio);

//             // console.log(particle.width / exportRatio);

//             // with Points
//             // this.buffer.stroke(particle.colorObject);
//             // this.buffer.strokeWeight(particle.width / exportRatio);
//             // this.buffer.point(0, 0);

//             this.buffer.pop();
//         }

//         this.buffer.pop();

//         // debug buffer size
//         // this.buffer.noFill();
//         // this.buffer.fill(255, 0, 0);
//         // this.buffer.strokeWeight(1);
//         // this.buffer.rect(0, 0, this.buffer.width, this.buffer.height);
//     }
// }


// class noisePixel {

//     constructor(data) {
//         // noiseDetail(noiseDetailLod, noiseDetailFalloff);
//         this.buffer = data.buffer;
//         var inc = data.inc;

//         let yoff = 0;
//         this.buffer.loadPixels();
//         for (let y = 0; y < this.buffer.height; y++) {
//             let xoff = 0;
//             for (let x = 0; x < this.buffer.width; x++) {
//                 let index = (x + y * this.buffer.width) * 4;

//                 // let r = noise(xoff, yoff) * 255;
//                 // this.buffer.pixels[index + 0] = r;
//                 // this.buffer.pixels[index + 1] = r;
//                 // this.buffer.pixels[index + 2] = r;
//                 // this.buffer.pixels[index + 3] = r;  // 255

//                 // quite cool texture
//                 if (fxrand() > 0.75) {
//                     let r = noise(xoff, yoff) * 255;
//                     this.buffer.pixels[index + 0] = r;
//                     this.buffer.pixels[index + 1] = r;
//                     this.buffer.pixels[index + 2] = r;
//                     this.buffer.pixels[index + 3] = r;  // 255
//                 }

//                 // CUSTOM COLOR
//                 // let gain = 50;
//                 // let r = noise(xoff, yoff);
//                 // this.buffer.pixels[index + 0] = colorObject.levels[0] + r * gain;
//                 // this.buffer.pixels[index + 1] = colorObject.levels[1] + r * gain;
//                 // this.buffer.pixels[index + 2] = colorObject.levels[2] + r * gain;
//                 // this.buffer.pixels[index + 3] = opacityValue;

//                 // mix colors
//                 // let r = noise(xoff, yoff);
//                 // let mixedColor = lerpColor(colorObject1, colorObject2, r)
//                 // this.buffer.pixels[index + 0] = mixedColor.levels[0];
//                 // this.buffer.pixels[index + 1] = mixedColor.levels[1];
//                 // this.buffer.pixels[index + 2] = mixedColor.levels[2];
//                 // this.buffer.pixels[index + 3] = opacityValue;


//                 // let r = noise(xoff, yoff) * getRandomFromInterval(0, 80);
//                 // let g = noise(xoff, yoff) * getRandomFromInterval(0, 80);
//                 // let b = noise(xoff, yoff) * getRandomFromInterval(0, 80);
//                 // this.buffer.pixels[index + 0] = colorObject.levels[0] + r;
//                 // this.buffer.pixels[index + 1] = colorObject.levels[1] + g;
//                 // this.buffer.pixels[index + 2] = colorObject.levels[2] + b;
//                 // this.buffer.pixels[index + 3] = opacityValue;

//                 xoff += inc;
//             }
//             yoff += inc;
//         }
//         this.buffer.updatePixels();
//     }
// }


class Pixies {

    constructor(data) {
        this.inc = data.inc;
        this.gain = data.gain;
        this.colorBackground = data.colorBackground;
        this.colorForeground = data.colorForeground;
        this.distortion = data.distortion;
        this.density = data.density;
        this.margin = data.margin;

        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.totalPixels = this.buffer.width * this.buffer.height * 4;
        this.totalDots = Math.round(this.totalPixels / this.density);

        this.draw();
    }

    draw() {

        var _density_ = this.density;

        this.buffer.push();
        this.buffer.loadPixels();
        let yoff = 0;
        for (let y = 0; y < this.buffer.height; y++) {
            let xoff = 0;
            for (let x = 0; x < this.buffer.width; x++) {

                let index = (x + y * this.buffer.width) * 4;
                var noiseF = noise(xoff, yoff);
                var _gain_ = noiseF * this.gain;
                if (softNoiseFeature == true) {
                    var _soft_gain_ = _gain_ / 2;
                } else {
                    var _soft_gain_ = _gain_;
                }

                // draw the background
                if (typeof this.colorBackground != "undefined") {
                    this.buffer.pixels[index + 0] = red(this.colorBackground);
                    this.buffer.pixels[index + 1] = green(this.colorBackground);
                    this.buffer.pixels[index + 2] = blue(this.colorBackground);
                    this.buffer.pixels[index + 3] = alpha(this.colorBackground);
                }

                // margin
                if (
                    (index % _density_ == 0) &&
                    (index % (this.buffer.width * 4) > this.margin * 4 / exportRatio) &&  // horizontal left
                    (index % (this.buffer.width * 4) < ((this.buffer.width - (this.margin / exportRatio)) * 4)) &&  // horizontal right
                    (index > (this.buffer.width * (this.margin / exportRatio)) * 4) && // vertical top
                    (index < (this.totalPixels - this.buffer.width * (this.margin / exportRatio) * 4))  // vertical bottom
                ) {

                    if (random() > 0.75) {
                        this.draw_big_dot(index, _soft_gain_);
                    } else {
                        this.draw_small_dot(index, _gain_);
                    }
                    _density_ = this.density + Math.round(this.density * getRealRandomFromInterval(-this.distortion, this.distortion));
                }
                xoff += this.inc;
            }
            yoff += this.inc;
        }
        this.buffer.updatePixels();
        this.buffer.pop();

    }

    draw_small_dot(index, gain) {
        // this pixel
        this.buffer.pixels[index + 0] = red(this.colorForeground) + gain;
        this.buffer.pixels[index + 1] = green(this.colorForeground) + gain;
        this.buffer.pixels[index + 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index + 3] = alpha(this.colorForeground);
    }

    draw_big_dot(index, gain) {
        // this pixel
        this.buffer.pixels[index + 0] = red(this.colorForeground) + gain;
        this.buffer.pixels[index + 1] = green(this.colorForeground) + gain;
        this.buffer.pixels[index + 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index + 3] = alpha(this.colorForeground);

        // preceding pixel, the pixel left
        this.buffer.pixels[index - 4] = red(this.colorForeground) + gain;
        this.buffer.pixels[index - 3] = green(this.colorForeground) + gain;
        this.buffer.pixels[index - 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index - 1] = alpha(this.colorForeground);

        // pixel above on y axis
        this.buffer.pixels[index - this.buffer.width * 4] = red(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 + 1] = green(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 + 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 + 3] = alpha(this.colorForeground);

        // pixel above on y axis
        this.buffer.pixels[index - this.buffer.width * 4 - 4] = red(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 - 3] = green(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 - 2] = blue(this.colorForeground) + gain;
        this.buffer.pixels[index - this.buffer.width * 4 - 1] = alpha(this.colorForeground);
    }
}

