class Shape{constructor(t){this.origin=t.origin,this.radioMin=t.radioMin,this.radioMax=t.radioMax,this.radioDistortion=t.radioDistortion,this.polygonCount=t.polygonCount,this.margin=t.margin,this.curveTightness=t.curveTightness,this.solidstrokeWeight=t.solidstrokeWeight,this.solidColorStroke=t.solidColorStroke,this.opacityFillValue=t.opacityFillValue,this.opacityStrokeValue=t.opacityStrokeValue,this.blur=t.blur,this.buffer=createGraphics(rescaling_width,rescaling_height),this.shadowBuffer=createGraphics(rescaling_width,rescaling_height),this.noiseBuffer=createGraphics(rescaling_width,rescaling_height),t.solidColorArea instanceof Array?(this.colorIndex=Math.round(getRandomFromInterval(0,t.solidColorArea.length-1)),this.solidColorArea=color(t.solidColorArea[this.colorIndex]),this.noiseColorArea=color(t.noiseColorArea[this.colorIndex]),this.texture=t.texturePalette[this.colorIndex]):(this.solidColorArea=t.solidColorArea,this.noiseColorArea=t.noiseColorArea,this.texture=t.texturePalette[3]),this.solidColorStroke=color(red(this.solidColorStroke),green(this.solidColorStroke),blue(this.solidColorStroke),this.opacityStrokeValue),this.solidColorArea=color(red(this.solidColorArea),green(this.solidColorArea),blue(this.solidColorArea),this.opacityFillValue),this.polygons=[],this.rightUp=createVector(this.origin.x+getRandomFromInterval(this.radioMin,this.radioMax),this.origin.y+getRandomFromInterval(-this.radioMin,-this.radioMax)),this.rightDown=createVector(this.origin.x+getRandomFromInterval(this.radioMin,this.radioMax),this.origin.y+getRandomFromInterval(this.radioMin,this.radioMax)),this.leftDown=createVector(this.origin.x+getRandomFromInterval(-this.radioMin,-this.radioMax),this.origin.y+getRandomFromInterval(this.radioMin,this.radioMax)),this.leftUp=createVector(this.origin.x+getRandomFromInterval(-this.radioMin,-this.radioMax),this.origin.y+getRandomFromInterval(-this.radioMin,-this.radioMax));for(var i=0;i<this.polygonCount;i++)this.polygons.push({rightUp:createVector(this.rightUp.x+getRandomFromInterval(0,this.radioDistortion),this.rightUp.y+getRandomFromInterval(0,this.radioDistortion)),rightDown:createVector(this.rightDown.x+getRandomFromInterval(0,this.radioDistortion),this.rightDown.y+getRandomFromInterval(0,this.radioDistortion)),leftDown:createVector(this.leftDown.x+getRandomFromInterval(0,this.radioDistortion),this.leftDown.y+getRandomFromInterval(0,this.radioDistortion)),leftUp:createVector(this.leftUp.x+getRandomFromInterval(0,this.radioDistortion),this.leftUp.y+getRandomFromInterval(0,this.radioDistortion))});this.define_shadow_orientation()}define_shadow_orientation(){duftOrigin.x-this.origin.x>0?duftOrigin.y-this.origin.y>0?this.shadowOrientation="up_left":this.shadowOrientation="bottom_left":duftOrigin.y-this.origin.y>0?this.shadowOrientation="up_right":this.shadowOrientation="bottom_right"}draw(){this.buffer.push(),void 0!==this.blur&&(this.buffer.drawingContext.filter=`blur(${this.blur*blurFeature}px)`),this.buffer.curveTightness(this.curveTightness);var t=0;for(var i of this.polygons)this.buffer.stroke(this.solidColorStroke),this.buffer.fill(this.solidColorArea),this.buffer.strokeWeight(this.solidstrokeWeight/exportRatio),this.buffer.beginShape(),this.buffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.buffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio),this.buffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio),this.buffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio),this.buffer.endShape(CLOSE),t==this.polygons.length-1&&(this.shadowBuffer.push(),this.shadowBuffer.curveTightness(this.curveTightness),this.shadowBuffer.noFill(),this.shadowBuffer.stroke(this.solidColorStroke),this.shadowBuffer.strokeWeight(1*this.solidstrokeWeight/exportRatio),this.shadowBuffer.beginShape(),"bottom_left"==this.shadowOrientation?(this.shadowBuffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio),this.shadowBuffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio),this.shadowBuffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio),this.shadowBuffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio),this.shadowBuffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio)):"bottom_right"==this.shadowOrientation?(this.shadowBuffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.shadowBuffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.shadowBuffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio),this.shadowBuffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio),this.shadowBuffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio)):"up_left"==this.shadowOrientation?(this.shadowBuffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.shadowBuffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.shadowBuffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio),this.shadowBuffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio),this.shadowBuffer.curveVertex(i.leftDown.x/exportRatio,i.leftDown.y/exportRatio)):(this.shadowBuffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio),this.shadowBuffer.curveVertex(i.leftUp.x/exportRatio,i.leftUp.y/exportRatio),this.shadowBuffer.curveVertex(i.rightUp.x/exportRatio,i.rightUp.y/exportRatio),this.shadowBuffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio),this.shadowBuffer.curveVertex(i.rightDown.x/exportRatio,i.rightDown.y/exportRatio)),this.shadowBuffer.endShape(),this.shadowBuffer.pop()),t=1;this.buffer.drawingContext.filter="none",this.buffer.pop(),this.draw_debug()}draw_debug(){5==MODE&&(this.buffer.push(),this.buffer.strokeWeight(1/exportRatio),this.buffer.stroke("yellow"),this.buffer.point(this.rightUp.x/exportRatio,this.rightUp.y/exportRatio),this.buffer.point(this.rightDown.x/exportRatio,this.rightDown.y/exportRatio),this.buffer.point(this.leftDown.x/exportRatio,this.leftDown.y/exportRatio),this.buffer.point(this.leftUp.x/exportRatio,this.leftUp.y/exportRatio),this.buffer.pop(),this.buffer.push(),this.buffer.noFill(),this.buffer.stroke("orange"),this.buffer.strokeWeight(1/exportRatio),this.buffer.rect(this.margin/exportRatio,this.margin/exportRatio,(exportPaper.width-2*this.margin)/exportRatio,(exportPaper.height-2*this.margin)/exportRatio),this.buffer.pop(),this.buffer.push(),this.buffer.stroke("blue"),this.buffer.strokeWeight(30/exportRatio),this.buffer.point(this.origin.x/exportRatio,this.origin.y/exportRatio),this.buffer.pop())}}class Shapes{constructor(t){this.shapeCount=t.shapeCount,this.radioMin=t.radioMin,this.radioMax=t.radioMax,this.radioDistortion=t.radioDistortion,this.polygonCount=t.polygonCount,this.margin=t.margin,this.curveTightness=t.curveTightness,this.solidstrokeWeight=t.solidstrokeWeight,this.solidColorStroke=t.solidColorStroke,this.solidColorArea=t.solidColorArea,this.noiseColorArea=t.noiseColorArea,this.opacityFillValue=t.opacityFillValue,this.opacityStrokeValue=t.opacityStrokeValue,this.origin=t.origin,this.duft=t.duft,this.duftOrbit=t.duftOrbit,this.duftArea=t.duftArea,this.duftCounty=t.duftCounty,this.blur=t.blur,this.buffer=createGraphics(rescaling_width,rescaling_height),this.texturePalette=[textureA,textureB,textureC,textureDuft],this.shapes=[];for(var i=0;i<this.shapeCount;i++){if(1==this.duftOrbit)if("x-axis"==getRandomFromList(["x-axis","y-axis"]))var o=getRandomFromInterval(duftOrigin.x-duftOrbit,duftOrigin.x+duftOrbit),e=getRandomFromList([duftOrigin.y-duftOrbit,duftOrigin.y+duftOrbit]);else o=getRandomFromList([duftOrigin.x-duftOrbit,duftOrigin.x+duftOrbit]),e=getRandomFromInterval(duftOrigin.y-duftOrbit,duftOrigin.y+duftOrbit);1==this.duftArea&&(o=getRandomFromInterval(duftArea.position.x,duftArea.position.x+duftArea.width),e=getRandomFromInterval(duftArea.position.y,duftArea.position.y+duftArea.height)),1==this.duftCounty&&(o=getRandomFromInterval(duftCounty.position.x,duftCounty.position.x+duftCounty.width),e=getRandomFromInterval(duftCounty.position.y,duftCounty.position.y+duftCounty.height)),1!=this.duft&&(this.origin=createVector(constrain(o,BACKGROUNDMARGIN+this.radioMax,exportPaper.width-BACKGROUNDMARGIN-this.radioMax),constrain(e,BACKGROUNDMARGIN+this.radioMax,exportPaper.height-BACKGROUNDMARGIN-this.radioMax)));var r={origin:this.origin,radioMin:this.radioMin,radioMax:this.radioMax,radioDistortion:this.radioDistortion,polygonCount:this.polygonCount,margin:this.margin,curveTightness:this.curveTightness,solidstrokeWeight:this.solidstrokeWeight,solidColorStroke:this.solidColorStroke,solidColorArea:this.solidColorArea,noiseColorArea:this.noiseColorArea,texturePalette:this.texturePalette,opacityFillValue:this.opacityFillValue,opacityStrokeValue:this.opacityStrokeValue,blur:this.blur};this.shapes.push(new Shape(r))}this.drawAll()}drawAll(){for(var t of(this.buffer.clear(),this.buffer.scale(scaleRatio),this.shapes))if(t.draw(),this.buffer.image(t.buffer,0,0,t.buffer.width,t.buffer.height),this.buffer.push(),this.buffer.drawingContext.filter=`blur(${1.5*blurFeature}px)`,this.buffer.image(t.shadowBuffer,0,0,t.shadowBuffer.width,t.shadowBuffer.height),this.buffer.drawingContext.filter="none",this.buffer.pop(),this.bufferMasked=maskBuffers(t.texture.buffer,t.buffer),this.buffer.drawingContext.filter=`blur(${.5*blurFeature}px)`,this.buffer.image(this.bufferMasked,0,0,this.bufferMasked.width,this.bufferMasked.height),this.buffer.drawingContext.filter="none",fxrand()>.75){var i=t.polygons[this.polygonCount-1],o=getRandomFromList(["up to the right","up to the left","right to up","right to down","down to the right","up to the left","left to up","left to down"]);"up to the right"==o?line=new Lines(i.rightUp,i.leftUp,"right"):"up to the left"==o?line=new Lines(i.rightUp,i.leftUp,"left"):"right to up"==o?line=new Lines(i.rightDown,i.rightUp,"up"):"right to down"==o?line=new Lines(i.rightDown,i.rightUp,"down"):"down to the right"==o?line=new Lines(i.rightDown,i.leftDown,"right"):"up to the left"==o?line=new Lines(i.rightDown,i.leftDown,"left"):"left to up"==o?line=new Lines(i.leftDown,i.leftUp,"up"):"left to down"==o&&(line=new Lines(i.leftDown,i.leftUp,"down")),this.buffer.image(line.buffer,0,0)}}}