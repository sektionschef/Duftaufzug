// thanks to https://github.com/matthias-jaeger-net/p5-toolkit/blob/main/src/hatches/modules/bars.ts

class Pattern {
    constructor() {
    }

    // random_dots
    static create_dots(custom_width, custom_height) {
        const amount = 2;

        this.buffer = createGraphics(custom_width, custom_height);

        for (let i = 0; i < amount; i++) {
            let x = getRandomFromInterval(0, this.buffer.width);
            let y = getRandomFromInterval(0, this.buffer.height);
            this.buffer.strokeWeight(getRandomFromInterval(0.5, 2));
            this.buffer.stroke(getRandomFromInterval(100, 150));
            this.buffer.point(x, y);
        }

        return this.buffer;
    }

    static create_noise(custom_width, custom_height) {

        this.buffer = createGraphics(custom_width, custom_height);

        this.buffer.loadPixels()
        for (let x = 0; x < this.buffer.width; x++) {
            for (let y = 0; y < this.buffer.height; y++) {
                this.buffer.set(x, y, distortColor(color(150), 12));
            }
        }
        this.buffer.updatePixels();

        // background_buffer.strokeWeight(3);
        // background_buffer.stroke(10);
        // background_buffer.point(getRandomFromInterval(0, width), getRandomFromInterval(0, height));

        return this.buffer;
    }

    static create_noise_fog(
        custom_width,
        custom_height,
        colorObject1,
        colorObject2,
        inc,
        noiseDetailLod,
        noiseDetailFalloff,
        opacityValue,
    ) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);
        let buffer = createGraphics(custom_width, custom_height);

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

    // LINES
    static create_lines(custom_width, custom_height) {
        const d = 4;  // 3
        const s = 3;  // 3
        // const c = BACKGROUND_COLOR;
        const c = color("#c9c9c9");  // RELATIVE to color
        const maxDist = 100;
        const dist = maxDist * d;

        this.buffer = createGraphics(custom_width, custom_height);

        const scl = (this.buffer.width / dist);
        for (let y = 0; y < this.buffer.height; y += scl) {
            this.buffer.strokeWeight(s);
            this.buffer.stroke(c);
            this.buffer.line(0, y, this.buffer.width, y);
        }
        return this.buffer;
    }

    // BARS
    static create_bars(custom_width, custom_height) {
        const d = 1.3;
        const s = 3.5;

        const start_color = 122;
        this.buffer = createGraphics(custom_width, custom_height);
        // const c = BACKGROUND_COLOR;
        // const c = color("#c9c9c9");  // RELATIVE to color
        // const c = color("black");  // RELATIVE to color
        const c = brightenColor(color(start_color), 30);

        const maxDist = 100;
        const dist = maxDist * d;
        const scl = (this.buffer.width / dist);
        for (let x = 0; x < this.buffer.width; x += scl) {
            this.buffer.strokeWeight(s);
            this.buffer.stroke(c);
            this.buffer.line(x, 0, x, this.buffer.height);
        }
        return this.buffer;
    }

    static create_grainy_gradient(custom_width, custom_height) {
        this.numberRows = 5;
        this.numberParticlesPerStepMax = 350;
        this.numberParticlesPerStepMin = 10;
        this.colorValueStart = 0;
        this.colorValueStop = 100;
        this.GrainSize = 1;

        this.numberParticlesCurrent = this.numberParticlesPerStepMax;
        this.numberParticlesPerStep = floor((this.numberParticlesPerStepMax - this.numberParticlesPerStepMin) / (this.numberRows - 1))
        this.colorValueCurrent = this.colorValueStart;
        this.colorStep = floor((this.colorValueStop - this.colorValueStart) / (this.numberRows - 1))

        this.buffer = createGraphics(custom_width, custom_height);

        this.rowStepSize = floor(this.buffer.height / this.numberRows);

        for (var i = 0; i < this.numberRows; i++) {
            for (var v = 0; v < this.numberParticlesCurrent; v++) {

                var posX = getRandomFromInterval(0, this.buffer.width);
                var posY = getRandomFromInterval(this.rowStepSize * i, this.rowStepSize * (i + 1))

                push();
                this.buffer.stroke(this.colorValueCurrent);
                this.buffer.strokeWeight(this.GrainSize);
                this.buffer.point(posX, posY);
                pop();
            }
            this.colorValueCurrent += this.colorStep;
            this.numberParticlesCurrent -= this.numberParticlesPerStep;
        }


        return this.buffer;

    }
}


