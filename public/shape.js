
class Shape {

    constructor(data) {

        this.buffer = data.buffer;
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;
        this.polygonCount = data.polygonCount;
        this.opacityValue = data.opacityValue;
        this.margin = data.margin;
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidColorStroke = data.solidColorStroke;
        this.solidColorArea = data.solidColorArea;

        if (typeof data.origin == "undefined") {
            this.origin = createVector(getRandomFromInterval(0 + this.margin, exportPaper.width - this.margin), getRandomFromInterval(0 + this.margin, exportPaper.height - this.margin));
        } else {
            this.origin = data.origin
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
    }

    draw() {

        this.buffer.push();
        this.buffer.curveTightness(this.curveTightness)

        if (this.noColorStroke == true) {
            this.buffer.noStroke();
        } else {
            this.buffer.stroke(color(this.solidColorStroke, this.opacityValue));
        }

        // this.buffer.noFill();
        this.buffer.fill(color(this.solidColorArea, this.opacityValue));

        for (var polygon of this.polygons) {
            this.buffer.beginShape();
            this.buffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
            this.buffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
            this.buffer.endShape(CLOSE);
        }
        this.buffer.pop();

        this.draw_debug();
    }


    draw_debug() {

        if (logging.getLevel() <= 1) {
            this.buffer.push();
            this.buffer.strokeWeight(2);
            this.buffer.point(this.rightUp.x / exportRatio, this.rightUp.y / exportRatio);
            this.buffer.point(this.rightDown.x / exportRatio, this.rightDown.y / exportRatio);
            this.buffer.point(this.leftDown.x / exportRatio, this.leftDown.y / exportRatio);
            this.buffer.point(this.leftUp.x / exportRatio, this.leftUp.y / exportRatio);
            this.buffer.pop();

            // margin visible
            this.buffer.push();
            this.buffer.noFill()
            this.buffer.strokeWeight(1 / exportRatio);
            this.buffer.rect(this.margin / exportRatio, this.margin / exportRatio, (exportPaper.width - 2 * this.margin) / exportRatio, (exportPaper.height - 2 * this.margin) / exportRatio);
            this.buffer.pop();

            // debug origin - orbit
            this.buffer.push();
            this.buffer.stroke("red");
            this.buffer.strokeWeight(50 / exportRatio);
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
        this.opacityValue = data.opacityValue;
        this.margin = data.margin;  // distance from edge
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidColorStroke = data.solidColorStroke;
        this.solidColorArea = data.solidColorArea;
        this.duftOrbit = data.duftOrbit
        this.duftArea = data.duftArea

        this.shapes = []

        if (this.duftArea == true) {
            var orient = getRandomFromList(["down", "left", "up", "right"]);
            console.log(orient);
        }

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

                var origin = createVector(posX, posY);
            }

            // place shapes in area between duft and the dge
            if (this.duftArea == true) {

                if (orient == "down") {
                    var posX = getRandomFromInterval(duftOrigin.x - duftOrbit, duftOrigin.x + duftOrbit)
                    var posY = getRandomFromInterval(duftOrigin.y - duftOrbit, exportPaper.height)
                } else if (orient == "left") {
                    var posX = getRandomFromInterval(0, duftOrigin.x + duftOrbit)
                    var posY = getRandomFromInterval(duftOrigin.y - duftOrbit, duftOrigin.y + duftOrbit)
                } else if (orient == "up") {
                    var posX = getRandomFromInterval(duftOrigin.x - duftOrbit, duftOrigin.x + duftOrbit)
                    var posY = getRandomFromInterval(0, duftOrigin.y + duftOrbit)
                } else if (orient == "right") {
                    var posX = getRandomFromInterval(duftOrigin.x - duftOrbit, exportPaper.width)
                    var posY = getRandomFromInterval(duftOrigin.y - duftOrbit, duftOrigin.y + duftOrbit)
                }
                var origin = createVector(posX, posY);
            }

            var data = {
                buffer: this.buffer,
                origin: origin,
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