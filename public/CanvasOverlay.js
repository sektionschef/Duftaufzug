class CanvasOverlay {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                custom_width: exportPaper.width,
                custom_height: exportPaper.height,
                posX: 0,
                posY: 0,
                colorObject: color(100),
                opacity: 100,
                cellPerLine: 100,  // 1200;  // amazing with 3000 amount of cells per line, used to be 300 for width of 1000
                strokeWeight_: 0.3,
                deviation: 10,
            }
        }

        this.custom_width = data.custom_width;
        this.custom_height = data.custom_height;
        this.posX = data.posX;
        this.posY = data.posY;
        this.colorObject = data.colorObject;
        this.opacity = data.opacity;
        this.cellPerLine = data.cellPerLine;
        this.strokeWeight_ = data.strokeWeight_;
        this.deviation = data.deviation

        this.colorUsed = color(red(this.colorObject), green(this.colorObject), blue(this.colorObject), this.opacity);
        this.scl = this.custom_width / this.cellPerLine;
    }

    show() {
        buffer.push();
        buffer.translate(this.posX / exportRatio, this.posY / exportRatio);
        buffer.strokeWeight(this.strokeWeight_ / exportRatio);
        buffer.stroke(this.colorUsed);

        var scl = this.scl / exportRatio;
        var deviation_ = this.deviation;

        // logging.info("scl: " + scl);

        for (let x = 0; x < this.custom_width; x += scl) {
            for (let y = 0; y < this.custom_height; y += scl) {
                buffer.point((x + getRandomFromInterval(-deviation_, deviation_)) / exportRatio, (y + getRandomFromInterval(deviation_, deviation_)) / exportRatio);
            }
        }
        buffer.pop();

        // debug
        if (logging.getLevel() <= 1) {
            buffer.push();
            buffer.translate(this.posX / exportRatio, this.posY / exportRatio);
            buffer.noFill();
            buffer.stroke(10)
            buffer.rect(0, 0, this.custom_width / exportRatio, this.custom_height / exportRatio);
            buffer.pop();
        }
    }
}