// random artefacts as shapes. maxs of perlin noise colored.
class SplitterSplatter {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                posX: -width / 2,
                posY: -height / 2,
                inc: 0.05,
                noiseDetailLod: 16,
                noiseDetailFalloff: 0.9,
                opacityValue: 50,
                blackness: 145,  // amount of grey
                perlinThreshold: 0.90  // minimum to get drawn 
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.posX = data.posX;
        this.posY = data.posY;
        this.inc = data.inc;
        this.noiseDetailLod = data.noiseDetailLod;
        this.noiseDetailFalloff = data.noiseDetailFalloff;
        this.opacityValue = data.opacityValue;
        this.blackness = data.blackness;  // amount of grey
        this.perlinThreshold = data.perlinThreshold;  // minimum to get drawn 

        this.create_buffer();
    }

    create_buffer() {
        this.buffer = createGraphics(this.custom_width, this.custom_height);
        // noiseDetail(this.noiseDetailLod, this.noiseDetailFalloff)

        let yoff = 0;
        this.buffer.loadPixels();
        loadPixels();
        fill(0);
        for (let y = 0; y < this.custom_height; y++) {
            let xoff = 0;
            for (let x = 0; x < this.custom_width; x++) {
                let index = (x + y * this.custom_width) * 4;

                let perlinValue = noise(xoff, yoff)
                if (perlinValue >= this.perlinThreshold) {
                    this.buffer.pixels[index + 0] = perlinValue * this.blackness;
                    this.buffer.pixels[index + 1] = perlinValue * this.blackness;
                    this.buffer.pixels[index + 2] = perlinValue * this.blackness;
                    this.buffer.pixels[index + 3] = this.opacityValue;
                } else {
                    this.buffer.pixels[index + 0] = 0;
                    this.buffer.pixels[index + 1] = 0;
                    this.buffer.pixels[index + 2] = 0;
                    this.buffer.pixels[index + 3] = 0;
                }

                xoff += this.inc;
            }
            yoff += this.inc;
        }
        this.buffer.updatePixels();
    }

    show() {
        image(this.buffer, this.posX, this.posY, this.buffer.width, this.buffer.height);
    }
}


// CORRODED - bubbles that hide background
class Corroded {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                custom_width: width,
                custom_height: height,
                posX: -width / 2,
                posY: -height / 2,
                colorObject: color(100),
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.posX = data.posX;
        this.posY = data.posY;
        this.colorObject = data.colorObject

        const diff = 5;
        this.foreground_color = this.colorObject;
        // this.background_color = color(
        //     this.colorObject.levels[0] - diff,
        //     this.colorObject.levels[1] - diff,
        //     this.colorObject.levels[2] - diff,
        // );

        this.d = 1  // 2 - 1 - 1.5 - 1.3 - 1.2
        this.radius = 5;  // 3 - 3 - 3 - 3.5 - 3.5
        this.maxCell = 260;
        this.cell = this.maxCell * this.d;

        this.scl = this.custom_width / this.cell;
    }

    show() {

        push();
        translate(this.posX, this.posY);
        // background(this.background_color);
        // background(0, 0);
        for (let x = 0; x < this.custom_width; x += this.scl) {
            for (let y = 0; y < this.custom_height; y += this.scl) {
                var c = brightenColor(color(this.foreground_color), 5);
                var r = getRandomFromInterval(0, this.radius);
                // if (r > d) {
                stroke(c);
                strokeWeight(r * this.d);
                line(x + r, y - r, x, y);
                // }
            }
        }
        pop();

        // return this.buffer;
    }

}

