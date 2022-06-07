class noiseParticles {

    constructor(data) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);

        this.inc = data.inc;
        this.colorSolid = data.colorSolid;
        this.opacityValue = data.opacityValue;
        this.scl = data.scl;
        this.distortion = data.distortion;
        this.amountMax = data.amountMax;
        this.margin = data.margin;

        this.cols = (exportPaper.width - 2 * this.margin) / this.scl;
        this.rows = (exportPaper.height - 2 * this.margin) / this.scl;

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
    }

    drawAll() {

        for (var particle of this.particles) {
            // console.log(this.particles);
            buffer.push();
            buffer.translate(particle.posX / exportRatio, particle.posY / exportRatio);

            // buffer.noFill();
            buffer.fill(particle.colorObject);

            // buffer.strokeWeight(1 / exportRatio);
            // buffer.stroke(10, 5);
            buffer.noStroke();
            buffer.rect(0, 0, particle.width / exportRatio, particle.height / exportRatio);
            buffer.pop();
        }
    }

}