class Fibre {
    constructor(brush, i) {

        this.i = i;
        this.brush = brush;

        this.sizeStrokeFibre = brush.area.sizeStroke + getRandomFromInterval(-brush.area.fibreStrokeSizeNoise, brush.area.fibreStrokeSizeNoise);  // size of fibre
        this.startX = brush.brushPosX + noise(this.i * brush.area.fibreLengthPerlin) * brush.area.fibreStartLengthNoise - brush.area.fibreStartLengthNoise;  // where the fibre starts    
        this.startY = brush.brushPosY + noise(this.i * brush.area.fibreLengthPerlin) * brush.area.fibreStartLengthNoise - brush.area.fibreStartLengthNoise;  // where the fibre starts

        this.fibreLength = brush.brushLength_ // + noise(this.i * brush.area.fibreLengthPerlin) * brush.area.fibreStartLengthNoise;

        this.colorFibre = brightenColor(distortColor(color(brush.colorBrush), brush.area.fibreColorNoise), brush.area.fibreBrightnessNoise);

        this.colorFibre = color(red(this.colorFibre), green(this.colorFibre), blue(this.colorFibre), noise(this.i * brush.area.fibreOpacityPerlin) * (255 - brush.area.fibreOpacityNoiseBase) + brush.area.fibreOpacityNoiseBase);
        this.angleFibre = brush.angle + getRandomFromInterval(-brush.area.fibreRotationNoise, brush.area.fibreRotationNoise);
    }

}

class Brush {
    constructor(area, x, y, loopLayer) {

        this.area = area
        this.brushPosX = x;
        this.brushPosY = y;
        this.colorBrush = brightenColor(distortColor(color(this.area.colorObject), this.area.colorNoise), this.area.brightnessNoise);
        this.brushLength_ = this.area.brushLength + getRandomFromInterval(-this.area.brushLength * this.area.brushLengthNoise, this.area.brushLength * this.area.brushLengthNoise);
        this.numberFibres_ = this.area.numberFibres + getRandomFromInterval(-this.area.numberFibres * this.area.brushBreadthNoise, this.area.numberFibres * this.area.brushBreadthNoise);
        this.angle = getRandomFromInterval(-this.area.brushAngleNoise, this.area.brushAngleNoise);

        this.fibres = []

        if ((loopLayer > 0) && (fxrand() > 0.85)) {
            if (this.area.orientation == "horizontal") {
                this.brushPosX = getRandomFromInterval(this.area.overlap / 2, this.area.custom_width - this.brushLength_ - this.area.overlap / 2);
                // this.brushPosY = getRandomFromInterval(this.area.overlap / 2, this.area.custom_height - this.numberFibres_ * this.area.sizeStroke - this.area.overlap / 2);
                this.brushPosY = getRandomFromInterval(this.area.overlap / 2, this.area.custom_height - this.numberFibres_ * this.area.brushFibreSparseness - this.area.overlap / 2);
            }
        }
        if ((loopLayer > 0) && (fxrand() > 0.85)) {
            if (this.area.orientation == "vertical") {
                // this.brushPosX = getRandomFromInterval(this.area.overlap / 2, this.area.custom_width - this.numberFibres_ * this.area.sizeStroke - this.area.overlap / 2);
                this.brushPosX = getRandomFromInterval(this.area.overlap / 2, this.area.custom_width - this.numberFibres_ * this.area.brushFibreSparseness - this.area.overlap / 2);
                this.brushPosY = getRandomFromInterval(this.area.overlap / 2, this.area.custom_height - this.brushLength_ - this.area.overlap / 2);
            }
        }

        noiseSeed(NOISESEED + fxrand() * 10);
        for (var i = 0; i < this.numberFibres_; i++) {
            this.fibres.push(new Fibre(this, i));
        }
        noiseSeed(NOISESEED);
    }

}

class PaintBrushArea {
    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: 800,
                custom_height: 800,
                posX: 100,
                posY: 100,
                colorObject: color1,
                orientation: "vertical",
                brushLength: 150,  // 20-40
                brushBreadth: 150,
                sizeStroke: 2,
                numberPaintLayers: 2,
                overlap: 20,
                brightnessNoise: 5,
                colorNoise: 5,
                opacityBoost: 0, // getRandomFromInterval(150, 255),
                brushLengthNoise: 0.2,
                brushBreadthNoise: 0.2,  // brushBreadthNoise
                brushAngleNoise: PI / 20,
                brushFibreSparseness: 6,
                fibreColorNoise: 2,
                fibreBrightnessNoise: 2,
                fibreStrokeSizeNoise: 1,
                fibreStartLengthNoise: 15,  // start earlier or later
                fibreBreadthNoise: 0.5,  // noise of fibre along the y axis in the middle
                fibreRotationNoise: PI / 200,
                fibreOpacityNoiseBase: 150,
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.posX = data.posX;
        this.posY = data.posY;
        this.colorObject = color(data.colorObject);
        this.orientation = data.orientation;
        this.brushLength = data.brushLength;
        this.brushBreadth = data.brushBreadth;
        this.sizeStroke = data.sizeStroke;
        this.numberPaintLayers = data.numberPaintLayers;
        this.overlap = data.overlap;
        this.brightnessNoise = data.brightnessNoise;
        this.colorNoise = data.colorNoise;
        this.opacityBoost = data.opacityBoost;
        this.brushFibreSparseness = data.brushFibreSparseness;
        this.brushLengthNoise = data.brushLengthNoise;
        this.brushBreadthNoise = data.brushBreadthNoise;
        this.brushAngleNoise = data.brushAngleNoise;
        this.fibreColorNoise = data.fibreColorNoise;
        this.fibreBrightnessNoise = data.fibreBrightnessNoise;
        this.fibreStrokeSizeNoise = data.fibreStrokeSizeNoise;
        this.fibreStartLengthNoise = data.fibreStartLengthNoise;
        this.fibreBreadthNoise = data.fibreBreadthNoise;
        this.fibreRotationNoise = data.fibreRotationNoise;
        this.fibreOpacityNoiseBase = data.fibreOpacityNoiseBase;
        this.fibreLengthPerlin = data.fibreLengthPerlin;
        this.fibreOpacityPerlin = data.fibreOpacityPerlin;


