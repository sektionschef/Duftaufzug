
class Shape {

    constructor(data) {
        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;
        this.polygonCount = data.polygonCount;
        this.margin = data.margin;
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidstrokeWeight = data.solidstrokeWeight;
        this.solidColorStroke = data.solidColorStroke;
        this.opacityStrokeValue = data.opacityStrokeValue;
        this.textureData = data.textureData;

        if (data.solidColorArea instanceof Array) {
            this.colorIndex = Math.round(getRandomFromList([0, (data.solidColorArea.length - 1)]));
            this.solidColorArea = data.solidColorArea[this.colorIndex];
            this.noiseColorArea = data.noiseColorArea[this.colorIndex];
        } else {
            this.solidColorArea = data.solidColorArea;
            this.noiseColorArea = data.noiseColorArea;
        }
        this.opacityFillValue = data.opacityFillValue;
        this.blur = data.blur;

        this.origin = data.origin;

        if (MODE == 5) {
            this.solidColorStroke.setAlpha(255);
        } else {
            this.solidColorStroke.setAlpha(this.opacityStrokeValue);
        }

        if (MODE == 5) {
            this.solidColorArea.setAlpha(255);
        } else {
            this.solidColorArea.setAlpha(this.opacityFillValue);
        }


        this.polygons = [];
        this.rightUp = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));
        this.rightDown = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        this.leftDown = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        this.leftUp = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));

        for (var i = 0; i < this.polygonCount; i++) {
            this.polygons.push({
                rightUp: createVector(this.rightUp.x + getRandomFromInterval(0, this.radioDistortion), this.rightUp.y + getRandomFromInterval(0, this.radioDistortion)),
                rightDown: createVector(this.rightDown.x + getRandomFromInterval(0, this.radioDistortion), this.rightDown.y + getRandomFromInterval(0, this.radioDistortion)),
                leftDown: createVector(this.leftDown.x + getRandomFromInterval(0, this.radioDistortion), this.leftDown.y + getRandomFromInterval(0, this.radioDistortion)),
                leftUp: createVector(this.leftUp.x + getRandomFromInterval(0, this.radioDistortion), this.leftUp.y + getRandomFromInterval(0, this.radioDistortion))
            })
        }

        this.textureData.colorForeground = this.noiseColorArea;

        if (MODE == 1) {
            this.texture = new Pixies(this.textureData);
        }
    }

    draw() {
        this.buffer.push();

        if (typeof this.blur != "undefined" && MODE < 5) {
            this.buffer.drawingContext.filter = 'blur(' + this.blur + 'px)';
        }
        this.buffer.curveTightness(this.curveTightness)

        // STROKE
        if (this.noColorStroke == true) {
            this.buffer.noStroke();
        } else {
            this.buffer.stroke(this.solidColorStroke);
            this.buffer.strokeWeight(this.solidstrokeWeight / exportRatio);
        }

        // FILL
        this.buffer.fill(this.solidColorArea);

        for (var polygon of this.polygons) {
            this.buffer.beginShape();
            this.buffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
            this.buffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
            this.buffer.endShape(CLOSE);

            if (MODE > 2) {
                break
            }
        }
        this.buffer.pop();

        this.draw_debug();
    }


    draw_debug() {

        if (MODE == 5) {
            this.buffer.push();
            this.buffer.strokeWeight(1 / exportRatio);
            this.buffer.stroke("yellow");
            this.buffer.point(this.rightUp.x / exportRatio, this.rightUp.y / exportRatio);
            this.buffer.point(this.rightDown.x / exportRatio, this.rightDown.y / exportRatio);
            this.buffer.point(this.leftDown.x / exportRatio, this.leftDown.y / exportRatio);
            this.buffer.point(this.leftUp.x / exportRatio, this.leftUp.y / exportRatio);
            this.buffer.pop();

            // margin visible
            this.buffer.push();
            this.buffer.noFill()
            this.buffer.stroke("orange")
            this.buffer.strokeWeight(1 / exportRatio);
            this.buffer.rect(this.margin / exportRatio, this.margin / exportRatio, (exportPaper.width - 2 * this.margin) / exportRatio, (exportPaper.height - 2 * this.margin) / exportRatio);
            this.buffer.pop();

            // debug origin - orbit
            this.buffer.push();
            this.buffer.stroke("blue");
            this.buffer.strokeWeight(30 / exportRatio);
            this.buffer.point(this.origin.x / exportRatio, this.origin.y / exportRatio);
            this.buffer.pop();
        }


    }
}

