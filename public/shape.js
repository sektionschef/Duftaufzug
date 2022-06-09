
class Shape {

    constructor(data) {

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

        this.polygons = [];
        this.origin = createVector(getRandomFromInterval(0 + this.margin, exportPaper.width - this.margin), getRandomFromInterval(0 + this.margin, exportPaper.height - this.margin));

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

        buffer.push();
        buffer.curveTightness(this.curveTightness)

        if (this.noColorStroke == true) {
            buffer.noStroke();
        } else {
            buffer.stroke(color(this.solidColorStroke, this.opacityValue));
        }

        // buffer.noFill();
        buffer.fill(color(this.solidColorArea, this.opacityValue));

        for (var polygon of this.polygons) {
            buffer.beginShape();
            buffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
            buffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
            buffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
            buffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
            buffer.endShape(CLOSE);
        }
        buffer.pop();

        this.draw_debug();
    }


    draw_debug() {

        if (logging.getLevel() <= 1) {
            buffer.push();
            buffer.strokeWeight(2);
            buffer.point(this.rightUp.x / exportRatio, this.rightUp.y / exportRatio);
            buffer.point(this.rightDown.x / exportRatio, this.rightDown.y / exportRatio);
            buffer.point(this.leftDown.x / exportRatio, this.leftDown.y / exportRatio);
            buffer.point(this.leftUp.x / exportRatio, this.leftUp.y / exportRatio);
            buffer.pop();


            // debug
            buffer.push();
            buffer.strokeWeight(4);
            buffer.point(this.origin.x / exportRatio, this.origin.y / exportRatio);
            buffer.pop();
        }

    }
}

class Shapes {
    constructor(data) {
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

        this.shapes = []

        for (var i = 0; i < this.shapeCount; i++) {

            var data = {
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

    }

    drawAll() {
        for (var shape of this.shapes) {
            shape.draw();
        }
    }
}