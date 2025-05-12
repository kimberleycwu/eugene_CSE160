// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float; 
  attribute vec4 a_Position; 
  attribute vec2 a_UV; 
  varying vec2 v_UV;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix; 
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position =  u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
    v_UV = a_UV;
  }`;
//
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV; 
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0; 
  uniform sampler2D u_Sampler1; 
  uniform sampler2D u_Sampler2; 
  uniform int u_whichTexture; 
  void main() {
    if(u_whichTexture == -2){
      gl_FragColor = u_FragColor;
    } else if (u_whichTexture == -1) {
     gl_FragColor = vec4(v_UV, 1.0, 1.0);
    } else if (u_whichTexture == 0 ) {
    gl_FragColor = texture2D(u_Sampler0, v_UV);
    } else if (u_whichTexture == 1 ) {
    gl_FragColor = texture2D(u_Sampler1, v_UV);
    } else if (u_whichTexture == 2 ) {
    gl_FragColor = texture2D(u_Sampler2, v_UV);
    } else {
      gl_FragColor = vec4(1,.2,.2,1); 
    }
  }`;

let canvas;
let gl;
let a_Position;
let a_UV
let u_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;

let t_XBackBody = 0
let t_YBackBody = 0
let t_body = -.25;
let r_body = 0;
let r_necky = 20; 
let r_neckz = 0; 
let r_mouth = 0; 
let r_frontThigh = 0;
let r_frontShin = 0;
let r_frontFoot = 20;
let r_backThigh = -20;
let r_backShin = -20;  
let r_backFoot = 0; 
let r_tailAngle = 0;
let r_tail =0
let g_moveAnimation = false; 
let g_tailAnimation = false; 

let meat1c = 0;
let meat2c = 0;
let meat3c = 0;
let meatHeld = 0;
let indicator = 0; 
let satisfied = 0;
 
//let v1x = 1.0, v1y = 0.0, v2x = 0.0, v2y = 1.0;

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

}

function connectVariablesToGLSL() {
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to initialize shaders.');
    return;
  }

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0){
    console.log("failed to get location of a_Pos");
    return;
  }
  a_UV = gl.getAttribLocation(gl.program, 'a_UV'); 
  if (a_UV < 0){
    console.log("failed to get location of a_UV");
    return;
  }
  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if (u_whichTexture < 0 ){
    console.log("failed to get location of u_whichTexture");
  }
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (u_FragColor < 0){
    console.log("failed to get location of u_Frag");
    return;
  }
  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (u_ModelMatrix < 0){
    console.log("failed to get location of u_ModelMatrix");
    return;
  }
  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (u_GlobalRotateMatrix < 0){
    console.log("failed to get location of u_GlobRotMat");
    return;
  }
  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (u_ViewMatrix < 0){
    console.log("failed to get location of u_ViewMat");
    return;
  }
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (u_ProjectionMatrix < 0){
    console.log("failed to get location of u_ProjMat");
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (u_Size < 0){
    console.log("failed to get location of u_Sz");
    return;
  }

  // Get the storage location of u_Sampler
  u_Sampler = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if (!u_Sampler) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }
  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if (!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }
  u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
  if (!u_Sampler2) {
    console.log('Failed to get the storage location of u_Sampler2');
    return false;
  }
  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;
let g_globalAngle = 0; 
let g_yellowAngle = 0;
let g_magentaAngle = 0;
let g_yellowAnimation=false;
let g_magentaAnimation=false;
let g_verticalAngle = 0;

var camera = new Camera();


function initTextures() {
  let image0 = new Image();
  let image1 = new Image();
  let image2 = new Image();

  image0.onload = function() {
    sendImageToTexture(image0, 0);
  };
  image0.src = 'sky.jpg';

  image1.onload = function() {
    sendImageToTexture(image1, 1);
  };
  image1.src = 'floor.jpg';
  
  image2.onload = function() {
    sendImageToTexture(image2, 2);
  };
  image2.src = 'rock.jpg';
}


function sendImageToTexture(image, textureIndex) {
  var texture = gl.createTexture();
  if(!texture){
    console.log("failed to create texture obj");
    return false; 
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);  

  if (textureIndex === 0) {
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(u_Sampler0, 0); // Set u_Sampler0 to use TEXTURE0
  } else if (textureIndex === 1) {
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(u_Sampler1, 1); // Set u_Sampler1 to use TEXTURE1
  } else if (textureIndex === 2) {
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(u_Sampler2, 2); // Set u_Sampler2 to use TEXTURE1
  }

  // Set the texture parameter and load the image
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);

  console.log("finished loading texture " + textureIndex);
}


let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0; 

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  document.onkeydown = keydown;
  initTextures();

  canvas.onmousedown = (ev) => {
    isDragging = true;
    lastMouseX = ev.clientX;
    lastMouseY = ev.clientY;  
  };

  canvas.onmousemove = (ev) => {
    if (isDragging) {
      let deltaX = ev.clientX - lastMouseX;
      let deltaY = ev.clientY - lastMouseY;
  
      camera.yaw += deltaX * 0.5;
      camera.pitch -= deltaY * 0.5;
  

      camera.pitch = Math.max(-89, Math.min(89, camera.pitch));
  
      camera.updateAt();
  
      lastMouseX = ev.clientX;
      lastMouseY = ev.clientY;
  
      renderAllShapes();
    }
  };
  

  canvas.onmouseup = () => {
    isDragging = false;
  };

  canvas.onmouseleave = () => {
    isDragging = false;
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  requestAnimationFrame(tick);
}
var g_startTime = performance.now()/1000.0;
var g_seconds=performance.now()/1000.0-g_startTime;