class Shapes {
    constructor(data) {
        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.shapeCount = data.shapeCount;
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;  // misplacement
        this.polygonCount = data.polygonCount;  // how many overlapping polygons to draw
        this.margin = data.margin;  // distance from edge
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidColorStroke = data.solidColorStroke;
        this.opacityStrokeValue = data.opacityStrokeValue;
        this.solidColorArea = data.solidColorArea;
        this.noiseColorArea = data.noiseColorArea;
        this.opacityFillValue = data.opacityFillValue;
        this.origin = data.origin;
        this.duft = data.duft;
        this.duftOrbit = data.duftOrbit;
        this.duftArea = data.duftArea;
        this.duftCounty = data.duftCounty;
        this.blur = data.blur;
        this.textureData = data.textureData;

        this.shapes = []

        for (var i = 0; i < this.shapeCount; i++) {

            // place randomly on the orbit
            if (this.duftOrbit == true) {
                var orient = getRandomFromList(["x-axis", "y-axis"]);

                if (orient == "x-axis") {
                    var posX = getRandomFromInterval((duftOrigin.x - duftOrbit), (duftOrigin.x + duftOrbit))
                    var posY = getRandomFromList([(duftOrigin.y - duftOrbit), (duftOrigin.y + duftOrbit)])
                } else {
                    var posX = getRandomFromList([(duftOrigin.x - duftOrbit), (duftOrigin.x + duftOrbit)])
                    var posY = getRandomFromInterval((duftOrigin.y - duftOrbit), (duftOrigin.y + duftOrbit))
                }
            }

            // place shapes in area between duft and the edge
            if (this.duftArea == true) {

                var posX = getRandomFromInterval(duftArea.position.x, duftArea.position.x + duftArea.width);
                var posY = getRandomFromInterval(duftArea.position.y, duftArea.position.y + duftArea.height);

            }
            if (this.duftCounty == true) {

                var posX = getRandomFromInterval(duftCounty.position.x, duftCounty.position.x + duftCounty.width);
                var posY = getRandomFromInterval(duftCounty.position.y, duftCounty.position.y + duftCounty.height)

            }

            if (this.duft != true) {
                //draw inside of margins, in respect to the shape's size
                this.origin = createVector(
                    constrain(
                        posX,
                        BACKGROUNDMARGIN + this.radioMax,
                        (exportPaper.width - BACKGROUNDMARGIN - this.radioMax)
                    ), constrain(
                        posY,
                        BACKGROUNDMARGIN + this.radioMax,
                        (exportPaper.height - BACKGROUNDMARGIN - this.radioMax)
                    )
                )
            }

            var dataShape = {
                buffer: this.bufferShape,
                origin: this.origin,
                radioMin: this.radioMin,
                radioMax: this.radioMax,
                radioDistortion: this.radioDistortion,
                polygonCount: this.polygonCount,
                opacityValue: this.opacityValue,
                margin: this.margin,
                curveTightness: this.curveTightness,
                noColorStroke: this.noColorStroke,
                solidColorStroke: this.solidColorStroke,
                solidColorArea: this.solidColorArea,
                noiseColorArea: this.noiseColorArea,
                opacityFillValue: this.opacityFillValue,
                opacityStrokeValue: this.opacityStrokeValue,
                blur: this.blur,
                textureData: this.textureData,
            }

            this.shapes.push(new Shape(dataShape));
        }

        this.drawAll();

    }

    drawAll() {

        this.buffer.clear();
        this.buffer.scale(scaleRatio);

        for (var shape of this.shapes) {
            if (MODE == 1) {
                shape.draw();
                // only shape
                this.buffer.image(shape.buffer, 0, 0, shape.buffer.width, shape.buffer.height);

                // only texture
                // this.buffer.image(shape.texture.buffer, 0, 0, shape.texture.buffer.width, shape.texture.buffer.height);

                // masked - only the noise is masked, the color comes from the shape
                this.bufferMasked = maskBuffers(shape.texture.buffer, shape.buffer);
                this.buffer.image(this.bufferMasked, 0, 0, this.bufferMasked.width, this.bufferMasked.height);
            } else {
                shape.draw();
            }
        }
    }
}