        // make sure the brushes nicely fill the area and do not overlap, calc the optimal solution
        if (this.orientation == "horizontal") {
            var brushLengthNeeded = this.custom_width / this.brushLength;
            this.brushLength = this.custom_width / brushLengthNeeded;

            var brushHeightNeeded = this.custom_height / this.brushBreadth;
            this.brushBreadth = this.custom_height / brushHeightNeeded;

        } else if (this.orientation == "vertical") {
            var brushHeightNeeded = this.custom_height / this.brushBreadth;
            this.brushLength = this.custom_height / brushHeightNeeded;

            var brushLengthNeeded = this.custom_width / this.brushLength;
            this.brushBreadth = this.custom_width / brushLengthNeeded;
        }

        this.numberFibres = this.brushBreadth / this.brushFibreSparseness // this.sizeStroke

        this.brushStrokes = [];
        this.createBrushes();
    }

    createBrushes() {
        for (let loopLayer = 0; loopLayer < this.numberPaintLayers; loopLayer += 1) {

            if (this.orientation == "horizontal") {
                for (let x = 0; x < this.custom_width; x += this.brushLength) {
                    for (let y = 0; y < this.custom_height; y += this.brushBreadth) {

                        this.brushStrokes.push(new Brush(this, x, y, loopLayer));
                    }
                }
            } else if (this.orientation == "vertical") {
                for (let y = 0; y < this.custom_height; y += this.brushLength) {
                    for (let x = 0; x < this.custom_width; x += this.brushBreadth) {

                        this.brushStrokes.push(new Brush(this, x, y, loopLayer));
                    }
                }
            }
        }
    }

    show() {

        for (var brushStroke of this.brushStrokes) {

            if (GRIDVISIBLE == true) {
                buffer.push();
                buffer.strokeWeight(1);
                buffer.stroke(color(20, 50));
                buffer.noFill();
                buffer.translate((this.posX - this.custom_width / 2 + brushStroke.brushPosX) / exportRatio, (this.posY - this.custom_height / 2 + brushStroke.brushPosY) / exportRatio)
                buffer.rect(0, 0, this.brushLength / exportRatio, this.brushBreadth / exportRatio);
                buffer.pop();
            }

            for (var fibre of brushStroke.fibres) {

                buffer.push();
                if (this.orientation == "horizontal") {
                    buffer.translate((this.posX - this.custom_width / 2 + fibre.startX) / exportRatio, (this.posY - this.custom_height / 2 + brushStroke.brushPosY) / exportRatio)
                    buffer.rotate(fibre.angleFibre);
                } else if (this.orientation == "vertical") {
                    buffer.translate((this.posX - this.custom_width / 2 + brushStroke.brushPosX) / exportRatio, (this.posY - this.custom_height / 2 + fibre.startY) / exportRatio)
                    buffer.rotate(fibre.angleFibre / PI / 2);
                }
                buffer.stroke(fibre.colorFibre);
                buffer.strokeWeight(fibre.sizeStrokeFibre) / exportRatio;
                buffer.noFill();

                if (this.orientation == "horizontal") {
                    buffer.line(
                        0,
                        this.brushFibreSparseness / exportRatio * fibre.i,
                        // this.sizeStroke / exportRatio * fibre.i,
                        fibre.fibreLength / exportRatio,
                        // this.sizeStroke / exportRatio * fibre.i
                        this.brushFibreSparseness / exportRatio * fibre.i,
                    );
                } else if (this.orientation == "vertical") {
                    buffer.line(
                        // this.sizeStroke / exportRatio * fibre.i,
                        this.brushFibreSparseness / exportRatio * fibre.i,
                        0,
                        // this.sizeStroke / exportRatio * fibre.i,
                        this.brushFibreSparseness / exportRatio * fibre.i,
                        fibre.fibreLength / exportRatio
                    );
                }

                buffer.pop();

            }

            if (logging.getLevel() <= 1) {
                // DEBUG Grid
                buffer.push();
                buffer.strokeWeight(1) / exportRatio;
                buffer.noFill();
                buffer.translate((this.posX - this.custom_width / 2 + brushStroke.brushPosX) / exportRatio, (this.posY - this.custom_height / 2 + brushStroke.brushPosY) / exportRatio)
                buffer.rect(0, 0, this.brushLength / exportRatio, this.brushBreadth / exportRatio);
                buffer.pop();
            }

        }

        if (logging.getLevel() <= 1) {
            // // DEBUG RECT for AREA
            buffer.push();
            buffer.rectMode(CENTER);
            buffer.fill("purple");
            buffer.translate((this.posX) / exportRatio, (this.posY) / exportRatio);
            buffer.rect(0, 0, this.custom_width / exportRatio, this.custom_height / exportRatio);
            buffer.pop();
        }

    }
}