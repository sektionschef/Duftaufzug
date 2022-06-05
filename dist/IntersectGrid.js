class IntersectRect{constructor(t,e,i){this.rect1=t,this.rect2=e,this.posXNew,this.widthNew,this.posYNew,this.heightNew,this.rect1.colorObject,this.rect2.colorObject,this.colorObject=i}getColor(){let t=new Set([color1,color2]),e=new Set([this.rect1.colorObject,this.rect2.colorObject]);this.colorIntersect=new Set([...t].filter((t=>!e.has(t)))),this.colorObject=getRandomFromList([...this.colorIntersect])}update(){var t=this.rect1.posX-this.rect1.width/2,e=this.rect2.posX-this.rect2.width/2,i=t+this.rect1.width,s=e+this.rect2.width,h=this.rect1.posY-this.rect1.height/2,r=this.rect2.posY-this.rect2.height/2,o=h+this.rect1.height,c=r+this.rect2.height;e>i||s<t||this.rect2.posY-this.rect2.height/2>this.rect1.posY-this.rect1.height/2+this.rect1.height||this.rect2.posY-this.rect2.height/2+this.rect2.height<this.rect1.posY-this.rect1.height/2||(e<t?(this.widthNew=Math.min(s,i)-t,this.posXNew=t+this.widthNew/2):s>i?(this.widthNew=i-e,this.posXNew=i-this.widthNew/2):(this.widthNew=this.rect2.width,this.posXNew=this.rect2.posX),r<h?(this.heightNew=Math.min(c,o)-h,this.posYNew=h+this.heightNew/2):c>o?(this.heightNew=o-r,this.posYNew=o-this.heightNew/2):(this.heightNew=this.rect2.height,this.posYNew=this.rect2.posY),(this.widthNew<.01*exportPaper.width||this.heightNew<.01*exportPaper.height)&&(logging.debug("The intersection rect is too small to exist."),this.widthNew=void 0,this.heightNew=void 0,this.posXNew=void 0,this.posYNew=void 0))}}class IntersectGrid{constructor(t){void 0===t&&(t={minSize:400,maxSize:2e3,numberRects:5,firstLevelColors:[color(100)],secondLevelColors:[color(30)],lineColor:color(230),padding:200,shadow:!0}),this.minSize=t.minSize,this.maxSize=t.maxSize,this.numberRects=t.numberRects,this.firstLevelColors=t.firstLevelColors,this.secondLevelColors=t.secondLevelColors,this.lineColor=t.lineColor,this.padding=t.padding,this.firstShadow=t.firstShadow,this.rects=[],this.interactionRects=[],this.spheres=[];for(let r=0;r<this.numberRects;r++){var e=Math.round(getRandomFromInterval(this.minSize,this.maxSize)),i=Math.round(getRandomFromInterval(this.minSize,this.maxSize)),s=Math.round(getRandomFromInterval(this.padding+e/2,exportPaper.width-this.padding-e/2)),h=Math.round(getRandomFromInterval(this.padding+i/2,exportPaper.height-this.padding-i/2));this.rects.push({width:e,height:i,posX:s,posY:h,colorObject:getRandomFromList(this.firstLevelColors)}),this.rects[r].paintedArea=this.createPaintbrushAreas(this.rects[r].posX,this.rects[r].posY,this.rects[r].width,this.rects[r].height,this.rects[r].colorObject),fxrand()>.75&&(this.rects[r].lines=new NewLines(t={posX:this.rects[r].posX,posY:this.rects[r].posY,custom_width:this.rects[r].width,custom_height:this.rects[r].height,colorObject:this.lineColor,distance:40,noise:4,strokeSize:6,curveTightness:1,opacityLevel:150})),this.rects[r].spheres=this.createSpheres(this.rects[r].posX,this.rects[r].posY,this.rects[r].width,this.rects[r].height)}this.rects.sort((function(t,e){return e.width*e.height-t.width*t.height})),this.getIntersections(),this.interactionRects.sort((function(t,e){return e.width*e.height-t.width*t.height})),this.update()}getIntersections(){for(let t=0;t<this.rects.length;t++)for(let e=0+t+1;e<this.rects.length;e++)this.interactionRects.push(new IntersectRect(this.rects[t],this.rects[e],getRandomFromList(this.secondLevelColors)))}createPaintbrushAreas(t,e,i,s,h){if("greyscale"!=PALETTE)var r=brightenColor(distortColor(h,6),6);else r=brightenColor(h,6);let o={custom_width:i,custom_height:s,posX:t,posY:e,colorObject:r,orientation:getRandomFromList(["horizontal","vertical"]),brushLength:BRUSHLENGTHANDBREADTH,brushBreadth:BRUSHLENGTHANDBREADTH,sizeStroke:BRUSHSTROKESIZE,numberPaintLayers:NUMBERPAINTLAYERS,overlap:80,brightnessNoise:BRUSHBRIGHTNESSNOISE,colorNoise:BRUSHCOLORNOISE,opacityBoost:0,brushLengthNoise:BRUSHLENGTHNOISE,brushBreadthNoise:BRUSHBREADTHNOISE,brushAngleNoise:BRUSHANGLENOISE,brushFibreSparseness:BRUSHFIBRESPARSENESS,fibreColorNoise:FIBRECOLORNOISE,fibreBrightnessNoise:FIBREBRIGHTNESSNOISE,fibreStrokeSizeNoise:FIBRESTROKESIZENOISE,fibreStartLengthNoise:FIBRESTARTLENGTHNOISE,fibreBreadthNoise:FIBREBREADTHNOISE,fibreRotationNoise:FIBREROTATIONNOISE,fibreOpacityNoiseBase:FIBREOPACITYNOISEBASE,fibreLengthPerlin:FIBRELENGTHPERLIN,fibreOpacityPerlin:FIBREOPACITYPERLIN};return new PaintBrushArea(o)}createSpheres(t,e,i,s){if(1==this.firstShadow)var h=t-i/2+100,r=e-s/2+100,o=color(30,30);else h=t-i/2+50,r=e-s/2+50,o=color(60,30);return new paintedSphere({custom_width:i,custom_height:s,posX:h,posY:r,elementSizeMin:50,elementSizeMax:100,colorObject:o,margin:0,fillColorNoise:30,fillColorOpacityMax:5,noStroke:!0,strokeWeight:2,strokeColorNoise:0,strokeOpacityMax:2,numberQuantisizer:4})}update(){for(let t=0;t<this.interactionRects.length;t++)this.interactionRects[t].update(),void 0!==this.interactionRects[t].widthNew&&(this.interactionRects[t].spheres=this.createSpheres(this.interactionRects[t].posXNew,this.interactionRects[t].posYNew,this.interactionRects[t].widthNew,this.interactionRects[t].heightNew),this.interactionRects[t].paintedArea=this.createPaintbrushAreas(this.interactionRects[t].posXNew,this.interactionRects[t].posYNew,this.interactionRects[t].widthNew,this.interactionRects[t].heightNew,this.interactionRects[t].colorObject))}show(){for(let t=0;t<this.rects.length;t++)logging.getLevel()<=1&&this.showDebug(this.rects[t],color(0,255,0,100)),void 0!==this.rects[t].spheres&&this.rects[t].spheres.show(),this.rects[t].paintedArea.show(),void 0!==this.rects[t].lines&&this.rects[t].lines.show();for(let t=0;t<this.interactionRects.length;t++)void 0!==this.interactionRects[t].spheres&&this.interactionRects[t].spheres.show(),void 0!==this.interactionRects[t].paintedArea&&this.interactionRects[t].paintedArea.show(),logging.getLevel()<=1&&this.showDebug(this.interactionRects[t],color(255,0,0,100))}showDebug(t,e){buffer.push(),buffer.noStroke(),buffer.fill(e),buffer.rectMode(CENTER),void 0!==t.posXNew?(buffer.translate(t.posXNew/exportRatio,t.posYNew/exportRatio),buffer.rect(0,0,t.widthNew/exportRatio,t.heightNew/exportRatio),buffer.stroke(15),buffer.point(0,0)):void 0!==t.posX&&(buffer.translate(t.posX/exportRatio,t.posY/exportRatio),buffer.rect(0,0,t.width/exportRatio,t.height/exportRatio),buffer.stroke(5),buffer.point(0,0)),buffer.pop()}}