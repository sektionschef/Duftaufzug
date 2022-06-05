
//inspired by Robert Ryman, https://openprocessing.org/sketch/1110176/ 
class paintedSphere {

    constructor(data) {

        if (typeof data === 'undefined') {
            data = {
                custom_width: exportPaper.width,
                custom_height: exportPaper.height,
                posX: -width / 2,
                posY: -height / 2,
                elementSizeMin: 10,
                elementSizeMax: 50,
                colorObject: color(200),
                margin: 50,
                fillColorNoise: 20,
                fillColorOpacityMax: 100,
                noStroke: true,
                strokeWeight: 10,
                strokeColorNoise: 20,
                strokeOpacityMax: 50,
                numberQuantisizer: 4,
            }
        }


        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.posX = data.posX;
        this.posY = data.posY;
        this.elementSizeMin = data.elementSizeMin;
        this.elementSizeMax = data.elementSizeMax;
        this.colorObject = data.colorObject;
        this.margin = data.margin;
        this.fillColorNoise = data.fillColorNoise;
        this.fillColorOpacityMax = data.fillColorOpacityMax;
        this.noStroke = data.noStroke;
        this.strokeWeight = data.strokeWeight;
        this.strokeColorNoise = data.strokeColorNoise;
        this.strokeOpacityMax = data.strokeOpacityMax;
        this.numberQuantisizer = data.numberQuantisizer;

        // this.strokColorWhitenessMin = 
        this.colorObjectRed = this.colorObject.levels[0];
        this.colorObjectGreen = this.colorObject.levels[1];
        this.colorObjectBlue = this.colorObject.levels[2];

        this.area = this.custom_width * this.custom_height;
        this.shapeNumber = this.area / 1000 * this.numberQuantisizer;  // relative to size

        this.elements = []

        for (var i = 0; i < this.shapeNumber; i++) {
            // easier with hsb?
            let fillColorRed = getRandomFromInterval(this.colorObjectRed - this.fillColorNoise, this.colorObjectRed + this.fillColorNoise);
            let fillColorGreen = getRandomFromInterval(this.colorObjectGreen - this.fillColorNoise, this.colorObjectGreen + this.fillColorNoise);
            let fillColorBlue = getRandomFromInterval(this.colorObjectBlue - this.fillColorNoise, this.colorObjectBlue + this.fillColorNoise);

            // let fillColorOpacity = getRandomFromInterval(this.fillColorOpacityMax / 2, this.fillColorOpacityMax);
            let fillColorOpacity = this.fillColorOpacityMax;
            // let strokeColorOpacity = getRandomFromInterval(this.strokeOpacityMax / 2, this.strokeOpacityMax);
            let strokeColorOpacity = this.strokeOpacityMax;

            let fillColor = color(fillColorRed, fillColorGreen, fillColorBlue, fillColorOpacity);

            // let widthShape = getRandomFromInterval((this.custom_width - this.margin * 2) * 0.05, (this.custom_width - this.margin * 2) * 0.05);  // ca. 50
            // let heightShape = getRandomFromInterval((this.custom_height - this.margin * 2) * 0.05, (this.custom_height - this.margin * 2) * 0.05);  // ca. 50
            let widthShape = getRandomFromInterval(this.elementSizeMin, this.elementSizeMax);
            let heightShape = getRandomFromInterval(this.elementSizeMin, this.elementSizeMax);

            this.elements.push({
                // strokeColor: color(this.colorObjectRed + this.strokeColorNoise, this.colorObjectGreen + this.strokeColorNoise, this.colorObjectBlue + this.strokeColorNoise, strokeColorOpacity),
                strokeColor: color(fillColorRed, fillColorGreen, fillColorBlue, strokeColorOpacity),
                fillColor: fillColor,
                widthShape: widthShape,
                heightShape: heightShape,
                strokeSize: this.strokeWeight,
                posXEl: getRandomFromInterval(this.margin, this.custom_width - this.margin),
                posYEl: getRandomFromInterval(this.margin, this.custom_height - this.margin),
                posXRe: getRandomFromInterval(this.margin, this.custom_width - this.margin),
                posYRe: getRandomFromInterval(this.margin, this.custom_height - this.margin),
            })
        }
    }

    show() {

        for (var element of this.elements) {
            buffer.push();
            buffer.translate((this.posX) / exportRatio, (this.posY) / exportRatio);
            if (this.noStroke == true) {
                buffer.noStroke();
            } else {
                buffer.stroke(element.strokeColor);
                buffer.strokeWeight(element.strokeSize);
            }
            buffer.fill(element.fillColor);

            buffer.rectMode(CENTER);
            buffer.ellipseMode(CENTER);

            // buffer.ellipse(element.posXEl / exportRatio, element.posYEl / exportRatio, element.widthShape / exportRatio, element.heightShape / exportRatio);
            buffer.rect(element.posXRe / exportRatio, element.posYRe / exportRatio, element.widthShape / exportRatio, element.heightShape / exportRatio);
            buffer.pop();
        }

        if (logging.getLevel() <= 1) {
            buffer.push();
            buffer.noFill();
            buffer.strokeWeight(2);
            buffer.stroke("black");
            buffer.rectMode(CENTER);
            buffer.translate((this.posX + this.custom_width / 2) / exportRatio, (this.posY + this.custom_height / 2) / exportRatio);
            buffer.rect(0, 0, this.custom_width / exportRatio, this.custom_height / exportRatio);
            buffer.pop();
        }
    }

}

// randomly placed rects with painted spheres on the canvas
class RandomPaintedSpheres {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                minSize: 10,
                maxSize: 30,
                numberSpheres: 20,
                colorObject: color(20),
                padding: 50,
            }
        }

        this.minSize = data.minSize;
        this.maxSize = data.maxSize;
        this.numberSpheres = data.numberSpheres;
        this.colorObject = data.colorObject;
        this.padding = data.padding;

        this.spheres = [];

        for (let i = 0; i < this.numberSpheres; i++) {

            var width_ = getRandomFromInterval(this.minSize, this.maxSize);
            var height_ = getRandomFromInterval(this.minSize, this.maxSize);
            var posX_ = getRandomFromInterval(this.padding, exportPaper.width - this.padding - width_);
            var posY_ = getRandomFromInterval(this.padding, exportPaper.height - this.padding - height_);

            this.spheres.push(
                new paintedSphere(data = {
                    custom_width: width_,
                    custom_height: height_,
                    posX: posX_,
                    posY: posY_,
                    elementSizeMin: 50,
                    elementSizeMax: 100,
                    // colorObject: color(getRandomFromList([20, 40, 200, 240])),
                    colorObject: this.colorObject,
                    margin: 0,
                    fillColorNoise: 30,
                    fillColorOpacityMax: 2,  // THISONE
                    noStroke: true,
                    strokeWeight: 2,
                    strokeColorNoise: 0,
                    strokeOpacityMax: 2,
                    numberQuantisizer: 4,
                }
                ))
        }
    }


    show() {
        for (var sphere of this.spheres) {
            sphere.show();
        }
    }
}
