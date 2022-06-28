
class Lines {

    constructor(pointA, pointB) {

        // this.buffer = data.buffer;
        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.pointA = pointA;
        this.pointB = pointB;

        // this.pointA = createVector(650, 670);
        // this.pointB = createVector(1500, 1730);

        this.draw();
    }

    draw() {
        // debug points
        if (MODE == 5) {
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
        // console.log(this.angle);

        // console.log(this.pointA);
        // console.log(this.pointB);
        this.buffer.translate(this.pointA.x / exportRatio, this.pointA.y / exportRatio);

        // this.buffer.angleMode(DEGREES);
        // console.log(this.pointA.heading());
        // let angle = this.pointA.heading();
        // let angle = this.pointB.angleBetween(this.pointA);
        // console.log(angle);
        // var angle = radians(30);
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

        if (logging.getLevel() <= 1) {

        }


    }
}
