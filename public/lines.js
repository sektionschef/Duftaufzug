
class Lines {

    constructor(data) {

        this.buffer = data.buffer;
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;
        this.polygonCount = data.polygonCount;
        // this.opacityValue = data.opacityValue;
        this.margin = data.margin;
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidstrokeWeight = data.solidstrokeWeight;
        this.solidColorStroke = data.solidColorStroke;
        this.solidColorArea = data.solidColorArea;

        this.origin = data.origin;

        // this.polygons = [];
        // this.rightUp = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));
        // this.rightDown = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        // this.leftDown = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        // this.leftUp = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));

        // for (var i = 0; i < this.polygonCount; i++) {
        //     this.polygons.push({
        //         rightUp: createVector(this.rightUp.x + getRandomFromInterval(0, this.radioDistortion), this.rightUp.y + getRandomFromInterval(0, this.radioDistortion)),
        //         rightDown: createVector(this.rightDown.x + getRandomFromInterval(0, this.radioDistortion), this.rightDown.y + getRandomFromInterval(0, this.radioDistortion)),
        //         leftDown: createVector(this.leftDown.x + getRandomFromInterval(0, this.radioDistortion), this.leftDown.y + getRandomFromInterval(0, this.radioDistortion)),
        //         leftUp: createVector(this.leftUp.x + getRandomFromInterval(0, this.radioDistortion), this.leftUp.y + getRandomFromInterval(0, this.radioDistortion))
        //     })
        // }

        this.draw();
    }

    draw() {
        // this.buffer.push();
        // this.buffer.curveTightness(this.curveTightness)

        // if (this.noColorStroke == true) {
        //     this.buffer.noStroke();
        // } else {
        //     // this.buffer.stroke(color(this.solidColorStroke, this.opacityValue));
        //     this.buffer.stroke(this.solidColorStroke);
        //     this.buffer.strokeWeight(this.solidstrokeWeight / exportRatio);
        // }

        // // this.buffer.noFill();
        // // this.buffer.fill(color(this.solidColorArea, this.opacityValue));
        // this.buffer.fill(this.solidColorArea);

        // for (var polygon of this.polygons) {
        //     this.buffer.beginShape();
        //     this.buffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
        //     this.buffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
        //     this.buffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
        //     this.buffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
        //     this.buffer.endShape(CLOSE);
        // }
        // this.buffer.pop();

        this.buffer.push();
        this.buffer.drawingContext.filter = 'blur(3px)';
        this.buffer.stroke("black");
        this.buffer.strokeWeight(5 / exportRatio);
        this.buffer.noFill();
        this.buffer.curveTightness(1.5);
        this.buffer.beginShape();
        this.buffer.curveVertex(800 / exportRatio, 1000 / exportRatio);
        this.buffer.curveVertex(800 / exportRatio, 1000 / exportRatio);
        this.buffer.curveVertex(((800 - 300) / 2 + 800 + 30) / exportRatio, ((1000 - 1200) / 2 + 1000 + 30) / exportRatio);
        this.buffer.curveVertex(300 / exportRatio, 1200 / exportRatio);
        this.buffer.curveVertex(300 / exportRatio, 1200 / exportRatio);
        this.buffer.endShape();
        this.buffer.pop();

        this.draw_debug();
    }


    draw_debug() {

        if (logging.getLevel() <= 1) {

        }


    }
}
