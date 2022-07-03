
class Shape {

    constructor(data) {
        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.shadowBuffer = createGraphics(rescaling_width, rescaling_height);
        this.noiseBuffer = createGraphics(rescaling_width, rescaling_height);
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;
        this.polygonCount = data.polygonCount;
        this.margin = data.margin;
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidstrokeWeight = data.solidstrokeWeight;
        this.solidColorStroke = data.solidColorStroke;
        this.opacityStrokeValue = data.opacityStrokeValue;
        this.textureData = data.textureData;  // noch benötigt?

        // console.log(data.texturePalette);

        if (data.solidColorArea instanceof Array) {
            this.colorIndex = Math.round(getRandomFromInterval(0, (data.solidColorArea.length - 1)));
            this.solidColorArea = data.solidColorArea[this.colorIndex];
            this.noiseColorArea = data.noiseColorArea[this.colorIndex];
            this.texture = data.texturePalette[this.colorIndex];
        } else {
            this.solidColorArea = data.solidColorArea;
            this.noiseColorArea = data.noiseColorArea;
            this.texture = data.texturePalette[0];
        }
        // console.log(this.texture);
        this.opacityFillValue = data.opacityFillValue;
        this.blur = data.blur;

        this.origin = data.origin;

        this.solidColorStroke = color(
            red(this.solidColorStroke),
            green(this.solidColorStroke),
            blue(this.solidColorStroke),
            this.opacityStrokeValue
        )

        this.solidColorArea = color(
            red(this.solidColorArea),
            green(this.solidColorArea),
            blue(this.solidColorArea),
            this.opacityFillValue
        )

        this.polygons = [];
        this.rightUp = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));
        this.rightDown = createVector(this.origin.x + getRandomFromInterval(this.radioMin, this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        this.leftDown = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(this.radioMin, this.radioMax));
        this.leftUp = createVector(this.origin.x + getRandomFromInterval(-this.radioMin, -this.radioMax), this.origin.y + getRandomFromInterval(-this.radioMin, -this.radioMax));

        for (var i = 0; i < this.polygonCount; i++) {
            this.polygons.push({
                rightUp: createVector(this.rightUp.x + getRandomFromInterval(0, this.radioDistortion), this.rightUp.y + getRandomFromInterval(0, this.radioDistortion)),
                rightDown: createVector(this.rightDown.x + getRandomFromInterval(0, this.radioDistortion), this.rightDown.y + getRandomFromInterval(0, this.radioDistortion)),
                leftDown: createVector(this.leftDown.x + getRandomFromInterval(0, this.radioDistortion), this.leftDown.y + getRandomFromInterval(0, this.radioDistortion)),
                leftUp: createVector(this.leftUp.x + getRandomFromInterval(0, this.radioDistortion), this.leftUp.y + getRandomFromInterval(0, this.radioDistortion))
            })
        }

        this.textureData.colorForeground = this.noiseColorArea;

        this.define_shadow_orientation()

        if (MODE == 1) {
            // this.texture = new Pixies(this.textureData);
        }
    }


    define_shadow_orientation() {
        if ((duftOrigin.x - this.origin.x) > 0) {
            // console.log("shape is left");
            if ((duftOrigin.y - this.origin.y) > 0) {
                // console.log("shape is up left")
                this.shadowOrientation = "up_left";
            } else {
                // console.log("shape is bottom left")
                this.shadowOrientation = "bottom_left";
            }
        } else {
            // console.log("shape is right");
            if ((duftOrigin.y - this.origin.y) > 0) {
                // console.log("shape is up right")
                this.shadowOrientation = "up_right";
            } else {
                // console.log("shape is bottom right")
                this.shadowOrientation = "bottom_right";
            }
        }
    }

    draw() {
        this.buffer.push();

        if (typeof this.blur != "undefined" && MODE < 5) {
            this.buffer.drawingContext.filter = 'blur(' + this.blur + 'px)';
        }
        this.buffer.curveTightness(this.curveTightness)

        var polygon_index = 0;
        for (var polygon of this.polygons) {

            // shape
            this.buffer.stroke(this.solidColorStroke);
            // if (polygon_index == 0) {

            //     var full_color_ = color(
            //         red(this.solidColorArea),
            //         green(this.solidColorArea),
            //         blue(this.solidColorArea),
            //         // 255,
            //         150,
            //     )
            //     this.buffer.fill(full_color_);
            // } else {
            // }
            this.buffer.fill(this.solidColorArea);
            this.buffer.strokeWeight(this.solidstrokeWeight / exportRatio);
            this.buffer.beginShape();
            this.buffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
            this.buffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
            this.buffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
            this.buffer.endShape(CLOSE);

            // shadow
            if (polygon_index == (this.polygons.length - 1)) {
                this.shadowBuffer.push();
                this.shadowBuffer.curveTightness(this.curveTightness)
                this.shadowBuffer.noFill();
                // this.shadowBuffer.stroke(color(255, 150));
                // this.shadowBuffer.stroke(color(0, 255));
                this.shadowBuffer.stroke(this.solidColorStroke);
                this.shadowBuffer.strokeWeight(3 / exportRatio);
                this.shadowBuffer.beginShape();
                if (this.shadowOrientation == "bottom_left") {
                    this.shadowBuffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
                } else if (this.shadowOrientation == "bottom_right") {
                    this.shadowBuffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
                } else if (this.shadowOrientation == "up_left") {
                    this.shadowBuffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftDown.x / exportRatio, polygon.leftDown.y / exportRatio);
                } else {
                    this.shadowBuffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.leftUp.x / exportRatio, polygon.leftUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightUp.x / exportRatio, polygon.rightUp.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
                    this.shadowBuffer.curveVertex(polygon.rightDown.x / exportRatio, polygon.rightDown.y / exportRatio);
                }
                this.shadowBuffer.endShape();
                this.shadowBuffer.pop();
            }

            polygon_index = + 1;

            if (MODE > 2) {
                break
            }
        }
        this.buffer.drawingContext.filter = 'none';
        this.buffer.pop();


        this.draw_debug();
    }


    draw_debug() {

        if (MODE == 5) {
            this.buffer.push();
            this.buffer.strokeWeight(1 / exportRatio);
            this.buffer.stroke("yellow");
            this.buffer.point(this.rightUp.x / exportRatio, this.rightUp.y / exportRatio);
            this.buffer.point(this.rightDown.x / exportRatio, this.rightDown.y / exportRatio);
            this.buffer.point(this.leftDown.x / exportRatio, this.leftDown.y / exportRatio);
            this.buffer.point(this.leftUp.x / exportRatio, this.leftUp.y / exportRatio);
            this.buffer.pop();

            // margin visible
            this.buffer.push();
            this.buffer.noFill()
            this.buffer.stroke("orange")
            this.buffer.strokeWeight(1 / exportRatio);
            this.buffer.rect(this.margin / exportRatio, this.margin / exportRatio, (exportPaper.width - 2 * this.margin) / exportRatio, (exportPaper.height - 2 * this.margin) / exportRatio);
            this.buffer.pop();

            // debug origin - orbit
            this.buffer.push();
            this.buffer.stroke("blue");
            this.buffer.strokeWeight(30 / exportRatio);
            this.buffer.point(this.origin.x / exportRatio, this.origin.y / exportRatio);
            this.buffer.pop();
        }

    }
}

