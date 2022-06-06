
function draw_shape() {

    let radio = 450;

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
    buffer.noFill();
    buffer.beginShape();
    // buffer.curveVertex(84, 91);
    // buffer.curveVertex(68, 19);
    // buffer.curveVertex(21, 17);
    // buffer.curveVertex(32, 91);

    buffer.curveVertex(rightUp.x / exportRatio, rightUp.y / exportRatio);
    buffer.curveVertex(rightDown.x / exportRatio, rightDown.y / exportRatio);
    buffer.curveVertex(leftDown.x / exportRatio, leftDown.y / exportRatio);
    buffer.curveVertex(leftUp.x / exportRatio, leftUp.y / exportRatio);
    buffer.endShape(CLOSE);
    buffer.pop();

    // console.log("aoiasdfaf")
}