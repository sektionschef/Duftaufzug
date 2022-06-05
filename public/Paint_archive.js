class Paint {
    constructor(custom_width, custom_height, posX, posY, color) {
        this.width = custom_width;
        this.height = custom_height;
        this.posX = posX;
        this.posY = posY;
        this.border = 35;  // 25 frame for the image - 5-35

        this.area = this.width * this.height;
        this.buffer = createGraphics(this.width + 2 * this.border, this.height + 2 * this.border);
        this.color_master = color;

        this.brush_size = 20;  // area of stroke
        this.counter_max = 100;

        this.primaryStrokeWeight = 2;
        this.secondaryStrokeWeight = 1;

        this.brushTightness = 1 // 0-5
        this.counter = 0;

        this.area_fully_painted = false;

        // create background
        // this.buffer.background(this.color_master);

        // this.create_dotty();
    }

    // create_dotty() {
    //     this.dotty = createGraphics(this.width, this.height);
    //     let loop_count = constrain(this.area / 250, 50, 600)
    //     let size_point = 1;

    //     this.dotty.push();
    //     this.dotty.noStroke();
    //     this.dotty.strokeWeight(size_point);
    //     for (var i = 0; i < loop_count; i++) {
    //         this.dotty.stroke(brightenColor(distortColor(color(this.color_master), 10), 70));
    //         this.dotty.point(getRandomFromInterval(0, this.dotty.width), getRandomFromInterval(0, this.dotty.height));

    //         this.dotty.stroke(brightenColor(color(INSIDE_COLOR), 20));
    //         this.dotty.point(getRandomFromInterval(0, this.dotty.width), getRandomFromInterval(0, this.dotty.height));
    //     }

    //     this.dotty.pop();
    // }

    show(on_top_layer) {

        // relative to area, for area of 20000 use first layer 20 loops and second one 80.
        this.loop_1 = constrain(this.area / 1000, 100, 800)
        this.loop_2 = constrain(this.area / 250, 50, 400)


        this.paint_layer(this.loop_1, this.primaryStrokeWeight, 2);
        this.paint_layer(this.loop_2, this.secondaryStrokeWeight, 10);

        if (typeof (on_top_layer) != "undefined") {
            this.buffer.image(on_top_layer, 0, 0, this.buffer.width, this.buffer.height);
        }

        if (this.counter == this.counter_max) {
            this.area_fully_painted = true;
        }
    }

    paint_layer(brush_loops, stroke_size, color_noise) {
        this.brush_loops = brush_loops;
        this.stroke_size = stroke_size;
        this.color_noise = color_noise;
        this.brightness_noise = 30;
        this.opacity_noise = 250;  // 100
        // this.opacity_value = "38";
        // this.opacity_value = "ad";

        if (this.counter <= this.counter_max) {
            this.color = lessenColor(brightenColor(distortColor(color(this.color_master), this.color_noise), this.brightness_noise), this.opacity_noise);

            this.counter += 1;

            this.buffer.strokeWeight(this.stroke_size);
            this.buffer.stroke(this.color);
            this.buffer.noFill();

            let begin_x = getRandomFromInterval(this.border, this.width + this.border)
            let begin_y = getRandomFromInterval(this.border, this.height + this.border)

            this.buffer.curveTightness(this.brushTightness);
            this.buffer.beginShape();
            this.buffer.curveVertex(begin_x, begin_y);
            this.buffer.curveVertex(begin_x, begin_y);
            this.current_x = begin_x;
            this.current_y = begin_y;
            for (var i = 0; i < this.brush_loops; i++) {
                // some distortion at the edges
                if (fxrand() < 0.8) {
                    this.current_x = constrain(this.current_x + getRandomFromInterval(-this.brush_size, this.brush_size), this.border, this.width + this.border);
                    this.current_y = constrain(this.current_y + getRandomFromInterval(-this.brush_size, this.brush_size), this.border, this.height + this.border);
                } else {
                    this.current_x = constrain(this.current_x + getRandomFromInterval(-this.brush_size, this.brush_size), 0, this.width + this.border * 2);
                    this.current_y = constrain(this.current_y + getRandomFromInterval(-this.brush_size, this.brush_size), 0, this.height + this.border * 2);
                }
                // this.current_y += getRandomFromInterval(-this.brush_size, this.brush_size);
                this.buffer.curveVertex(this.current_x, this.current_y)
            }
            this.buffer.curveVertex(this.current_x, this.current_y)
            this.buffer.endShape();
        }

        // this.buffer.image(this.dotty, this.border, this.border, this.dotty.width, this.dotty.height);
    }
}