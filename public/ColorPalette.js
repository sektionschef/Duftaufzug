class ColorPalette {
    constructor() {

        if (PALETTE.includes("color")) {
            this.primaryColorHue = Math.round(getRandomFromInterval(0, 360));
            if (PALETTE.includes("full")) {
                this.primaryColorSaturation = 85 // Math.round(getRandomFromInterval(90, 91));
                this.primaryColorBrightness = 85 // Math.round(getRandomFromInterval(90, 91));
            } else if (PALETTE.includes("weak")) {
                this.primaryColorSaturation = 65 // Math.round(getRandomFromInterval(90, 91));
                this.primaryColorBrightness = 80 // Math.round(getRandomFromInterval(90, 91));
            } else if (PALETTE.includes("dark")) {
                this.primaryColorSaturation = 100 // Math.round(getRandomFromInterval(90, 91));
                this.primaryColorBrightness = 70 // Math.round(getRandomFromInterval(90, 91));
            }

            if (PALETTE.includes("complimentary")) {
                this.secondaryColorHue = this.primaryColorHue - (360 / 2) + 1;
                if (this.secondaryColorHue < 0) {
                    this.secondaryColorHue += 360;
                }
            } else if (PALETTE.includes("triadic")) {
                this.secondaryColorHue = this.primaryColorHue - (360 / 3) + 1;
                if (this.secondaryColorHue < 0) {
                    this.secondaryColorHue += 360;
                }
            }


            colorMode(HSB);
            this.primaryColor_ = color(this.primaryColorHue, this.primaryColorSaturation, this.primaryColorBrightness);
            this.secondaryColor_ = color(this.secondaryColorHue, this.primaryColorSaturation, this.primaryColorBrightness);
            colorMode(RGB);
        } else if (PALETTE.includes("greyscale")) {
            this.primaryColorHue = 0;
            this.primaryColorSaturation = 0;
            this.primaryColorBrightness = Math.round(getRandomFromInterval(20, 40));;

            this.secondaryColorBrightness = Math.abs(this.primaryColorBrightness - 100);

            colorMode(HSB);
            this.primaryColor_ = color(this.primaryColorHue, this.primaryColorSaturation, this.primaryColorBrightness);
            this.secondaryColor_ = color(this.primaryColorHue, this.primaryColorSaturation, this.secondaryColorBrightness);
        }
        colorMode(RGB);
        this.primaryColor = color(red(this.primaryColor_), green(this.primaryColor_), blue(this.primaryColor_));
        this.secondaryColor = color(red(this.secondaryColor_), green(this.secondaryColor_), blue(this.secondaryColor_));
    }

    showDebug() {

        logging.debug("primary color:")
        logging.debug(this.primaryColor);
        logging.debug("secondary color:")
        logging.debug(this.secondaryColor);

        push();
        translate(-200, 0);
        fill(this.primaryColor);
        noStroke();
        rect(0, 0, 200, 200);
        pop();

        push();
        translate(0, 0);
        fill(this.secondaryColor);
        noStroke();
        rect(0, 0, 200, 200);
        pop();
    }
}