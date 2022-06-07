
function draw_shape() {

    let radio = 450;
    let radioDistortion = 200;
    let polygonCount = 30;
    let opacityValue = 9;

    var origin = createVector(getRandomFromInterval(0, exportPaper.width), getRandomFromInterval(0, exportPaper.height));
    buffer.push();
    buffer.strokeWeight(4);
    buffer.point(origin.x / exportRatio, origin.y / exportRatio);
    buffer.pop();

    var rightUp = createVector(origin.x + getRandomFromInterval(0, radio), origin.y + getRandomFromInterval(0, -radio));
    var rightDown = createVector(origin.x + getRandomFromInterval(0, radio), origin.y + getRandomFromInterval(0, radio));
    var leftDown = createVector(origin.x + getRandomFromInterval(0, -radio), origin.y + getRandomFromInterval(0, radio));
    var leftUp = createVector(origin.x + getRandomFromInterval(0, -radio), origin.y + getRandomFromInterval(0, -radio));

    buffer.push();
    buffer.strokeWeight(2);
    buffer.point(rightUp.x / exportRatio, rightUp.y / exportRatio);
    buffer.point(rightDown.x / exportRatio, rightDown.y / exportRatio);
    buffer.point(leftDown.x / exportRatio, leftDown.y / exportRatio);
    buffer.point(leftUp.x / exportRatio, leftUp.y / exportRatio);
    buffer.pop();


    buffer.push();
    buffer.curveTightness(-3)

    // buffer.noStroke();
    buffer.stroke(color(130, opacityValue));

    // buffer.noFill();
    buffer.fill(color(200, opacityValue));

    for (var i = 0; i < polygonCount; i++) {
        buffer.beginShape();
        buffer.curveVertex((rightUp.x + getRandomFromInterval(0, radioDistortion)) / exportRatio, (rightUp.y + getRandomFromInterval(0, radioDistortion)) / exportRatio);
        buffer.curveVertex((rightDown.x + getRandomFromInterval(0, radioDistortion)) / exportRatio, (rightDown.y + getRandomFromInterval(0, radioDistortion)) / exportRatio);
        buffer.curveVertex((leftDown.x + getRandomFromInterval(0, radioDistortion)) / exportRatio, (leftDown.y + getRandomFromInterval(0, radioDistortion)) / exportRatio);
        buffer.curveVertex((leftUp.x + getRandomFromInterval(0, radioDistortion)) / exportRatio, (leftUp.y + getRandomFromInterval(0, radioDistortion)) / exportRatio);
        buffer.endShape(CLOSE);
    }
    buffer.pop();


}