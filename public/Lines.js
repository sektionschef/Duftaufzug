class NewLines {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                posX: 200,
                posY: 200,
                custom_width: 400,
                custom_height: 200,
                colorObject: color(0),
                distance: 30,
                noise: 1,
                strokeSize: 2,
                curveTightness: 3,
                opacityLevel: 180,
                brushLengthAndBreadth: 30,
            }
        }

        this.posX = data.posX;
        this.posY = data.posY;
        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.colorObject = data.colorObject;
        this.distance = data.distance;
        this.noise = data.noise;
        this.strokeSize = data.strokeSize;
        this.curveTightness = data.curveTightness;
        this.opacityLevel = data.opacityLevel;

        this.colorObject.setAlpha(this.opacityLevel);

        if (this.custom_width > this.custom_height) {
            this.orientation = "vertical";

            this.nOfLines = Math.round((this.custom_width - this.distance) / (this.distance + this.strokeSize));
            this.distance_ = this.custom_width / (this.nOfLines + 1);
        } else {
            this.orientation = "horizontal";

            this.nOfLines = Math.round((this.custom_height - this.distance) / (this.distance + this.strokeSize));
            this.distance_ = this.custom_height / (this.nOfLines + 1);
        }
    }

    show() {
        buffer.push();

        buffer.translate((this.posX - this.custom_width / 2) / exportRatio, (this.posY - this.custom_height / 2) / exportRatio, 0);

        if (logging.getLevel() <= 1) {
            // DEBUG
            buffer.noStroke();
            buffer.fill("red");
            buffer.rect(0, 0, this.custom_width / exportRatio, this.custom_height / exportRatio, 0);
        }

        buffer.strokeWeight(this.strokeSize / exportRatio);
        buffer.stroke(this.colorObject);
        buffer.noFill();
        buffer.curveTightness(this.curveTightness);


        if (this.orientation == "horizontal") {
            this.limit = this.custom_width;
            let pos_ = 0;
            for (var i = 0; i <= this.nOfLines; i++) {

                pos_ += this.distance_
                buffer.beginShape();
                // first
                buffer.curveVertex(0, pos_ / exportRatio, 0);
                buffer.curveVertex(0, pos_ / exportRatio, 0);
                // middle
                buffer.curveVertex(this.limit / 4 / exportRatio, (pos_ + getRandomFromInterval(- this.noise, this.noise)) / exportRatio, 0);
                buffer.curveVertex(this.limit * 3 / 4 / exportRatio, (pos_ + getRandomFromInterval(- this.noise, this.noise)) / exportRatio, 0);
                // last
                buffer.curveVertex(this.limit / exportRatio, pos_ / exportRatio, 0);
                buffer.curveVertex(this.limit / exportRatio, pos_ / exportRatio, 0);
                buffer.endShape();
            }
        } else if (this.orientation == "vertical") {
            this.limit = this.custom_height;
            let pos_ = 0;
            for (var i = 0; i <= this.nOfLines; i++) {

                pos_ += this.distance_
                buffer.beginShape();
                // first
                buffer.curveVertex(pos_ / exportRatio, 0, 0);
                buffer.curveVertex(pos_ / exportRatio, 0, 0);
                // middle
                buffer.curveVertex((pos_ + getRandomFromInterval(- this.noise, this.noise)) / exportRatio, (this.limit) / 4 / exportRatio, 0);
                buffer.curveVertex((pos_ + getRandomFromInterval(- this.noise, this.noise)) / exportRatio, (this.limit) * 3 / 4 / exportRatio, 0);
                // last
                buffer.curveVertex(pos_ / exportRatio, this.limit / exportRatio, 0);
                buffer.curveVertex(pos_ / exportRatio, this.limit / exportRatio, 0);
                buffer.endShape();
            }
        }

        buffer.pop();
    }
}