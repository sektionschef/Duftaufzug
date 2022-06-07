class noiseParticles {

    constructor(
        // custom_width,
        // custom_height,
        // colorObject1,
        // colorObject2,
        // inc,
        // noiseDetailLod,
        // noiseDetailFalloff,
        // opacityValue,
    ) {

        // noiseDetail(noiseDetailLod, noiseDetailFalloff);

        let inc = 0.02;
        let opacityValue = 5;
        let scl = 20;  // size of the cell
        let distortion = 30;  // random misplacement
        let amountMax = 20; // how many rects per cell, max
        let margin = 200 // distance to the edge

        let cols = (exportPaper.width - 2 * margin) / scl;
        let rows = (exportPaper.height - 2 * margin) / scl;

        this.particles = []

        var yoff = 0;
        for (var y = 0; y < rows; y++) {
            var xoff = 0;
            for (var x = 0; x < cols; x++) {

                // mix colors
                let r = noise(xoff, yoff);

                for (var amount = 0; amount < r * amountMax; amount++) {

                    this.particles.push(
                        {
                            posX: (margin + x * scl) + getRandomFromInterval(0, distortion),
                            posY: (margin + y * scl) + getRandomFromInterval(0, distortion),
                            colorObject: color(10, opacityValue),
                            width: scl,
                            height: scl

                        }
                    )
                }

                xoff += inc;
            }
            yoff += inc;
        }
    }

    showAll() {

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