
class Lines {

    constructor(pointA, pointB, direction) {

        this.pointA = pointA;
        this.pointB = pointB;
        this.direction = direction;

        this.blur = 3;
        this.strokeWeight = 5;

        // a little offset ot default margin
        this.localMargin = BACKGROUNDMARGIN - 50;

        this.buffer = createGraphics(rescaling_width, rescaling_height);

        // mask the margin for the canvas
        this.marginBuffer = createGraphics(rescaling_width, rescaling_height);
        this.marginBuffer.fill(color(colors[PALETTE].duft));
        this.marginBuffer.noStroke();
        this.marginBuffer.rect(
            this.localMargin / exportRatio,
            this.localMargin / exportRatio,
            (exportPaper.width - this.localMargin * 2) / exportRatio,
            (exportPaper.height - this.localMargin * 2) / exportRatio
        );

        this.draw();
    }

    draw() {

        this.buffer.push();
        this.buffer.drawingContext.filter = `blur(${this.blur * blurFeature}px)`;
        this.buffer.stroke(color(colors[PALETTE].duft));
        this.buffer.strokeWeight(this.strokeWeight / exportRatio);

        var b = this.pointA.x - this.pointB.x;
        var a = this.pointA.y - this.pointB.y;
        this.angle = atan(a / b);

        if (this.direction == "left") {
            this.angle = this.angle - PI;
            this.buffer.translate(this.pointA.x / exportRatio, this.pointA.y / exportRatio);
        } else if (this.direction == "up") {
            // correct link - all in one direction
            if (this.angle < 0) {
                this.angle = this.angle - PI;
            }
            this.angle = this.angle - PI;
            this.buffer.translate(this.pointA.x / exportRatio, this.pointA.y / exportRatio);
        } else if (this.direction == "down") {
            if (this.angle < 0) {
                this.angle = this.angle - PI;
            }
            this.buffer.translate(this.pointB.x / exportRatio, this.pointB.y / exportRatio);
        } else if (this.direction == "right") {
            this.buffer.translate(this.pointB.x / exportRatio, this.pointB.y / exportRatio);
        } else {
            console.log("specify direction");
        }


        let goal = p5.Vector.fromAngle(this.angle, 4000 / exportRatio);
        this.buffer.line(0, 0, goal.x, goal.y);

        this.buffer.drawingContext.filter = 'none';
        this.buffer.pop();

        // debug
        // this.buffer.image(this.marginBuffer, 0, 0);

        this.buffer = maskBuffers(this.marginBuffer, this.buffer);

        this.draw_debug();
    }


    draw_debug() {

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
    }
}
