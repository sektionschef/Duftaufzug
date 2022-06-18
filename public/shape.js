
class Shape {

    constructor(data) {

        this.buffer = data.buffer;
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
        if (data.solidColorArea instanceof Array) {
            this.solidColorArea = getRandomFromList(data.solidColorArea);
        } else {
            this.solidColorArea = data.solidColorArea;
        }
        this.opacityFillValue = data.opacityFillValue;
        this.blur = data.blur;

        this.origin = data.origin;

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
    }

    draw() {
        this.buffer.push();

        if (typeof this.blur != "undefined") {
            this.buffer.drawingContext.filter = 'blur(' + this.blur + 'px)';
        }
        this.buffer.curveTightness(this.curveTightness)

        // STROKE
        if (this.noColorStroke == true) {
            this.buffer.noStroke();
        } else {
            if (MODE == 5) {
                this.solidColorStroke.setAlpha(255);
            } else {
                this.solidColorStroke.setAlpha(this.opacityStrokeValue);
            }

            this.buffer.stroke(this.solidColorStroke);
            this.buffer.strokeWeight(this.solidstrokeWeight / exportRatio);
        }

        // FILL
        if (MODE == 5) {
            this.solidColorArea.setAlpha(255);
        } else {
            this.solidColorArea.setAlpha(this.opacityFillValue);
        }

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
        this.buffer = data.buffer;
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
        this.opacityFillValue = data.opacityFillValue;
        this.origin = data.origin;
        this.duft = data.duft;
        this.duftOrbit = data.duftOrbit;
        this.duftArea = data.duftArea;
        this.duftCounty = data.duftCounty;
        this.blur = data.blur;

        this.shapes = []
        // this.securityMargin = BACKGROUNDMARGIN + this.radioMin + (this.radioMax - this.radioMin) / 2;
        this.securityMargin = BACKGROUNDMARGIN + this.radioMax;

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

                // this.origin = createVector(posX, posY);
            }

            // place shapes in area between duft and the edge
            if (this.duftArea == true) {

                // this.origin = createVector(
                //     getRandomFromInterval(duftArea.position.x, duftArea.position.x + duftArea.width),
                //     getRandomFromInterval(duftArea.position.y, duftArea.position.y + duftArea.height),
                // )

                var posX = getRandomFromInterval(duftArea.position.x, duftArea.position.x + duftArea.width);
                var posY = getRandomFromInterval(duftArea.position.y, duftArea.position.y + duftArea.height);

                // this.solidColorArea = distortColor(this.solidColorArea, 0.5);
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
                        this.securityMargin,
                        (exportPaper.width - this.securityMargin)
                    ), constrain(
                        posY,
                        this.securityMargin,
                        (exportPaper.height - this.securityMargin)
                    )
                )
            }



            var data = {
                buffer: this.buffer,
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
                opacityFillValue: this.opacityStrokeValue,
                opacityStrokeValue: this.opacityFillValue,
                blur: this.blur,
            }

            this.shapes.push(new Shape(data));
        }

        this.drawAll();

    }

    drawAll() {

        this.buffer.clear();
        this.buffer.scale(scaleRatio);

        for (var shape of this.shapes) {
            shape.draw();
        }
    }
}