function tick(){
  g_seconds = performance.now()/1000.0-g_startTime; 
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}
function updateAnimationAngles(){
  if(g_yellowAnimation){
    g_yellowAngle = (45*Math.sin(g_seconds));
  }
  if(g_magentaAnimation){
    g_magentaAngle = (45*Math.sin(3*g_seconds))
  }
}

function keydown(ev){
  if (ev.keyCode == 87) { // W
    camera.moveForward(0.2);
  }
  if (ev.keyCode == 83) { // S
    camera.moveForward(-0.2);
  }
  if (ev.keyCode == 68) { // D
    camera.strafeRight(0.2);
  }
  if (ev.keyCode == 65) { // A
    camera.strafeRight(-0.2);
  } 
  if(ev.keyCode == 81){//Q
    camera.panRight();
  }
  if(ev.keyCode == 69){//E
    camera.panLeft();
  }
  if (ev.keyCode == 90) { 
    camera.moveUp(0.2);
  }
  if (ev.keyCode == 88) { 
    camera.moveUp(-0.2);
  }
  if (ev.keyCode == 70) { // F
    let meatPosition1 = new Vector3([3, -0.6, -2]);
    let dMeat1 = Math.sqrt(
      Math.pow(camera.eye.elements[0] - meatPosition1.elements[0], 2) +
      Math.pow(camera.eye.elements[1] - meatPosition1.elements[1], 2) +
      Math.pow(camera.eye.elements[2] - meatPosition1.elements[2], 2)
    );
    if (dMeat1 < 2.0) {
      meat1c = 1;
      meatHeld += 1; 
    }
    let meatPosition2 = new Vector3([-3,-.6,3.5]);
    let dMeat2 = Math.sqrt(
      Math.pow(camera.eye.elements[0] - meatPosition2.elements[0], 2) +
      Math.pow(camera.eye.elements[1] - meatPosition2.elements[1], 2) +
      Math.pow(camera.eye.elements[2] - meatPosition2.elements[2], 2)
    );
    if (dMeat2 < 2.0) {
      meat2c = 1;
      meatHeld += 1; 
    }
    let meatPosition3 = new Vector3([3,-.6,3.5]);
    let dMeat3 = Math.sqrt(
      Math.pow(camera.eye.elements[0] - meatPosition3.elements[0], 2) +
      Math.pow(camera.eye.elements[1] - meatPosition3.elements[1], 2) +
      Math.pow(camera.eye.elements[2] - meatPosition3.elements[2], 2)
    );
    if (dMeat3 < 2.0) {
      meat3c = 1;
      meatHeld += 1; 
    }
  }
  if (ev.keyCode == 82) { 
  let indicatorPosition = new Vector3([-.01,0,0.4]);
    let dInd = Math.sqrt(
      Math.pow(camera.eye.elements[0] - indicatorPosition.elements[0], 2) +
      Math.pow(camera.eye.elements[1] - indicatorPosition.elements[1], 2) +
      Math.pow(camera.eye.elements[2] - indicatorPosition.elements[2], 2)
    );
    if (dInd < 2.0 ) {
      if(meatHeld == 3){
        indicator = 1;
        meatHeld = 0; 
        satisfied = 1; 
      }
    }
  }
  renderAllShapes();
  //console.log(ev.keyCode);
}



function click(ev) {
  let [x, y] = convertCoordinatesEventToGL(ev);
  let shape;

  if (g_selectedType === POINT) {
    shape = new Point();
  } else if (g_selectedType === TRIANGLE) {
    shape = new Triangle();
    shape.vertex1Offset = [v1x, v1y];
    shape.vertex2Offset = [v2x, v2y];
  } else if (g_selectedType === CIRCLE) {
    shape = new Circle();
    shape.segments = g_selectedSegments;
  }

  shape.position = [x, y];
  shape.color = g_selectedColor.slice();
  shape.size = g_selectedSize;
  renderAllShapes();
}

