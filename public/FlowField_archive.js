// based dan shiffman on https://editor.p5js.org/codingtrain/sketches/vDcIAbfg7 & https://www.youtube.com/watch?v=BjoM9oKOAKY&t=1154s 

class FlowField {
    // needs a static background to see the traces - needs creategraphics()
    constructor(custom_width, custom_height) {
        this.inc = 0.1;
        this.scl = 10;
        this.numberParticles = 300

        this.buffer = createGraphics(custom_width, custom_height);

        this.particles = [];
        this.create_grid();
        this.create_particles()
    }

    create_grid() {
        this.cols = floor(this.buffer.width / this.scl);
        this.rows = floor(this.buffer.height / this.scl);

        this.flowfield = new Array(this.cols * this.rows);
    }

    create_particles() {
        for (var i = 0; i < this.numberParticles; i++) {
            this.particles[i] = new FlowFieldParticle(this.buffer, this.scl, this.cols);
        }
    }

    update_particles() {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].follow(this.flowfield);
            this.particles[i].update();
            this.particles[i].edges();
            this.particles[i].show();
        }
    }

    update_noise() {
        var zoff = 0;
        var yoff = 0;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < this.cols; x++) {
                var index = x + y * this.cols;
                var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
                var v = p5.Vector.fromAngle(angle);
                v.setMag(1);
                this.flowfield[index] = v;
                xoff += this.inc;
                // push();
                // stroke(0, 50);

                // translate(x * this.scl, y * this.scl);
                // rotate(v.heading());
                // strokeWeight(1);
                // line(0, 0, this.scl, 0);
                // pop();
            }
            yoff += this.inc;

            zoff += 0.0003;
        }

        this.update_particles();
        return this.buffer
    }
}


class FlowFieldParticle {
    constructor(buffer, scl, cols) {
        this.buffer = buffer;
        this.scl = scl;
        this.cols = cols;

        this.pos = createVector(getRandomFromInterval(0, this.buffer.width), getRandomFromInterval(0, this.buffer.height));
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.maxspeed = 4;
        this.prevPos = this.pos.copy();
    }

    update() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    follow(vectors) {
        var x = floor(this.pos.x / this.scl);
        var y = floor(this.pos.y / this.scl);
        var index = x + y * this.cols;
        var force = vectors[index];
        this.applyForce(force);
    }

    applyForce(force) {
        this.acc.add(force);
    }

    show() {
        this.buffer.push();
        this.buffer.stroke(255, 5);  // 255, 10
        this.buffer.strokeWeight(1);  // 1
        // this.buffer.point(this.pos.x, this.pos.y);
        this.buffer.line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
        this.buffer.pop();
        this.updatePrev();
    }

    updatePrev() {
        this.prevPos.x = this.pos.x;
        this.prevPos.y = this.pos.y;
    }

    edges() {
        if (this.pos.x > this.buffer.width) {
            this.pos.x = 0;
            this.updatePrev();
        }
        if (this.pos.x < 0) {
            this.pos.x = this.buffer.width;
            this.updatePrev();
        }
        if (this.pos.y > this.buffer.height) {
            this.pos.y = 0;
            this.updatePrev();
        }
        if (this.pos.y < 0) {
            this.pos.y = this.buffer.height;
            this.updatePrev();
        }

    }

}