
class Shape {

    constructor() {

        this.radio = 450;
        this.radioDistortion = 200;  // misplacement
        this.polygonCount = 10;
        this.opacityValue = 9;
        this.margin = 500;
        this.curveTightness = -3;
        this.solidColorStroke = 130;
        this.solidColorArea = 200;

        this.polygons = [];
        this.origin = createVector(getRandomFromInterval(0 + this.margin, exportPaper.width - this.margin), getRandomFromInterval(0 + this.margin, exportPaper.height - this.margin));

        this.rightUp = createVector(this.origin.x + getRandomFromInterval(0, this.radio), this.origin.y + getRandomFromInterval(0, -this.radio));
        this.rightDown = createVector(this.origin.x + getRandomFromInterval(0, this.radio), this.origin.y + getRandomFromInterval(0, this.radio));
        this.leftDown = createVector(this.origin.x + getRandomFromInterval(0, -this.radio), this.origin.y + getRandomFromInterval(0, this.radio));
        this.leftUp = createVector(this.origin.x + getRandomFromInterval(0, -this.radio), this.origin.y + getRandomFromInterval(0, -this.radio));

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

        // buffer.noStroke();
        buffer.stroke(color(this.solidColorStroke, this.opacityValue));

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