var g_map=[
  [1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
];
function drawMap(){
  for (x=0; x<32; x++){
    for (y=0; y<32; y++){
      if (x==0 || x== 31 || y==0 || y==31){
        var maze = new Cube();
        maze.color = [0.278, 0.263, 0.251,1];
        maze.textureNum = -2; 
        maze.matrix.translate(0,-.75,0); 
        maze.matrix.scale(.3,.3,.3);
        maze.matrix.translate(x-16, 0, y-16);
        maze.renderfast();
      }
    }
  }
}

function renderAllShapes() {
  var startTime = performance.now();

  var projMat = new Matrix4();
  projMat.setPerspective(50, 1*canvas.width/canvas.height, 1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);
  var viewMat = new Matrix4();
  viewMat.setLookAt(camera.eye.elements[0], camera.eye.elements[1], camera.eye.elements[2],camera.at.elements[0], camera.at.elements[1], camera.at.elements[2], camera.up.elements[0],camera.up.elements[1],camera.up.elements[2])
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);
  var u_globalRotMat = new Matrix4();
  u_globalRotMat.rotate(g_verticalAngle, 1, 0, 0);
  u_globalRotMat.rotate(g_globalAngle, 0, 1, 0);
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, u_globalRotMat.elements);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);

  drawMap();
  var floor = new Cube();
  floor.color = [1.0,0.0,0.0,1.0];
  floor.textureNum = 1; 
  floor.matrix.translate(0, -.75, 0.0);
  floor.matrix.scale(9.5,.001,9.5);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();

  var sky = new Cube();
  sky.color = [1.0,0.0,0.0,1.0];
  sky.textureNum = 0; 
  sky.matrix.scale(50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  var shrineBase = new Cube();
  shrineBase.color = [0.8, 0.737, 0.678,1];
  shrineBase.matrix.translate(-0.20, -.75, -1.5);
  var sb = new Matrix4(shrineBase.matrix);
  shrineBase.matrix.scale(.5,.5,.5)
  shrineBase.render();
  var shrineBaseTop = new Cube();
  shrineBaseTop.color = [0.8, 0.737, 0.678,1];
  shrineBaseTop.matrix = new Matrix4(sb);
  shrineBaseTop.matrix.translate(-.02,.5,-.02);
  shrineBaseTop.matrix.scale(.55,.10,.55)
  shrineBaseTop.render();
  var shrineMiddle = new Cube();
  shrineMiddle.color = [0.612, 0.475, 0.388,1];
  shrineMiddle.matrix.translate(-.07,-.14,-1.37);
  shrineMiddle.matrix.scale(.25,.3,.25);
  shrineMiddle.render(); 
  var shrineRoof = new Cube();
  shrineRoof.color=[0.529, 0.412, 0.337,1];
  shrineRoof.matrix.translate(-.09,.2,-1.27);
  shrineRoof.matrix.rotate(20,1,0,0);
  shrineRoof.matrix.scale(.3,.03,.3);
  shrineRoof.render();
  var shrineRoof1 = new Cube();
  shrineRoof1.color=[0.529, 0.412, 0.337,1];
  shrineRoof1.matrix.translate(-.09,.1,-1.55,1);
  shrineRoof1.matrix.rotate(-20,1,0,0);
  shrineRoof1.matrix.scale(.3,.03,.3);
  shrineRoof1.render();
  var shrinePillar = new Cube();
  shrinePillar.color=[0.529, 0.412, 0.337,1];
  shrinePillar.matrix.translate(-0.05,-.16,-1.05);
  shrinePillar.matrix.scale(.03,.3,.03);
  shrinePillar.render();
  var shrinePillar = new Cube();
  shrinePillar.color=[0.529, 0.412, 0.337,1];
  shrinePillar.matrix.translate(.14,-.16,-1.05);
  shrinePillar.matrix.scale(.03,.3,.03);
  shrinePillar.render();
  var shrinePillar = new Cube();
  shrinePillar.color=[0.529, 0.412, 0.337,1];
  shrinePillar.matrix.translate(-0.11,.03,-1.05);
  shrinePillar.matrix.scale(.33,.03,.033);
  shrinePillar.render();


  var meat1 = new Cube();
  meat1.color = [0.569, 0.192, 0.192,1];
  meat1.matrix.translate(3,-.6,-2);
  meat1.matrix.rotate(-45,0,1,0);
  var meatCenter1 = new Matrix4(meat1.matrix);
  meat1.matrix.scale(.3,.2,.2); 
  
  var bone1 = new Cube();
  bone1.color = [1, 1, 1,1];
  bone1.matrix = new Matrix4(meatCenter1);
  bone1.matrix.translate(-.15,.06,.05);
  bone1.matrix.scale(.6,.07,.07); 

  var meat2 = new Cube();
  meat2.color = [0.569, 0.192, 0.192,1];
  meat2.matrix.translate(-3,-.6,3.5);
  meat2.matrix.rotate(-45,0,1,0);
  var meatCenter2 = new Matrix4(meat2.matrix);
  meat2.matrix.scale(.3,.2,.2); 
  
  var bone2 = new Cube();
  bone2.color = [1, 1, 1,1];
  bone2.matrix = new Matrix4(meatCenter2);
  bone2.matrix.translate(-.15,.06,.05);
  bone2.matrix.scale(.6,.07,.07); 

  var meat3 = new Cube();
  meat3.color = [0.569, 0.192, 0.192,1];
  meat3.matrix.translate(3,-.6,3.5);
  meat3.matrix.rotate(45,0,1,0);
  var meatCenter3 = new Matrix4(meat3.matrix);
  meat3.matrix.scale(.3,.2,.2); 
  
  var bone3 = new Cube();
  bone3.color = [1, 1, 1,1];
  bone3.matrix = new Matrix4(meatCenter3);
  bone3.matrix.translate(-.15,.06,.05);
  bone3.matrix.scale(.6,.07,.07); 

  var rockPileBig1 = new Cube();
  rockPileBig1.textureNum = 2; 
  rockPileBig1.matrix.translate(-4.3,-0.7,0);
  rockPileBig1.matrix.rotate(90,0,1,0);
  var rock1Ctrl1 = new Matrix4(rockPileBig1.matrix);
  rockPileBig1.matrix.scale(.7,.7,.7);
  rockPileBig1.render();
  var rockPileSmall1 = new Cube();
  rockPileSmall1.textureNum = 2; 
  rockPileSmall1.matrix = rock1Ctrl1;
  rockPileSmall1.matrix.translate(-.4,0,0);
  rockPileSmall1.matrix.scale(.4,.4,.4);
  rockPileSmall1.render();

  var rockPileBig2 = new Cube();
  rockPileBig2.textureNum = 2; 
  rockPileBig2.matrix.translate(3.0,-0.7,3);
  rockPileBig2.matrix.rotate(225,0,1,0);
  var rock1Ctrl2 = new Matrix4(rockPileBig2.matrix);
  rockPileBig2.matrix.scale(.7,.7,.7);
  rockPileBig2.render();
  var rockPileSmall2 = new Cube();
  rockPileSmall2.textureNum = 2; 
  rockPileSmall2.matrix = rock1Ctrl2;
  rockPileSmall2.matrix.translate(-.4,0,0);
  rockPileSmall2.matrix.scale(.4,.4,.4);
  rockPileSmall2.render();

  var treeB = new Cube();
  treeB.color = [0.349, 0.306, 0.184,1];
  treeB.matrix.translate(-3,-.7,-1);
  var leafP = new Matrix4(treeB.matrix);
  treeB.matrix.scale(.2,1.7,.2);
  treeB.render();
  var leafT = new Cube();
  leafT.color = [1, 0.475, 0.561,1];
  leafT.matrix = new Matrix4(leafP);  
  leafT.matrix.translate(-.03, 1.5, -.2);  
  leafT.matrix.scale(0.8, 0.8, 0.8);  
  leafT.render();
  leafB = new Cube();
  leafB.color = [1, 0.475, 0.561,1];
  leafB.matrix = new Matrix4(leafP);  
  leafB.matrix.translate(-.7,1.3,-.4);  
  leafB.matrix.scale(0.7, 0.7, 0.7);  
  leafB.render();
  leafC = new Cube();
  leafC.color = [1, 0.475, 0.561,1];
  leafC.matrix = new Matrix4(leafP);  
  leafC.matrix.translate(.2,1,-.7);  
  leafC.matrix.scale(0.7, 0.7, 0.7);  
  leafC.render();

  var treeB1 = new Cube();
  treeB1.color = [0.349, 0.306, 0.184,1];
  treeB1.matrix.translate(3,-.7,1);
  treeB1.matrix.rotate(90,0,1,0)
  var leafP1 = new Matrix4(treeB1.matrix);
  treeB1.matrix.scale(.2,1.7,.2);
  treeB1.render();
  var leafT1 = new Cube();
  leafT1.color = [1, 0.475, 0.561,1];
  leafT1.matrix = new Matrix4(leafP1);  
  leafT1.matrix.translate(-.03, 1.5, -.2);  
  leafT1.matrix.scale(0.8, 0.8, 0.8);  
  leafT1.render();
  leafB1 = new Cube();
  leafB1.color = [1, 0.475, 0.561,1];
  leafB1.matrix = new Matrix4(leafP1);  
  leafB1.matrix.translate(-.7,1.3,-.4);  
  leafB1.matrix.scale(0.7, 0.7, 0.7);  
  leafB1.render();
  leafC1 = new Cube();
  leafC1.color = [1, 0.475, 0.561,1];
  leafC1.matrix = new Matrix4(leafP1);  
  leafC1.matrix.translate(.2,1,-.7);  
  leafC1.matrix.scale(0.7, 0.7, 0.7);  
  leafC1.render();

  var meat4 = new Cube();
  meat4.color = [0.569, 0.192, 0.192,1];
  meat4.matrix.translate(-.13,-0.7,0.5);
  meat4.matrix.rotate(0,0,1,0);
  var meatCenter4 = new Matrix4(meat4.matrix);
  meat4.matrix.scale(.3,.2,.2); 
  var bone4 = new Cube();
  bone4.color = [1, 1, 1,1];
  bone4.matrix = new Matrix4(meatCenter4);
  bone4.matrix.translate(-.15,.06,.05);
  bone4.matrix.scale(.6,.07,.07); 
 
  var meat5 = new Cube();
  meat5.color = [0.569, 0.192, 0.192,1];
  meat5.matrix.translate(.4,-0.7,0.6);
  meat5.matrix.rotate(45,0,1,0);
  var meatCenter5 = new Matrix4(meat5.matrix);
  meat5.matrix.scale(.3,.2,.2); 
  var bone5 = new Cube();
  bone5.color = [1, 1, 1,1];
  bone5.matrix = new Matrix4(meatCenter5);
  bone5.matrix.translate(-.15,.06,.05);
  bone5.matrix.scale(.6,.07,.07); 
  
  var meat6 = new Cube();
  meat6.color = [0.569, 0.192, 0.192,1];
  meat6.matrix.translate(.4,-0.7,0.1);
  meat6.matrix.rotate(100,0,1,0);
  var meatCenter6 = new Matrix4(meat6.matrix);
  meat6.matrix.scale(.3,.2,.2); 
  var bone6 = new Cube();
  bone6.color = [1, 1, 1,1];
  bone6.matrix = new Matrix4(meatCenter6);
  bone6.matrix.translate(-.15,.06,.05);
  bone6.matrix.scale(.6,.07,.07); 

  
  var indicatorBot = new Cube();
  indicatorBot.color = [1, 0.992, 0.384, 1];
  indicatorBot.matrix.translate(-.01,0,0.4);
  indicatorBot.matrix.scale(0.1,.1,.1);
  
  var indicatorTop = new Cube();
  indicatorTop.color = [1, 0.992, 0.384, 1];
  indicatorTop.matrix.translate(-.01,0.2,0.4);
  indicatorTop.matrix.scale(0.1,.3,.1);

var bodyPivot = new Cube();
bodyPivot.color = [.75,.75,.75,1];
bodyPivot.matrix.translate(.15,-.22,-.1);
bodyPivot.matrix.rotate(-20,1,0,0);
bodyPivot.matrix.rotate(90,0,1,0);
var bp = new Matrix4(bodyPivot.matrix);
bodyPivot.matrix.scale(0.1,.1,.1)
var body = new Cube();
body.color = [1.0,0.965,0.988,1];
body.matrix = new Matrix4(bp);
body.matrix.translate(-.05,-.08,-.2); //-.15,-.33,-.2
body.matrix.translate(-.1,t_body,0.0); //-.25
body.matrix.rotate(0,0,0,1);
var baseCoordinates = new Matrix4(body.matrix);
body.matrix.scale(0.25,0.15,0.15);
body.render();
var backBody = new Cube();
backBody.color = [1,0.965,0.988,1];
backBody.matrix = new Matrix4(baseCoordinates);
backBody.matrix.translate(.2,0,0.0);
backBody.matrix.rotate(0,0,0,1);
var rearCtrl = new Matrix4(backBody.matrix);
backBody.matrix.scale(0.17,0.17,0.17);
backBody.matrix.translate(0,-.07,-.06);
backBody.render();
var frontBody = new Cube();
frontBody.color = [1,.963,0.988,1];
frontBody.matrix = new Matrix4(baseCoordinates);
frontBody.matrix.translate(-.2,-.040,0.0);
frontBody.matrix.rotate(0,0,0,1);
var necklaceCtrl = new Matrix4(frontBody.matrix);
frontBody.matrix.scale(.2,.2,.2);
frontBody.matrix.translate(0,0,-0.13);
frontBody.render();

var lTFPivot = new Cube();
lTFPivot.matrix = new Matrix4(necklaceCtrl)
lTFPivot.matrix.translate(0.05,.05,0)
lTFPivot.matrix.rotate(r_frontThigh,0,0,1);
var ltfp = new Matrix4(lTFPivot.matrix);
lTFPivot.matrix.scale(.1,.1,.1);
var leftThighF = new Cube();
leftThighF.color = [1,.963,0.988,1];
leftThighF.matrix = new Matrix4(necklaceCtrl)
leftThighF.matrix = new Matrix4(ltfp)
leftThighF.matrix.translate(.11,-.1,0.17);
leftThighF.matrix.rotate(50,0,0,1);
var lShinFCtrl= new Matrix4(leftThighF.matrix);
leftThighF.matrix.scale(.08,.17,.07);
leftThighF.render();

var RTFPivot = new Cube();
RTFPivot.matrix = new Matrix4(necklaceCtrl)
RTFPivot.matrix.translate(0.05,.05,-.25)
RTFPivot.matrix.rotate(r_frontThigh,0,0,1);
var Rtfp = new Matrix4(RTFPivot.matrix);
RTFPivot.matrix.scale(.1,.1,.1);
var ReftThighF = new Cube();
ReftThighF.color = [1,.963,0.988,1];
ReftThighF.matrix = new Matrix4(necklaceCtrl)
ReftThighF.matrix = new Matrix4(Rtfp)
ReftThighF.matrix.translate(.11,-.1,0.17);
ReftThighF.matrix.rotate(50,0,0,1);
var RShinFCtrl= new Matrix4(ReftThighF.matrix);
ReftThighF.matrix.scale(.08,.17,.07);
ReftThighF.render();
var RSFPivot = new Cube();
RSFPivot.matrix = new Matrix4(RShinFCtrl)
RSFPivot.matrix.translate(.03,0.03,0);
RSFPivot.matrix.rotate(-50,0,0,1);
RSFPivot.matrix.rotate(r_frontShin,0,0,1);
var Rsfp = new Matrix4(RSFPivot.matrix); 
RSFPivot.matrix.scale(.1,.1,.1);
var ReftShinF = new Cube();
ReftShinF.color = [0.063, .259, .31, 1];
ReftShinF.matrix = new Matrix4(RShinFCtrl);
ReftShinF.matrix = new Matrix4(Rsfp);
ReftShinF.matrix.translate(.004,-.05,0.01);
ReftShinF.matrix.rotate(150, 0, 0, 1);
var RFootFCtrl= new Matrix4(ReftShinF.matrix);
ReftShinF.matrix.scale(.05,.16,.05);
ReftShinF.render();
var ReftFootF = new Cube();
ReftFootF.color = [0.063, .259, .31, 1];
ReftFootF.matrix = new Matrix4(RFootFCtrl);
ReftFootF.matrix.translate(0.01,.17,0);
ReftFootF.matrix.rotate(-60, 0, 0, 1);
ReftFootF.matrix.rotate(r_frontFoot, 0, 0, 1);
ReftFootF.matrix.scale(.045,.07,.045);
ReftFootF.render();

var lSFPivot = new Cube();
lSFPivot.matrix = new Matrix4(lShinFCtrl)
lSFPivot.matrix.translate(.03,0.03,0);
lSFPivot.matrix.rotate(-50,0,0,1);
lSFPivot.matrix.rotate(r_frontShin,0,0,1);
var lsfp = new Matrix4(lSFPivot.matrix); 
lSFPivot.matrix.scale(.1,.1,.1);
var leftShinF = new Cube();
leftShinF.color = [0.063, .259, .31, 1];
leftShinF.matrix = new Matrix4(lShinFCtrl);
leftShinF.matrix = new Matrix4(lsfp);
leftShinF.matrix.translate(.004,-.05,0.01);
leftShinF.matrix.rotate(150, 0, 0, 1);
var lFootFCtrl= new Matrix4(leftShinF.matrix);
leftShinF.matrix.scale(.05,.16,.05);
leftShinF.render();
var leftFootF = new Cube();
leftFootF.color = [0.063, .259, .31, 1];
leftFootF.matrix = new Matrix4(lFootFCtrl);
leftFootF.matrix.translate(0.01,.17,0);
leftFootF.matrix.rotate(-60, 0, 0, 1);
leftFootF.matrix.rotate(r_frontFoot, 0, 0, 1);
leftFootF.matrix.scale(.045,.07,.045);
leftFootF.render();

var lTPivot = new Cube();
lTPivot.matrix = new Matrix4(rearCtrl);
lTPivot.matrix.translate(.05, 0.04, 0);
lTPivot.matrix.rotate(r_backThigh, 0, 0, 1); 
var ltp= new Matrix4(lTPivot.matrix);  
lTPivot.matrix.scale(0.1, 0.1, 0.1);  
var leftThighB = new Cube();
leftThighB.color = [1,.963,0.988,1];
leftThighB.matrix = new Matrix4(rearCtrl)
leftThighB.matrix = new Matrix4(ltp)
leftThighB.matrix.translate(.09,-.11,0.16);
leftThighB.matrix.rotate(50,0,0,1);
var lshinBCtrl= new Matrix4(leftThighB.matrix);
leftThighB.matrix.scale(.09,.20,.08);
leftThighB.render();

var lSPivot = new Cube();
lSPivot.matrix = new Matrix4(lshinBCtrl);
lSPivot.matrix.translate(0.025, 0.025, 0);
lSPivot.matrix.rotate(-50, 0, 0, 1); 
lSPivot.matrix.rotate(r_backShin, 0, 0, 1); 
var lsp= new Matrix4(lSPivot.matrix);  
lSPivot.matrix.scale(0.05, 0.05, 0.05);  
var leftShinB = new Cube();
leftShinB.color = [0.063, .259, .31, 1];
leftShinB.matrix = new Matrix4(lshinBCtrl);
leftShinB.matrix = new Matrix4(lsp);
leftShinB.matrix.translate(0.01,-.025,0.01);
leftShinB.matrix.rotate(150, 0, 0, 1);
var lFootBCtrl= new Matrix4(leftShinB.matrix);
leftShinB.matrix.scale(.05,.22,.05);
leftShinB.render();

var leftFootB = new Cube();
leftFootB.color = [0.063, .259, .31, 1];
leftFootB.matrix = new Matrix4(lFootBCtrl);
leftFootB.matrix.translate(-0.0,.23,0);
leftFootB.matrix.rotate(-60, 0, 0, 1);
leftFootB.matrix.rotate(r_backFoot, 0, 0, 1);
leftFootB.matrix.scale(.045,.07,.045);
leftFootB.render();

var rTPivot = new Cube();
rTPivot.matrix = new Matrix4(rearCtrl);
rTPivot.matrix.translate(.05, 0.04, -.25);
rTPivot.matrix.rotate(r_backThigh, 0, 0, 1); 
var rtp= new Matrix4(rTPivot.matrix);  
rTPivot.matrix.scale(0.1, 0.1, 0.1);  
var reftThighB = new Cube();
reftThighB.color = [1,.963,0.988,1];
reftThighB.matrix = new Matrix4(rearCtrl)
reftThighB.matrix = new Matrix4(rtp)
reftThighB.matrix.translate(.09,-.11,0.16);
reftThighB.matrix.rotate(50,0,0,1);
var rshinBCtrl= new Matrix4(reftThighB.matrix);
reftThighB.matrix.scale(.09,.20,.08);
reftThighB.render();

var rSPivot = new Cube();
rSPivot.matrix = new Matrix4(rshinBCtrl);
rSPivot.matrix.translate(0.025, 0.025, 0);
rSPivot.matrix.rotate(-50, 0, 0, 1); 
rSPivot.matrix.rotate(r_backShin, 0, 0, 1); 
var rsp= new Matrix4(rSPivot.matrix);  
lSPivot.matrix.scale(0.05, 0.05, 0.05);  
var reftShinB = new Cube();
reftShinB.color = [0.063, .259, .31, 1];
reftShinB.matrix = new Matrix4(rshinBCtrl);
reftShinB.matrix = new Matrix4(rsp);
reftShinB.matrix.translate(0.01,-.025,0.01);
reftShinB.matrix.rotate(150, 0, 0, 1);
var rFootBCtrl= new Matrix4(reftShinB.matrix);
reftShinB.matrix.scale(.05,.22,.05);
reftShinB.render();

var reftFootB = new Cube();
reftFootB.color = [0.063, .259, .31, 1];
reftFootB.matrix = new Matrix4(rFootBCtrl);
reftFootB.matrix.translate(-0.0,.23,0);
reftFootB.matrix.rotate(-60, 0, 0, 1);
reftFootB.matrix.rotate(r_backFoot, 0, 0, 1);
reftFootB.matrix.scale(.045,.07,.045);
reftFootB.render();

var tailBase = new Cube();
tailBase.color = [0.067, 0.341, 0.412,1];
tailBase.matrix = new Matrix4(rearCtrl);
tailBase.matrix.translate(.15,.09, 0.02);
tailBase.matrix.rotate(40, 0, 0, 1);
tailBase.matrix.rotate(r_tailAngle, 0, 0, 1);
var tailMidCtrl= new Matrix4(tailBase.matrix);
tailBase.matrix.scale(.2,.1,.1);
tailBase.render();
var tp = new Cube();
tp.matrix = new Matrix4(tailMidCtrl);
tp.matrix.translate(.28,.01,0);
tp.matrix.rotate(50,0,0,1);
tp.matrix.rotate(r_tail,0,0,1);
var tmp = new Matrix4(tp.matrix); 
tp.matrix.scale(.1,.1,.1);
//tp.render();
var tailMid = new Cube();
tailMid.color = [0.082, 0.416, 0.502, 1];
tailMid.matrix = new Matrix4(tailMidCtrl);
tailMid.matrix = new Matrix4(tmp);
tailMid.matrix.rotate(-90, 0, 0, 1);
tailMid.matrix.translate(-0.12,-.22, -.07);
var tailBackCtrl= new Matrix4(tailMid.matrix);
tailMid.matrix.scale(0.35,.25,.25)
tailMid.render();
var tailBack = new Cube();
tailBack.color= [0.106, 0.549, 0.659,1];
tailBack.matrix = new Matrix4(tailBackCtrl)
tailBack.matrix.translate(.35, .09, 0.05);
tailBack.matrix.scale(0.15,.15,.15)
tailBack.render();

var neck = new Cube();
neck.color = [1,0.963,0.988,1];
neck.matrix = new Matrix4(necklaceCtrl);
neck.matrix.translate(-0.07,0.2,0.0);
neck.matrix.rotate(45, 0,0,-1);
neck.matrix.rotate(0, 0,0,-1);
var neckCtrl = new Matrix4(neck.matrix);
neck.matrix.scale(0.17,.12,.12);
neck.matrix.translate(0,0.0,0.13);
neck.render();

var hmrp = new Cube();
hmrp.matrix = new Matrix4(neckCtrl);
hmrp.matrix.translate(.01,.09,0.07);
hmrp.matrix.rotate(-45, 0,0,1);
hmrp.matrix.rotate(r_necky, 0,0,1);
hmrp.matrix.rotate(r_neckz, 1,0,0);
var hPivot = new Matrix4(hmrp.matrix);
hmrp.matrix.scale(.1,.1,.1)
var headMidRight = new Cube();
headMidRight.color = [1,0.963,0.988,1];
headMidRight.matrix = new Matrix4(neckCtrl);
headMidRight.matrix = new Matrix4(hPivot);
headMidRight.matrix.translate(.05,-.20,-.05);
headMidRight.matrix.rotate(-90,0,0,-1);
var baseHead = new Matrix4(headMidRight.matrix);
headMidRight.matrix.scale(0.20,.05,.15);
headMidRight.matrix.translate(0.17,0.1,-.09);
headMidRight.render();
var headTopRight = new triangularPrism();
headTopRight.color = [1,0.963,0.988,1];
headTopRight.matrix = new Matrix4(baseHead);
headTopRight.matrix.translate(0.16,0.054,0.0);
headTopRight.matrix.rotate(0, 0,0,-1);
headTopRight.matrix.scale(0.07,.13,.15);
headTopRight.matrix.translate(0,0,-.09);
headTopRight.render();
var headTopLeft = new triangularPrism();
headTopLeft.color = [1,0.963,0.988,1];
headTopLeft.matrix = new Matrix4(baseHead);
headTopLeft.matrix.translate(0.135,0.054,0.0);
headTopLeft.matrix.rotate(0, 0,0,-1);
headTopLeft.matrix.scale(-0.15,.13,.15);
headTopLeft.matrix.translate(0,0,-.09);
headTopLeft.render();
var headTopMid = new Cube();
headTopMid.color = [1,0.963,0.988,1];
headTopMid.matrix = new Matrix4(baseHead);
headTopMid.matrix.translate(0.165,.045,0.0);
headTopMid.matrix.rotate(0, 0,0,-1);
headTopMid.matrix.scale(-0.03,.135,.15);
headTopMid.matrix.translate(0,0,-.09);
headTopMid.render()
var headBotRight = new triangularPrism();
headBotRight.color = [1,0.963,0.988,1];
headBotRight.matrix = new Matrix4(baseHead);
headBotRight.matrix.translate(.234,.005,0.0);
headBotRight.matrix.scale(-.20,-.1,.15);
headBotRight.matrix.translate(0,0,-.09);
headBotRight.render();
var headLeftSideTop = new triangularPyramid();
headLeftSideTop.color = [1,0.963,0.988,1];
headLeftSideTop.matrix = new Matrix4(baseHead);
headLeftSideTop.matrix.translate(.14,.18,.10);
headLeftSideTop.matrix.rotate(90,1,0,0);
headLeftSideTop.matrix.rotate(35,0,1,0);
headLeftSideTop.matrix.scale(-.25,.1,.2);
headLeftSideTop.render();
var headRightSideTop = new triangularPyramid();
headRightSideTop.color = [1,0.963,0.988,1];
headRightSideTop.matrix = new Matrix4(baseHead);
headRightSideTop.matrix.translate(.13,.19,.03);
headRightSideTop.matrix.rotate(90,1,0,0);
headRightSideTop.matrix.rotate(40,0,1,0);
headRightSideTop.matrix.rotate(1,0,0,1);
headRightSideTop.matrix.scale(-0.25,-.1,.2);
headRightSideTop.render();
var mouthTop = new Cube();
mouthTop.color = [1,0.963,0.988,1];
mouthTop.matrix = new Matrix4(baseHead);
mouthTop.matrix.rotate(20,0,0,1);
mouthTop.matrix.scale(.16,-.035,.08);
mouthTop.matrix.translate(-.5,-1.7,0.25);
mouthTop.render();
var nose = new Cube();
nose.color = [1.0,0.655,0.867,1];
nose.matrix = new Matrix4(baseHead);
nose.matrix.rotate(20,0,0,1);
nose.matrix.scale(.015,-.034,.065);
nose.matrix.translate(-6.1,-1.8,0.4);
nose.render();
var eyeLeft = new Cube();
eyeLeft.color = [0.063, .259, .31, 1];
eyeLeft.matrix = new Matrix4(baseHead);
eyeLeft.matrix.translate(0.02,.08,0.14);
eyeLeft.matrix.rotate(60,0,1,0)
eyeLeft.matrix.rotate(-14,1,0,0)
eyeLeft.matrix.scale(.01,-.020,.10);
eyeLeft.render();
var eyeRight = new Cube();
eyeRight.color = [0.063, .259, .31, 1];
eyeRight.matrix = new Matrix4(baseHead);
eyeRight.matrix.translate(0.1,.1,-.06);
eyeRight.matrix.rotate(-60,0,1,0)
eyeRight.matrix.rotate(14,1,0,0)
eyeRight.matrix.scale(.01,-.020,.10);
eyeRight.render();
var mouthBot = new Cube();
mouthBot.color = [1,0.963,0.988,1];
mouthBot.matrix = new Matrix4(baseHead);
mouthBot.matrix.rotate(20,0,0,1);
mouthBot.matrix.rotate(r_mouth,0,0,1);
mouthBot.matrix.scale(.16,-.034,.07);
mouthBot.matrix.translate(-.5,-.7,.4);
mouthBot.render();

var earLeft = new Cube();
earLeft.color = [1,0.963,0.988,1];
earLeft.matrix = new Matrix4(baseHead);
earLeft.matrix.translate(0.2,0.12,.12);
earLeft.matrix.rotate(65,0,0,1);
earLeft.matrix.scale(0.1,.1,.03);
var earLeftBase = new Matrix4(earLeft.matrix);
earLeft.render()
var earLeftFur = new Cube();
earLeftFur.color = [.2, .776, .788, 1];
earLeftFur.matrix = new Matrix4(earLeftBase);
earLeftFur.matrix.translate(.17,0.19,0.5);
earLeftFur.matrix.scale(1,0.6,.8);
earLeftFur.render()
var earLeftTip = new Cube();
earLeftTip.color = [1.0,0.655,0.867,1];
earLeftTip.matrix = new Matrix4(earLeftBase);
earLeftTip.matrix.translate(1,0.1,0);
earLeftTip.matrix.scale(0.3,0.8,1);
earLeftTip.render()
var earLeftTipTip = new Cube();
earLeftTipTip.color = [1.0,0.655,0.867,1];
earLeftTipTip.matrix = new Matrix4(earLeftBase);
earLeftTipTip.matrix.translate(1.25,0.25,0);
earLeftTipTip.matrix.scale(0.3,0.5,1);
earLeftTipTip.render()
var earLeftTipTipTip = new Cube();
earLeftTipTipTip.color = [1.0,0.655,0.867,1];
earLeftTipTipTip.matrix = new Matrix4(earLeftBase);
earLeftTipTipTip.matrix.translate(1.5,0.4,0);
earLeftTipTipTip.matrix.scale(0.3,0.25,1);
earLeftTipTipTip.render()
var earRight = new Cube();
earRight.color = [1,0.963,0.988,1];
earRight.matrix = new Matrix4(baseHead);
earRight.matrix.translate(0.2,0.12,-.04);
earRight.matrix.rotate(65,0,0,1);
earRight.matrix.scale(0.1,.1,.03);
var earRightBase = new Matrix4(earRight.matrix);
earRight.render()
var earRightFur = new Cube();
earRightFur.color = [.2, .776, .788, 1];
earRightFur.matrix = new Matrix4(earRightBase);
earRightFur.matrix.translate(.17,0.19,0.5);
earRightFur.matrix.scale(1,0.6,-1);
earRightFur.render()
var earRightTip = new Cube();
earRightTip.color = [1.0,0.655,0.867,1];
earRightTip.matrix = new Matrix4(earRightBase);
earRightTip.matrix.translate(1,0.1,0);
earRightTip.matrix.scale(0.3,.8,1);
earRightTip.render()
var earRightTipTip = new Cube();
earRightTipTip.color = [1.0,0.655,0.867,1];
earRightTipTip.matrix = new Matrix4(earRightBase);
earRightTipTip.matrix.translate(1.25,0.25,0);
earRightTipTip.matrix.scale(0.3,.5,1);
earRightTipTip.render()
var earRightTipTipTip = new Cube();
earRightTipTipTip.color = [1.0,0.655,0.867,1];
earRightTipTipTip.matrix = new Matrix4(earRightBase);
earRightTipTipTip.matrix.translate(1.5,0.4,0);
earRightTipTipTip.matrix.scale(0.3,.25,1);
earRightTipTipTip.render()

  var duration = performance.now() - startTime;
  sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration), "numdot");  
  sendTextToHTML("Amount of Meat Currently Held: " + meatHeld ,"meatInv")
  let meatPosition1 = new Vector3([3, -0.6, -2]); 
  let dMeat1 = Math.sqrt(
    Math.pow(camera.eye.elements[0] - meatPosition1.elements[0], 2) +
    Math.pow(camera.eye.elements[1] - meatPosition1.elements[1], 2) +
    Math.pow(camera.eye.elements[2] - meatPosition1.elements[2], 2)
  );

  if (dMeat1 < 2.0) {  
    meat1.color = [0, 0, 1,1];
    bone1.color = [0, 0, 1,1];    
  }
  if(meat1c != 1){
    meat1.render();
    bone1.render();
  }

  let meatPosition2 = new Vector3([-3,-.6,3.5]); 
  let dMeat2 = Math.sqrt(
    Math.pow(camera.eye.elements[0] - meatPosition2.elements[0], 2) +
    Math.pow(camera.eye.elements[1] - meatPosition2.elements[1], 2) +
    Math.pow(camera.eye.elements[2] - meatPosition2.elements[2], 2)
  );

  if (dMeat2 < 2.0) {  
    meat2.color = [0, 0, 1,1];
    bone2.color = [0, 0, 1,1];    
  }
  if(meat2c != 1){
    meat2.render();
    bone2.render();
  }
  let meatPosition3 = new Vector3([3,-.6,3.5]); 
  let dMeat3 = Math.sqrt(
    Math.pow(camera.eye.elements[0] - meatPosition3.elements[0], 2) +
    Math.pow(camera.eye.elements[1] - meatPosition3.elements[1], 2) +
    Math.pow(camera.eye.elements[2] - meatPosition3.elements[2], 2)
  );

  if (dMeat3 < 2.0) {  
    meat3.color = [0, 0, 1,1];
    bone3.color = [0, 0, 1,1];    
  }
  if(meat3c != 1){
    meat3.render();
    bone3.render();
  }
  let indicatorPosition = new Vector3([-.01,0,0.4]);
    let dInd = Math.sqrt(
      Math.pow(camera.eye.elements[0] - indicatorPosition.elements[0], 2) +
      Math.pow(camera.eye.elements[1] - indicatorPosition.elements[1], 2) +
      Math.pow(camera.eye.elements[2] - indicatorPosition.elements[2], 2)
    );
  if(meatHeld == 3){
    if(dInd < 2.5){
      indicatorBot.render();
      indicatorTop.render();
    }
  }
  if(satisfied==1){
    meat4.render();
    bone4.render();
    meat5.render();
    bone5.render();
    meat6.render();
    bone6.render();
  }

}
function sendTextToHTML(text, htmlID) {
  let elem = document.getElementById(htmlID);
  if (elem) elem.innerHTML = text;
}