class Shapes {
    constructor(data) {
        this.buffer = createGraphics(rescaling_width, rescaling_height);
        this.shapeCount = data.shapeCount;
        this.radioMin = data.radioMin;
        this.radioMax = data.radioMax;
        this.radioDistortion = data.radioDistortion;  // misplacement
        this.polygonCount = data.polygonCount;  // how many overlapping polygons to draw
        this.margin = data.margin;  // distance from edge
        this.curveTightness = data.curveTightness;
        this.noColorStroke = data.noColorStroke;
        this.solidColorStroke = data.solidColorStroke;
        this.opacityStrokeValue = data.opacityStrokeValue;
        this.solidstrokeWeight = data.solidstrokeWeight;
        this.solidColorArea = data.solidColorArea;
        this.noiseColorArea = data.noiseColorArea;
        this.opacityFillValue = data.opacityFillValue;
        this.origin = data.origin;
        this.duft = data.duft;
        this.duftOrbit = data.duftOrbit;
        this.duftArea = data.duftArea;
        this.duftCounty = data.duftCounty;
        this.blur = data.blur;
        this.textureData = data.textureData;

        this.shapes = []

        this.textureA = new Pixies(TextureAData);
        this.textureB = new Pixies(TextureBData);
        this.textureC = new Pixies(TextureCData);
        this.texturePalette = [this.textureA, this.textureB, this.textureC];

        for (var i = 0; i < this.shapeCount; i++) {

            // place randomly on the orbit
            if (this.duftOrbit == true) {
                var orient = getRandomFromList(["x-axis", "y-axis"]);

                if (orient == "x-axis") {
                    var posX = getRandomFromInterval((duftOrigin.x - duftOrbit), (duftOrigin.x + duftOrbit))
                    var posY = getRandomFromList([(duftOrigin.y - duftOrbit), (duftOrigin.y + duftOrbit)])
                } else {
                    var posX = getRandomFromList([(duftOrigin.x - duftOrbit), (duftOrigin.x + duftOrbit)])
                    var posY = getRandomFromInterval((duftOrigin.y - duftOrbit), (duftOrigin.y + duftOrbit))
                }
            }

            // place shapes in area between duft and the edge
            if (this.duftArea == true) {

                var posX = getRandomFromInterval(duftArea.position.x, duftArea.position.x + duftArea.width);
                var posY = getRandomFromInterval(duftArea.position.y, duftArea.position.y + duftArea.height);

            }
            if (this.duftCounty == true) {

                var posX = getRandomFromInterval(duftCounty.position.x, duftCounty.position.x + duftCounty.width);
                var posY = getRandomFromInterval(duftCounty.position.y, duftCounty.position.y + duftCounty.height)

            }

            if (this.duft != true) {
                //draw inside of margins, in respect to the shape's size
                this.origin = createVector(
                    constrain(
                        posX,
                        BACKGROUNDMARGIN + this.radioMax,
                        (exportPaper.width - BACKGROUNDMARGIN - this.radioMax)
                    ), constrain(
                        posY,
                        BACKGROUNDMARGIN + this.radioMax,
                        (exportPaper.height - BACKGROUNDMARGIN - this.radioMax)
                    )
                )
            }

            var dataShape = {
                buffer: this.bufferShape,
                origin: this.origin,
                radioMin: this.radioMin,
                radioMax: this.radioMax,
                radioDistortion: this.radioDistortion,
                polygonCount: this.polygonCount,
                opacityValue: this.opacityValue,
                margin: this.margin,
                curveTightness: this.curveTightness,
                noColorStroke: this.noColorStroke,
                solidColorStroke: this.solidColorStroke,
                solidstrokeWeight: this.solidstrokeWeight,
                solidColorArea: this.solidColorArea,
                noiseColorArea: this.noiseColorArea,
                texturePalette: this.texturePalette,
                opacityFillValue: this.opacityFillValue,
                opacityStrokeValue: this.opacityStrokeValue,
                blur: this.blur,
                textureData: this.textureData,
            }

            this.shapes.push(new Shape(dataShape));
        }

        this.drawAll();

    }

