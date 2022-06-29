
class Lines {

    constructor(pointA, pointB) {

        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.pointA = pointA;
        this.pointB = pointB;

        this.draw();
    }

    draw() {
        this.buffer.push();
        this.buffer.drawingContext.filter = 'blur(3px)';
        this.buffer.stroke("black");
        this.buffer.strokeWeight(5 / exportRatio);

        // this.buffer.noFill();
        // this.buffer.curveTightness(1.5);
        // this.buffer.beginShape();
        // this.buffer.curveVertex(800 / exportRatio, 1000 / exportRatio);
        // this.buffer.curveVertex(800 / exportRatio, 1000 / exportRatio);
        // this.buffer.curveVertex(((800 - 300) / 2 + 800 + 30) / exportRatio, ((1000 - 1200) / 2 + 1000 + 30) / exportRatio);
        // this.buffer.curveVertex(300 / exportRatio, 1200 / exportRatio);
        // this.buffer.curveVertex(300 / exportRatio, 1200 / exportRatio);
        // this.buffer.endShape();


        var b = this.pointA.x - this.pointB.x;
        var a = this.pointA.y - this.pointB.y;
        // console.log(a);
        // console.log(b);
        this.angle = atan(a / b);

        this.buffer.translate(this.pointA.x / exportRatio, this.pointA.y / exportRatio);

        let pop = p5.Vector.fromAngle(this.angle, 4000 / exportRatio);


        // this.buffer.stroke("blue");
        // this.buffer.strokeWeight(50 / exportRatio);
        // console.log(pop.x);
        // this.buffer.point(pop.x / exportRatio, pop.y / exportRatio);
        this.buffer.line(0, 0, pop.x, pop.y);

        // this.buffer.line(this.pointB.x / exportRatio, this.pointB.y / exportRatio, this.pointA.x / exportRatio, this.pointA.y / exportRatio);
        // this.buffer.line(this.pointA.x / exportRatio, this.pointA.y / exportRatio, this.pointB.x / exportRatio, this.pointB.y / exportRatio);


        // this.buffer.drawingContext.filter = 'none';
        this.buffer.pop();

        this.draw_debug();
    }


    draw_debug() {

        if (MODE == 1) {
            this.buffer.push();
            this.buffer.stroke("green");
            this.buffer.strokeWeight(50 / exportRatio);
            this.buffer.point(this.pointA.x / exportRatio, this.pointA.y / exportRatio);
            this.buffer.pop();

            this.buffer.push();
            this.buffer.stroke("white");
            this.buffer.strokeWeight(50 / exportRatio);
            this.buffer.point(this.pointB.x / exportRatio, this.pointB.y / exportRatio);
            this.buffer.pop();
        }


    }
}
