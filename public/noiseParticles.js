class noiseParticles {

    constructor(data) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);

        this.pg = wallBuffer;
        this.inc = data.inc;
        this.colorSolid = data.colorSolid;
        this.opacityValue = data.opacityValue;
        this.scl = data.scl;
        this.distortion = data.distortion;
        this.amountMax = data.amountMax;
        this.margin = data.margin;

        this.width = exportPaper.width - 2 * this.margin;
        this.height = exportPaper.height - 2 * this.margin;

        // this.pg = createGraphics(this.width, this.height);
        // this.pg.clear();
        // this.pg.scale(scaleRatio);

        this.cols = this.width / this.scl;
        this.rows = this.height / this.scl;

        this.particles = []

        var yoff = 0;
        for (var y = 0; y < this.rows; y++) {
            var xoff = 0;
            for (var x = 0; x < this.cols; x++) {

                // mix colors
                let r = noise(xoff, yoff);

                for (var amount = 0; amount < r * this.amountMax; amount++) {

                    this.particles.push(
                        {
                            posX: (this.margin + x * this.scl) + getRandomFromInterval(0, this.distortion),
                            posY: (this.margin + y * this.scl) + getRandomFromInterval(0, this.distortion),
                            colorObject: color(this.colorSolid, this.opacityValue),
                            width: this.scl,
                            height: this.scl

                        }
                    )
                }

                xoff += this.inc;
            }
            yoff += this.inc;
        }

        this.drawAll();
    }

    drawAll() {


        for (var particle of this.particles) {
            // console.log(this.particles);
            this.pg.push();
            this.pg.translate(particle.posX / exportRatio, particle.posY / exportRatio);

            // this.pg.noFill();
            this.pg.fill(particle.colorObject);

            // this.pg.strokeWeight(1 / exportRatio);
            // this.pg.stroke(10, 5);
            this.pg.noStroke();
            this.pg.rect(0, 0, particle.width / exportRatio, particle.height / exportRatio);
            this.pg.pop();
        }

        // debug buffer size
        this.pg.noFill();
        // this.pg.fill(255, 0, 0);
        this.pg.strokeWeight(1);
        this.pg.rect(0, 0, this.pg.width, this.pg.height);
    }
}