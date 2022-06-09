class noiseParticles {

    constructor(data) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);

        this.buffer = wallBuffer;
        this.inc = data.inc;
        this.colorSolid = data.colorSolid;
        this.opacityValue = data.opacityValue;
        this.scl = data.scl;
        this.distortion = data.distortion;
        this.amountMax = data.amountMax;
        this.margin = data.margin;

        this.width = exportPaper.width - 2 * this.margin;
        this.height = exportPaper.height - 2 * this.margin;

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

        this.buffer.clear();
        this.buffer.scale(scaleRatio);


        for (var particle of this.particles) {
            // console.log(this.particles);
            this.buffer.push();
            this.buffer.translate(particle.posX / exportRatio, particle.posY / exportRatio);

            // this.buffer.noFill();
            this.buffer.fill(particle.colorObject);

            // this.buffer.strokeWeight(1 / exportRatio);
            // this.buffer.stroke(10, 5);
            this.buffer.noStroke();
            this.buffer.rect(0, 0, particle.width / exportRatio, particle.height / exportRatio);
            this.buffer.pop();
        }

        // debug buffer size
        this.buffer.noFill();
        // this.buffer.fill(255, 0, 0);
        this.buffer.strokeWeight(1);
        this.buffer.rect(0, 0, this.buffer.width, this.buffer.height);
    }
}