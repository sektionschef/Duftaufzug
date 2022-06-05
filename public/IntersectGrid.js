class IntersectRect {
    constructor(rect1, rect2, colorObject) {
        this.rect1 = rect1;
        this.rect2 = rect2;

        this.posXNew;
        this.widthNew;
        this.posYNew;
        this.heightNew;

        this.rect1.colorObject;
        this.rect2.colorObject;

        // this.getColor();
        this.colorObject = colorObject;

    }

    // get another color from used in both rects
    getColor() {
        let allColors = new Set([color1, color2]);
        let usedColors = new Set([this.rect1.colorObject, this.rect2.colorObject]);

        this.colorIntersect = new Set([...allColors].filter(x => !usedColors.has(x)));
        this.colorObject = getRandomFromList([...this.colorIntersect]);
    }

    update() {
        // helper
        var r1StartX = this.rect1.posX - this.rect1.width / 2;
        var r2StartX = this.rect2.posX - this.rect2.width / 2;
        var r1Full = r1StartX + this.rect1.width;
        var r2Full = r2StartX + this.rect2.width;
        var r1StartY = this.rect1.posY - this.rect1.height / 2;
        var r2StartY = this.rect2.posY - this.rect2.height / 2;
        var r1FullY = r1StartY + this.rect1.height;
        var r2FullY = r2StartY + this.rect2.height;

        // no overlap
        if (
            (r2StartX > r1Full) ||
            (r2Full < r1StartX) ||
            (this.rect2.posY - this.rect2.height / 2 > this.rect1.posY - this.rect1.height / 2 + this.rect1.height) ||
            (this.rect2.posY - this.rect2.height / 2 + this.rect2.height < this.rect1.posY - this.rect1.height / 2)
        ) {
            // overlap
        } else {
            if (r2StartX < r1StartX) {
                // x-axis | rect 2 overlaps from left
                this.widthNew = Math.min(r2Full, r1Full) - r1StartX;
                this.posXNew = (r1StartX) + this.widthNew / 2;
            } else if (r2Full > r1Full) {
                // x-axis | rect 2 overlaps from right
                this.widthNew = r1Full - r2StartX;
                this.posXNew = r1Full - this.widthNew / 2;
            } else {
                // x-axis | overlaps fully
                this.widthNew = this.rect2.width;
                this.posXNew = this.rect2.posX;
            }

            if (r2StartY < r1StartY) {
                // y-axis | rect2 above
                this.heightNew = Math.min(r2FullY, r1FullY) - r1StartY;
                this.posYNew = r1StartY + this.heightNew / 2;
            } else if (r2FullY > r1FullY) {
                this.heightNew = r1FullY - r2StartY;
                this.posYNew = r1FullY - this.heightNew / 2;
            } else {
                this.heightNew = this.rect2.height;
                this.posYNew = this.rect2.posY;
            }

            if (this.widthNew < (exportPaper.width * 0.01) || this.heightNew < (exportPaper.height * 0.01)) {
                logging.debug("The intersection rect is too small to exist.")
                this.widthNew = undefined;
                this.heightNew = undefined;
                this.posXNew = undefined;
                this.posYNew = undefined;
            }

        }
    }
}

