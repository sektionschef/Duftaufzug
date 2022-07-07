const MODE=1;NOISESEED=hashFnv32a(fxhash);let scaleRatio,exportRatio,buffer,canvas,rescaling_width,rescaling_height,exportPaper={width:4e3,height:4e3},BACKGROUNDMARGIN=200,MARGINDUFTORIGIN=1500,DUFTRADIOMIN=300,DUFTRADIOMAX=350,LIGHTRADIOMIN=200,LIGHTRADIOMAX=400,AMBIENTRADIOMIN=300,AMBIENTRADIOMAX=600;defineColorPalettes();let duftArea={},duftCounty={},PALETTE=getRandomFromList(["Red","Greyscale","Blue","Blueey","Paradise","Hund","Marienkäfer"]),CountFeatureMin=.7,CountFeatureMax=1.3,CountFeature=Math.round(100*getRandomFromInterval(CountFeatureMin,CountFeatureMax))/100,CountFeatureLabel=label_feature(CountFeature,CountFeatureMin,CountFeatureMax),grainFeatureMin=.8,grainFeatureMax=1.3,grainFeature=Math.round(100*getRandomFromInterval(grainFeatureMin,grainFeatureMax))/100,grainFeatureLabel=label_feature(grainFeature,grainFeatureMin,grainFeatureMax);function preload(){}function setup(){noiseSeed(NOISESEED),randomSeed(NOISESEED),exportRatio/=pixelDensity(),scaleDynamically(),createLayers(),defineColorPalettes(),defineAllAreas(),defineAllElements(),createAllElements()}function draw(){buffer.clear(),buffer.scale(scaleRatio),buffer.background(color(colors[PALETTE].background)),buffer.push(),buffer.drawingContext.filter="blur(0.6px)",buffer.image(wallTexture.buffer,0,0),buffer.drawingContext.filter="none",buffer.pop(),buffer.push(),buffer.drawingContext.filter="blur(0.1px)",buffer.image(ambients.buffer,0,0),buffer.drawingContext.filter="none",buffer.pop(),buffer.push(),buffer.drawingContext.filter="blur(0.1px)",buffer.image(lights.buffer,0,0),buffer.drawingContext.filter="none",buffer.pop(),buffer.push(),buffer.image(highlights.buffer,0,0),buffer.pop(),buffer.push(),buffer.image(duft.buffer,0,0),buffer.pop(),image(buffer,-width/2,-height/2),noLoop(),fxpreview()}function createLayers(){canvas=createCanvas(rescaling_width,rescaling_height,WEBGL),buffer=createGraphics(rescaling_width,rescaling_height),lightShapeBuffer=createGraphics(rescaling_width,rescaling_height),lightTextureBuffer=createGraphics(rescaling_width,rescaling_height),highlightShapeBuffer=createGraphics(rescaling_width,rescaling_height),highlightTextureBuffer=createGraphics(rescaling_width,rescaling_height),duftTextureBuffer=createGraphics(rescaling_width,rescaling_height),duftShapeBuffer=createGraphics(rescaling_width,rescaling_height),lineBuffer=createGraphics(rescaling_width,rescaling_height)}function defineDuftOrigin(){duftOrigin=createVector(getRandomFromInterval(0+MARGINDUFTORIGIN,exportPaper.width-MARGINDUFTORIGIN),getRandomFromInterval(0+MARGINDUFTORIGIN,exportPaper.height-MARGINDUFTORIGIN))}function defineDuftOrbit(){duftOrbit=(DUFTRADIOMAX-DUFTRADIOMIN)/2+DUFTRADIOMIN}function defineDuftArea(){duftArea.orientation=getRandomFromList(["down","left","up","right"]),"down"==duftArea.orientation?(duftArea.position=createVector(duftOrigin.x-duftOrbit,duftOrigin.y-duftOrbit),duftArea.width=2*duftOrbit,duftArea.height=exportPaper.height-(duftOrigin.y-duftOrbit)):"left"==duftArea.orientation?(duftArea.position=createVector(0,duftOrigin.y-duftOrbit),duftArea.width=duftOrigin.x+duftOrbit,duftArea.height=2*duftOrbit):"up"==duftArea.orientation?(duftArea.position=createVector(duftOrigin.x-duftOrbit,0),duftArea.width=2*duftOrbit,duftArea.height=duftOrigin.y+duftOrbit):"right"==duftArea.orientation&&(duftArea.position=createVector(duftOrigin.x-duftOrbit,duftOrigin.y-duftOrbit),duftArea.width=exportPaper.width-(duftOrigin.x-duftOrbit),duftArea.height=2*duftOrbit),duftArea.size=duftArea.width*duftArea.height}function defineDuftCounty(){duftExpander=2*duftOrbit,"down"==duftArea.orientation?(duftCounty.position=createVector(duftArea.position.x-duftExpander,duftArea.position.y-duftExpander/4),duftCounty.width=duftArea.width+2*duftExpander,duftCounty.height=duftArea.height):"left"==duftArea.orientation?(duftCounty.position=createVector(duftArea.position.x,duftArea.position.y-duftExpander),duftCounty.width=duftArea.width+duftExpander/4,duftCounty.height=duftArea.height+2*duftExpander):"up"==duftArea.orientation?(duftCounty.position=createVector(duftArea.position.x-duftExpander,duftArea.position.y),duftCounty.width=duftArea.width+2*duftExpander,duftCounty.height=duftArea.height+duftExpander/4):"right"==duftArea.orientation&&(duftCounty.position=createVector(duftArea.position.x-duftExpander/4,duftArea.position.y-duftExpander),duftCounty.width=duftArea.width,duftCounty.height=duftArea.height+2*duftExpander)}function defineAllAreas(){defineDuftOrigin(),defineDuftOrbit(),defineDuftArea(),defineDuftCounty()}function createAllElements(){wallTexture=new Pixies(wallTextureData),textureA=new Pixies(TextureAData),textureB=new Pixies(TextureBData),textureC=new Pixies(TextureCData),textureDuft=new Pixies(TextureDuftData),ambients=new Shapes(ambientData),lights=new Shapes(lightData),highlights=new Shapes(highlightData),duft=new Shapes(duftData)}function defineAllElements(){wallTextureData={inc:.004,gain:-255,colorBackground:void 0,colorForeground:color(colors[PALETTE].backgroundnoise),distortion:.2,density:7,margin:BACKGROUNDMARGIN},TextureAData={inc:.9,gain:100*grainFeature,colorBackground:void 0,colorForeground:color(colors[PALETTE].falllAllNoise[0]),distortion:.9,density:5,margin:0},TextureBData={inc:9e-4,gain:100*grainFeature,colorBackground:void 0,colorForeground:color(colors[PALETTE].falllAllNoise[1]),distortion:.9,density:5,margin:0},TextureCData={inc:.005,gain:100*grainFeature,colorBackground:void 0,colorForeground:color(colors[PALETTE].falllAllNoise[2]),distortion:.9,density:5,margin:0},TextureDuftData={inc:.009,gain:100*grainFeature,colorBackground:void 0,colorForeground:color(colors[PALETTE].duftNoise),distortion:.9,density:5,margin:0},ambientData={shapeCount:duftArea.size/11e4*CountFeature,radioMin:AMBIENTRADIOMIN,radioMax:AMBIENTRADIOMAX,radioDistortion:200,polygonCount:2,margin:0,curveTightness:1,noColorStroke:!1,solidstrokeWeight:3,solidColorStroke:color(colors[PALETTE].duft),solidColorArea:colors[PALETTE].fillAll,noiseColorArea:colors[PALETTE].falllAllNoise,opacityFillValue:150,opacityStrokeValue:150,duftOrbit:!1,duftArea:!1,duftCounty:!0,blur:3},lightData={shapeCount:duftArea.size/1e5*CountFeature,radioMin:LIGHTRADIOMIN,radioMax:LIGHTRADIOMAX,radioDistortion:150,polygonCount:2,margin:500,curveTightness:1,noColorStroke:!1,solidstrokeWeight:3,solidColorStroke:color(colors[PALETTE].duft),solidColorArea:colors[PALETTE].fillAll,noiseColorArea:colors[PALETTE].falllAllNoise,opacityFillValue:150,opacityStrokeValue:150,duftOrbit:!1,duftArea:!0,blur:1.5},highlightData={shapeCount:9*CountFeature,radioMin:50,radioMax:150,radioDistortion:120,polygonCount:2,margin:500,curveTightness:1,noColorStroke:!0,solidstrokeWeight:2,solidColorStroke:color(colors[PALETTE].duft),solidColorArea:colors[PALETTE].fillAll,noiseColorArea:colors[PALETTE].falllAllNoise,duftOrbit:!0,opacityFillValue:150,opacityStrokeValue:150,blur:1},duftData={shapeCount:1,radioMin:DUFTRADIOMIN,radioMax:DUFTRADIOMAX,radioDistortion:180,polygonCount:2,margin:MARGINDUFTORIGIN,curveTightness:1,noColorStroke:!0,solidstrokeWeight:4,solidColorStroke:color(20,5),solidColorArea:color(colors[PALETTE].duft),noiseColorArea:color(colors[PALETTE].duftNoise),opacityFillValue:170,opacityStrokeValue:155,origin:duftOrigin,duft:!0,duftOrbit:!1,duftArea:!1,blur:1.5}}function defineColorPalettes(){colors={Greyscale:{background:"#bbbbbb",backgroundnoise:"#bbbbbb30",fillAll:["#444444","#777777","#cccccc"],falllAllNoise:["#444444","#666666","#cccccc"],duft:"#222222",duftNoise:"#222222"},Red:{background:"#ffb3b0",backgroundnoise:"#ffb3b030",fillAll:["#a6433f","#ff6961","#ffd9d8"],falllAllNoise:["#a6433f","#ff6961","#ffd9d8"],duft:"#5c2523",duftNoise:"#5c2523"},Blue:{background:"#ffffff",backgroundnoise:"#ffffff70",fillAll:["#0000b3","#809fff","#bfcfff"],falllAllNoise:["#0000b3","#809fff","#bfcfff"],duft:"#001f7d",duftNoise:"#001f7d"},Blueey:{background:"#B0C4DE",backgroundnoise:"#B0C4DE30",fillAll:["#034694","#318CE7","#7CB9E8"],falllAllNoise:["#034694","#318CE7","#7CB9E8"],duft:"#041E42",duftNoise:"#041E42"},Paradise:{background:"#dee0e6",backgroundnoise:"#dee0e630",fillAll:["#1ac0c6","#ff6150","#ffa822"],falllAllNoise:["#1ac0c6","#ff6150","#ffa822"],duft:"#134e6f",duftNoise:"#134e6f"},Hund:{background:"#e1f6f7",backgroundnoise:"#e1f6f730",fillAll:["#e74645","#fb7756","#fdfa66"],falllAllNoise:["#e74645","#fb7756","#fdfa66"],duft:"#1ac0c6",duftNoise:"#1ac0c6"},Marienkäfer:{background:"#ffffff",backgroundnoise:"#ffffff30",fillAll:["#2c698d","#bae8e8","#e3f6f5"],falllAllNoise:["#2c698d","#bae8e8","#e3f6f5"],duft:"#272643",duftNoise:"#272643"}}}