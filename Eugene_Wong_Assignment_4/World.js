// Vertex shader program
var VSHADER_SOURCE = `
  precision mediump float; 
  attribute vec4 a_Position; 
  attribute vec2 a_UV; 
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal; 
  varying vec4 v_VertPos; 
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix; 
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() { 
    gl_Position =  u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position; 
  }`;
//
// Fragment shader program
var FSHADER_SOURCE = `
  precision mediump float;
  varying vec2 v_UV; 
  varying vec3 v_Normal;
  uniform vec4 u_FragColor;
  uniform sampler2D u_Sampler0; 
  uniform sampler2D u_Sampler1; 
  uniform sampler2D u_Sampler2; 
  uniform int u_whichTexture; 
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  varying vec4 v_VertPos;
  void main() {
    if(u_whichTexture == -3){
      gl_FragColor = vec4((v_Normal+1.0)/2.0,1.0);
    } else if (u_whichTexture == -2){
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

    vec3 lightVector = u_lightPos-vec3(v_VertPos); 
    float r = length(lightVector);
    // if(r<1.0) {
    //   gl_FragColor = vec4(1,0,0,1);
    // } else if (r<2.0){
    //   gl_FragColor= vec4(0,1,0,1);
    // }
    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L),0.0);
    
    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));

    float specular = pow(max(dot(E,R), 0.0),2.0);

    vec3 diffuse = vec3(gl_FragColor) * nDotL * 0.7;
    vec3 ambient = vec3(gl_FragColor) * 0.3;
    gl_FragColor = vec4(specular+diffuse+ambient, 1.0); 
  }`;

let canvas;
let gl;
let a_Position;
let a_UV
let a_Normal;
let u_FragColor;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_Sampler2;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;

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
let g_normalOn = false; 
let g_lightPos=[0,1,-2];

let meat1c = 0;
let meat2c = 0;
let meat3c = 0;
let meatHeld = 0;
let indicator = 0; 
let satisfied = 0;
 
//let v1x = 1.0, v1y = 0.0, v2x = 0.0, v2y = 1.0;
function addActionsforHtmlUI() {
  document.getElementById('normalOn').onclick = function() {g_normalOn=true; };
  document.getElementById('normalOff').onclick = function() {g_normalOn=false;};
  document.getElementById("lightSlideX").addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[0] = this.value/100; renderAllShapes();}});
  document.getElementById("lightSlideY").addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[1] = this.value/100; renderAllShapes();}});
  document.getElementById("lightSlideZ").addEventListener('mousemove', function(ev) {if(ev.buttons == 1) {g_lightPos[2] = this.value/100; renderAllShapes();}});
}
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
  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0 ){
    console.log('Failed to get storage location of a_Normal')
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
  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if(!u_lightPos){
    console.log("failed to get u_lightPos");
    return;
  }
  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if(!u_cameraPos){
    console.log("failed to get camerapos")
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
  addActionsforHtmlUI();
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

  g_lightPos[0]=Math.cos(g_seconds);
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

  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, camera.eye.x, camera.eye.y, camera.eye.z);

  var light = new Cube();
  light.color = [2,2,0,1];
  light.matrix.translate(g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  light.matrix.scale(-.1,-.1,-.1);
  light.matrix.translate(-.5,-.5,-.5);
  light.render();
  //drawMap();
  var orb = new Sphere();
  if(g_normalOn){ orb.textureNum = -3;}
  orb.matrix.translate(0,0,0);
  orb.matrix.scale(.5,.5,.5);
  orb.render();

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
  if(g_normalOn){ sky.textureNum = -3;}
  sky.matrix.scale(-10,-10,-10);
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
