class noiseParticles {

    constructor(data) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);

        this.buffer = data.buffer;
        this.inc = data.inc;
        this.colorSolid = data.colorSolid;
        this.opacityValue = data.opacityValue;
        this.scl = data.scl;
        this.distortion = data.distortion;
        this.amountMax = data.amountMax;
        this.margin = data.margin;

        this.width = exportPaper.width - 2 * this.margin;
        this.height = exportPaper.height - 2 * this.margin;

        this.cols = this.width / this.scl;
        this.rows = this.height / this.scl;

        this.particles = []

        var yoff = 0;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < this.cols; x++) {

                let r = noise(xoff, yoff);

                for (var amount = 0; amount < r * this.amountMax; amount++) {

                    this.particles.push(
                        {
                            posX: (this.margin + x * this.scl) + getRandomFromInterval(0, this.distortion),
                            posY: (this.margin + y * this.scl) + getRandomFromInterval(0, this.distortion),
                            colorObject: color(this.colorSolid, this.opacityValue),
                            width: this.scl,
                            height: this.scl

                        }
                    )
                }

                xoff += this.inc;
            }
            yoff += this.inc;
        }

        this.drawAll();
    }

    drawAll() {

        this.buffer.clear();
        this.buffer.scale(scaleRatio);

        this.buffer.push();

        // this.buffer.noFill();

        // with RECT
        this.buffer.noStroke();

        for (var particle of this.particles) {

            this.buffer.push();
            this.buffer.fill(particle.colorObject);
            this.buffer.translate(particle.posX / exportRatio, particle.posY / exportRatio);

            this.buffer.rect(0, 0, particle.width / exportRatio, particle.height / exportRatio);

            // with Points
            // this.buffer.stroke(particle.colorObject);
            // this.buffer.strokeWeight(particle.width / exportRatio);
            // this.buffer.point(0, 0);

            this.buffer.pop();
        }

        this.buffer.pop();

        // debug buffer size
        // this.buffer.noFill();
        // this.buffer.fill(255, 0, 0);
        // this.buffer.strokeWeight(1);
        // this.buffer.rect(0, 0, this.buffer.width, this.buffer.height);
    }
}


class noisePixel {

    constructor(data) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);
        this.buffer = data.buffer;
        var inc = data.inc;


        var density = 800;
        var totalPixels = this.buffer.width * this.buffer.height;
        var totalDots = totalPixels / density;
        var dotPixelIndex = [];
        var dotSize = 4;  // diameter

        for (var i = 0; i < totalDots; i++) {
            // draw each dto
            // on x axis
            for (var v = 0; v < dotSize / 2; v++) {
                dotPixelIndex.push(
                    (density * (i + 1) + v)
                )
            }
            // on y axis
            for (var w = 0; w < dotSize / 2; w++) {
                dotPixelIndex.push(
                    (density * (i + 1 + this.buffer.width * 4) + w)
                )
            }
        }
        // console.log(dotPixelIndex);
        // dotPixelIndex = [80001, 80002, 80003, 80004];
        // console.log(dotPixelIndex.includes(80001));

        // REMOVE??
        var dotIndex = 0;



        let yoff = 0;
        this.buffer.loadPixels();
        for (let y = 0; y < this.buffer.height; y++) {
            let xoff = 0;
            for (let x = 0; x < this.buffer.width; x++) {
                let index = (x + y * this.buffer.width) * 4;

                // let r = noise(xoff, yoff) * 255;
                // this.buffer.pixels[index + 0] = r;
                // this.buffer.pixels[index + 1] = r;
                // this.buffer.pixels[index + 2] = r;
                // this.buffer.pixels[index + 3] = r;  // 255

                // quite cool texture
                // if (fxrand() > 0.75) {
                //     let r = noise(xoff, yoff) * 255;
                //     this.buffer.pixels[index + 0] = r;
                //     this.buffer.pixels[index + 1] = r;
                //     this.buffer.pixels[index + 2] = r;
                //     this.buffer.pixels[index + 3] = r;  // 255
                // }

                // CUSTOM COLOR
                // let gain = 50;
                // let r = noise(xoff, yoff);
                // this.buffer.pixels[index + 0] = colorObject.levels[0] + r * gain;
                // this.buffer.pixels[index + 1] = colorObject.levels[1] + r * gain;
                // this.buffer.pixels[index + 2] = colorObject.levels[2] + r * gain;
                // this.buffer.pixels[index + 3] = opacityValue;

                // mix colors
                // let r = noise(xoff, yoff);
                // let mixedColor = lerpColor(colorObject1, colorObject2, r)
                // this.buffer.pixels[index + 0] = mixedColor.levels[0];
                // this.buffer.pixels[index + 1] = mixedColor.levels[1];
                // this.buffer.pixels[index + 2] = mixedColor.levels[2];
                // this.buffer.pixels[index + 3] = opacityValue;


                // let r = noise(xoff, yoff) * getRandomFromInterval(0, 80);
                // let g = noise(xoff, yoff) * getRandomFromInterval(0, 80);
                // let b = noise(xoff, yoff) * getRandomFromInterval(0, 80);
                // this.buffer.pixels[index + 0] = colorObject.levels[0] + r;
                // this.buffer.pixels[index + 1] = colorObject.levels[1] + g;
                // this.buffer.pixels[index + 2] = colorObject.levels[2] + b;
                // this.buffer.pixels[index + 3] = opacityValue;

                // manual dot drawing
                // if (index == 80000 || index == (80000 + this.buffer.width * 4) || (dotIndex >= 1 && dotIndex <= 2)) {
                //     dotIndex += 1;
                //     this.buffer.pixels[index + 0] = 130;
                //     this.buffer.pixels[index + 1] = 190;
                //     this.buffer.pixels[index + 2] = 10;
                //     this.buffer.pixels[index + 3] = 255;  // opacity                    
                // } else {
                //     dotIndex = 0;
                //     this.buffer.pixels[index + 0] = 30;
                //     this.buffer.pixels[index + 1] = 90;
                //     this.buffer.pixels[index + 2] = 100;
                //     this.buffer.pixels[index + 3] = 255;  // opacity
                // }

                if (dotPixelIndex.includes(index)) {
                    this.buffer.pixels[index + 0] = 130;
                    this.buffer.pixels[index + 1] = 190;
                    this.buffer.pixels[index + 2] = 10;
                    this.buffer.pixels[index + 3] = 255;  // opacity   
                } else {
                    this.buffer.pixels[index + 0] = 30;
                    this.buffer.pixels[index + 1] = 90;
                    this.buffer.pixels[index + 2] = 100;
                    this.buffer.pixels[index + 3] = 255;  // opacity
                }

                xoff += inc;
            }
            yoff += inc;
        }
        this.buffer.updatePixels();
    }
}