    drawAll() {

        this.buffer.clear();
        this.buffer.scale(scaleRatio);

        for (var shape of this.shapes) {
            if (MODE == 1) {
                shape.draw();
                // only shape
                this.buffer.image(shape.buffer, 0, 0, shape.buffer.width, shape.buffer.height);

                // only texture
                // this.buffer.image(shape.texture.buffer, 0, 0, shape.texture.buffer.width, shape.texture.buffer.height);

                // only shadow
                this.buffer.push();
                this.buffer.drawingContext.filter = 'blur(1.5px)';
                this.buffer.image(shape.shadowBuffer, 0, 0, shape.shadowBuffer.width, shape.shadowBuffer.height);
                this.buffer.drawingContext.filter = 'none';
                this.buffer.pop();

                // masked - only the noise is masked, the color comes from the shape
                // own layer
                // this.bufferMasked = maskBuffers(shape.texture.buffer, shape.buffer);

                // texture layers as alternative to shape specific textures
                // var chosen_texture = getRandomFromList([
                //     textureA,
                //     textureB,
                //     textureC,
                // ]);
                // this.buffer.image(shape.texture.buffer, 0, 0, shape.texture.width, shape.texture.height);
                this.bufferMasked = maskBuffers(shape.texture.buffer, shape.buffer);

                this.buffer.drawingContext.filter = 'blur(0.5px)';
                this.buffer.image(this.bufferMasked, 0, 0, this.bufferMasked.width, this.bufferMasked.height);
                this.buffer.drawingContext.filter = 'none';

                // line
                // draw the line
                if (fxrand() > 0.75) {
                    var last_polygon = shape.polygons[(this.polygonCount - 1)]

                    var pick = getRandomFromList([
                        "up to the right",
                        "up to the left",
                        "right to up",
                        "right to down",
                        "down to the right",
                        "up to the left",
                        "left to up",
                        "left to down"
                    ])

                    if (pick == "up to the right") {
                        line = new Lines(last_polygon.rightUp, last_polygon.leftUp, "right");
                    } else if (pick == "up to the left") {
                        line = new Lines(last_polygon.rightUp, last_polygon.leftUp, "left");
                    } else if (pick == "right to up") {
                        line = new Lines(last_polygon.rightDown, last_polygon.rightUp, "up");
                    } else if (pick == "right to down") {
                        line = new Lines(last_polygon.rightDown, last_polygon.rightUp, "down");
                    } else if (pick == "down to the right") {
                        line = new Lines(last_polygon.rightDown, last_polygon.leftDown, "right");
                    } else if (pick == "up to the left") {
                        line = new Lines(last_polygon.rightDown, last_polygon.leftDown, "left");
                    } else if (pick == "left to up") {
                        line = new Lines(last_polygon.leftDown, last_polygon.leftUp, "up");
                    } else if (pick == "left to down") {
                        line = new Lines(last_polygon.leftDown, last_polygon.leftUp, "down");
                    }

                    this.buffer.image(line.buffer, 0, 0);

                }

            } else {
                shape.draw();
            }
        }
    }
}