// grid with rects and intersection rects
class IntersectGrid {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                minSize: 400,  // 100 resize
                maxSize: 2000, // 500 resize
                numberRects: 5,
                firstLevelColors: [color(100)],
                secondLevelColors: [color(30)],
                lineColor: color(230),
                padding: 200,  // frame to the edge of the canvas
                shadow: true,
            }
        }
        this.minSize = data.minSize;
        this.maxSize = data.maxSize;
        this.numberRects = data.numberRects;
        this.firstLevelColors = data.firstLevelColors;
        this.secondLevelColors = data.secondLevelColors;
        this.lineColor = data.lineColor;
        this.padding = data.padding;
        this.firstShadow = data.firstShadow;


        // for debug
        this.rects = [];
        this.interactionRects = [];
        this.spheres = [];

        // console.log(this.numberRects);
        for (let i = 0; i < this.numberRects; i++) {

            var width_ = Math.round(getRandomFromInterval(this.minSize, this.maxSize));
            var height_ = Math.round(getRandomFromInterval(this.minSize, this.maxSize));

            var posX_ = Math.round(getRandomFromInterval(this.padding + width_ / 2, exportPaper.width - this.padding - width_ / 2));
            var posY_ = Math.round(getRandomFromInterval(this.padding + height_ / 2, exportPaper.height - this.padding - height_ / 2));

            this.rects.push(
                {
                    width: width_,
                    height: height_,
                    posX: posX_,
                    posY: posY_,
                    colorObject: getRandomFromList(this.firstLevelColors),
                }
            )

            this.rects[i].paintedArea = this.createPaintbrushAreas(
                this.rects[i].posX,
                this.rects[i].posY,
                this.rects[i].width,
                this.rects[i].height,
                this.rects[i].colorObject
            )

            if (fxrand() > 0.75) {
                this.rects[i].lines = new NewLines(data = {
                    posX: this.rects[i].posX,
                    posY: this.rects[i].posY,
                    custom_width: this.rects[i].width,
                    custom_height: this.rects[i].height,
                    colorObject: this.lineColor,
                    distance: 40,
                    noise: 4,
                    strokeSize: 6,
                    curveTightness: 1,
                    opacityLevel: 150,
                });
            }

            this.rects[i].spheres = this.createSpheres(
                this.rects[i].posX,
                this.rects[i].posY,
                this.rects[i].width,
                this.rects[i].height,
            )
        }
        // sort by size
        this.rects.sort(function (a, b) { return (b.width * b.height) - (a.width * a.height) });

        this.getIntersections();
        this.interactionRects.sort(function (a, b) { return (b.width * b.height) - (a.width * a.height) });
        this.update();
    }

    getIntersections() {
        for (let i = 0; i < this.rects.length; i++) {
            for (let j = (0 + i + 1); j < this.rects.length; j++) {
                this.interactionRects.push(new IntersectRect(this.rects[i], this.rects[j], getRandomFromList(this.secondLevelColors)));
            }
        }
    }

    createPaintbrushAreas(posX, posY, rectWidth, rectHeight, colorObject) {

        if (PALETTE != "greyscale") {
            var colorObject_ = brightenColor(distortColor(colorObject, 6), 6);
        } else {
            var colorObject_ = brightenColor(colorObject, 6);
        }

        let brushData = {
            custom_width: rectWidth,
            custom_height: rectHeight,
            posX: posX,
            posY: posY,
            colorObject: colorObject_,
            orientation: getRandomFromList(["horizontal", "vertical"]),
            brushLength: BRUSHLENGTHANDBREADTH,
            brushBreadth: BRUSHLENGTHANDBREADTH,
            sizeStroke: BRUSHSTROKESIZE,
            numberPaintLayers: NUMBERPAINTLAYERS,
            overlap: 80,
            brightnessNoise: BRUSHBRIGHTNESSNOISE,
            colorNoise: BRUSHCOLORNOISE,
            opacityBoost: 0, // getRandomFromInterval(150, 255),
            brushLengthNoise: BRUSHLENGTHNOISE,
            brushBreadthNoise: BRUSHBREADTHNOISE,
            brushAngleNoise: BRUSHANGLENOISE,
            brushFibreSparseness: BRUSHFIBRESPARSENESS,
            fibreColorNoise: FIBRECOLORNOISE,
            fibreBrightnessNoise: FIBREBRIGHTNESSNOISE,
            fibreStrokeSizeNoise: FIBRESTROKESIZENOISE,
            fibreStartLengthNoise: FIBRESTARTLENGTHNOISE,  // start earlier or later
            fibreBreadthNoise: FIBREBREADTHNOISE,  // noise of fibre along the y axis in the middle
            fibreRotationNoise: FIBREROTATIONNOISE,
            fibreOpacityNoiseBase: FIBREOPACITYNOISEBASE,
            fibreLengthPerlin: FIBRELENGTHPERLIN,
            fibreOpacityPerlin: FIBREOPACITYPERLIN,
        }

        return new PaintBrushArea(brushData);
    }

    createSpheres(posX, posY, rectWidth, rectHeight) {

        if (this.firstShadow == true) {

            var psx = (posX - rectWidth / 2 + 100);
            var psy = (posY - rectHeight / 2 + 100);
            var shadowColor = color(30, 30);
        } else {
            var psx = (posX - rectWidth / 2 + 50);
            var psy = (posY - rectHeight / 2 + 50);
            var shadowColor = color(60, 30);
        }

        var data = {
            custom_width: rectWidth,
            custom_height: rectHeight,
            posX: psx,
            posY: psy,
            elementSizeMin: 50,
            elementSizeMax: 100,
            colorObject: shadowColor,
            margin: 0,
            fillColorNoise: 30,
            fillColorOpacityMax: 5,
            noStroke: true,
            strokeWeight: 2,
            strokeColorNoise: 0,
            strokeOpacityMax: 2,
            numberQuantisizer: 4,
        }

        return new paintedSphere(data)

    }

    update() {
        for (let i = 0; i < this.interactionRects.length; i++) {
            this.interactionRects[i].update();
            if (this.interactionRects[i].widthNew !== undefined) {  // if not empty

                this.interactionRects[i].spheres = this.createSpheres(
                    this.interactionRects[i].posXNew,
                    this.interactionRects[i].posYNew,
                    this.interactionRects[i].widthNew,
                    this.interactionRects[i].heightNew,
                )

                this.interactionRects[i].paintedArea = this.createPaintbrushAreas(
                    this.interactionRects[i].posXNew,
                    this.interactionRects[i].posYNew,
                    this.interactionRects[i].widthNew,
                    this.interactionRects[i].heightNew,
                    this.interactionRects[i].colorObject
                )
            }
        }
    }

    show() {

        for (let i = 0; i < this.rects.length; i++) {


            if (logging.getLevel() <= 1) {
                this.showDebug(this.rects[i], color(0, 255, 0, 100));
            }

            if (this.rects[i].spheres !== undefined) {
                this.rects[i].spheres.show();
            }

            this.rects[i].paintedArea.show();

            if (this.rects[i].lines !== undefined) {
                this.rects[i].lines.show();
            }
        }

        for (let i = 0; i < this.interactionRects.length; i++) {

            if (this.interactionRects[i].spheres !== undefined) {
                this.interactionRects[i].spheres.show();
            }

            if (this.interactionRects[i].paintedArea !== undefined) {
                this.interactionRects[i].paintedArea.show();
            }
            if (logging.getLevel() <= 1) {
                this.showDebug(this.interactionRects[i], color(255, 0, 0, 100));
            }
        }
    }

    showDebug(object, colorObject) {

        buffer.push();
        buffer.noStroke();
        // buffer.fill(brightenColor(object.colorObject, 50));
        buffer.fill(colorObject);
        buffer.rectMode(CENTER);

        if (typeof object.posXNew !== 'undefined') {
            buffer.translate(object.posXNew / exportRatio, object.posYNew / exportRatio);
            buffer.rect(0, 0, object.widthNew / exportRatio, object.heightNew / exportRatio);
            buffer.stroke(15);
            buffer.point(0, 0)
        } else if (typeof object.posX !== 'undefined') {
            buffer.translate(object.posX / exportRatio, object.posY / exportRatio);
            buffer.rect(0, 0, object.width / exportRatio, object.height / exportRatio);
            buffer.stroke(5);
            buffer.point(0, 0)
        }
        buffer.pop();
    }
}