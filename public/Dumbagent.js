class DumbAgent {
    constructor(data) {
        if (typeof data === 'undefined') {
            data = {
                posXImage: 0,
                posYImage: 0,
                customWidth: exportPaper.width,
                customHeight: exportPaper.height,
                colorObject: color(100, 100, 100),
                stepSize: 10,  // 10 is hero
                agentSize: 1,
                opacityLine: 10,
                opacityPoint: 150,
                lineLength: 15,
                loopSize: 10000,
                numberAgents: 5,
            }
        }
        this.posXImage = data.posXImage;
        this.posYImage = data.posYImage;
        this.customWidth = data.customWidth;
        this.customHeight = data.customHeight;
        this.colorObject = data.colorObject;
        this.stepSize = data.stepSize;
        this.agentSize = data.agentSize;
        this.opacityLine = data.opacityLine;
        this.opacityPoint = data.opacityPoint;
        this.lineLength = data.lineLength;
        this.loopSize = data.loopSize;
        this.numberAgents = data.numberAgents;

        this.colorLine = color(red(this.colorObject), green(this.colorObject), blue(this.colorObject), this.opacityLine);
        this.colorPoint = color(red(this.colorObject), green(this.colorObject), blue(this.colorObject), this.opacityPoint);

        // this.colorLine.setAlpha(this.opacityLine);
        // this.colorPoint.setAlpha(this.opacityPoint);

        this.posX = getRandomFromInterval(0, this.customWidth / exportRatio);
        this.posY = getRandomFromInterval(0, this.customHeight / exportRatio);
        this.complete = false;
    }

    show() {


        for (var v = 0; v < this.numberAgents; v++) {
            for (var i = 0; i < this.loopSize; i++) {

                // let angle = getRandomFromInterval(PI / 2, PI);
                // let angle = getRandomFromList([PI / 2, PI / 4, PI]);
                let angle = i % PI;

                let stepSizeTemp = getRandomFromInterval(this.stepSize / exportRatio / 2, this.stepSize / exportRatio);
                let directive = getRandomFromList([
                    "up",
                    "up-right",
                    "right",
                    "right-down",
                    "down",
                    "down-left",
                    "left",
                    "left-up"
                ]);

                if (directive == "up") {
                    this.posY -= stepSizeTemp;
                } else if (directive == "up-right") {
                    this.posX += stepSizeTemp;
                    this.posY -= stepSizeTemp;
                } else if (directive == "right") {
                    this.posX += stepSizeTemp;
                } else if (directive == "right-down") {
                    this.posX += stepSizeTemp;
                    this.posY += stepSizeTemp;
                } else if (directive == "down") {
                    this.posY += stepSizeTemp;
                } else if (directive == "down-left") {
                    this.posX -= stepSizeTemp;
                    this.posY += stepSizeTemp;
                } else if (directive == "left") {
                    this.posX -= stepSizeTemp;
                } else if (directive == "left-up") {
                    this.posX -= stepSizeTemp;
                    this.posY -= stepSizeTemp;
                }

                if (this.posX > this.customWidth / exportRatio | this.posX < 0) {
                    this.posX = getRandomFromInterval(0, this.customWidth / exportRatio)
                }
                if (this.posY > this.customHeight / exportRatio | this.posY < 0) {
                    this.posY = getRandomFromInterval(0, this.customHeight / exportRatio)
                }

                buffer.push();

                buffer.translate(this.posX, this.posY);
                buffer.strokeWeight(this.agentSize / exportRatio);
                buffer.stroke(this.colorLine);
                buffer.rotate(angle);
                buffer.line(0, 0, this.lineLength / exportRatio, this.lineLength / exportRatio);

                buffer.stroke(this.colorPoint);
                buffer.point(0, 0);
                buffer.point(this.lineLength / exportRatio, this.lineLength / exportRatio);


                buffer.pop();
            }
        }
        // buffer.push();
        // buffer.noFill();
        // buffer.stroke(20);
        // buffer.rect(0, 0, this.customWidth / exportRatio, this.customHeight / exportRatio);
        // buffer.pop();
    }

}