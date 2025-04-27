  // Vertex shader program
  var VSHADER_SOURCE = `
    attribute vec4 a_Position; 
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix; 
    void main() { 
      gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position; 
    }`;

  // Fragment shader program
  var FSHADER_SOURCE = `
    precision mediump float;
    uniform vec4 u_FragColor;
    void main() {
      gl_FragColor = u_FragColor; 
    }`;

  let canvas;
  let gl;
  let a_Position;
  let u_FragColor;
  let u_ModelMatrix;

  function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    } 
    gl.enable(gl.DEPTH_TEST);
    
  }

  function connectVariablesToGLSL() {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to initialize shaders.');
      return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
      console.log('Failed to get a_Position');
      return;
    }

    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix')
    if (!u_FragColor) {
      console.log('Failed to get uniform locations');
      return;
    }
    if(!u_ModelMatrix){
      console.log('Failed to get storage location of u_ModelMatrix');
    } 
    if(!u_GlobalRotateMatrix){
      console.log('Failed to get storage location of u_ModelMatrix');
      return;
    } 

    var identityM = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);
  }
  let g_globalAngle = 35; 
  
  let t_XBackBody = 0
  let t_YBackBody = 0
  let t_body = 0;
  let r_body = 0;
  let r_necky = 0; 
  let r_neckz = 0; 
  let r_mouth = 0; 
  let r_frontThigh = 0 
  let r_frontShin = 0;
  let r_frontFoot = 0;
  let r_backThigh = 0;
  let r_backShin = 0;  
  let r_backFoot = 0; 
  let r_tailAngle = 0;
  let r_tail =0
  let g_moveAnimation = false; 
  let g_tailAnimation = false; 

  let g_globalAngleX = 0; 
  let g_globalAngleY = 0;
  let g_mouseLastX = null;
  let g_mouseLastY = 0;
  let g_mouseDragging = false;

  function addActionsforHtmlUI() {
    document.getElementById('animationMoveOffButton').onclick = function() {g_moveAnimation=false;};
    document.getElementById('animationMoveOnButton').onclick = function() {g_moveAnimation=true;};
    document.getElementById("headSlide").addEventListener('mousemove', function() {r_neckz = this.value; renderAllShapes();});
    document.getElementById("mouthSlide").addEventListener('mousemove', function() {r_mouth = this.value; renderAllShapes();});
    document.getElementById("angleSlide").addEventListener('mousemove', function() {g_globalAngle = this.value; renderAllShapes(); }); 
  }
-60
  function main() {
    setupWebGL();
    connectVariablesToGLSL();
    addActionsforHtmlUI();
    canvas.onmousedown = function(ev) {
      g_mouseLastX = ev.clientX;
      g_mouseLastY = ev.clientY;
      g_mouseDragging = true;
    };
    canvas.onmouseup = function(ev) {
      g_mouseDragging = false;
    };
    canvas.onmousemove = function(ev) {
      if (g_mouseDragging) {
        let dx = ev.clientX - g_mouseLastX;
        let dy = ev.clientY - g_mouseLastY;
    
        g_globalAngleY += dx * 0.5;
        g_globalAngleX += dy * 0.5;
    
        g_mouseLastX = ev.clientX;
        g_mouseLastY = ev.clientY;
      }
    };    
    
    canvas.addEventListener('click', function(event) {
      if (event.shiftKey) {
        specialNeckActive = true;
        specialNeckStartTime = g_seconds;
      }
    });

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
  let specialNeckActive = false;
  let specialNeckStartTime = 0;
  function updateAnimationAngles() {
    //r_neckz = (30*Math.sin(16*g_seconds));
    if(g_moveAnimation){
      let cycle = g_seconds % 1.5; 
      t_body = 0.1 * Math.abs(Math.sin(2*g_seconds));
      r_body = (-10*Math.sin(4*g_seconds));
      r_backThigh = -100 * Math.max(0, -Math.sin(4.18879 * g_seconds - Math.PI / 2));
      r_frontThigh = -100 * Math.max(0, -Math.sin(4.18879 * g_seconds - Math.PI / 2 + Math.PI));
      let smoothBack = Math.sin(Math.PI * (cycle - 0.1) / 0.3);
      let smoothFront = (1 - Math.cos(Math.PI * (cycle - 0.5) * 2)) / 2;
      if(cycle >= 0.0 && cycle < .5){
        r_frontShin = 100; 
        r_frontFoot = -30; 
        r_necky = -15;
        r_tailAngle = -40
      }
      else{
        r_frontShin = 100 - smoothFront * (100 - 70);
        r_frontFoot = -30 - smoothFront * (-30 + 40)
        r_necky = -15 + smoothFront* (10 + 10);
        r_tailAngle = -40 + smoothFront*(-40 + 90);
      }
      if(cycle <= 0.05 || cycle >= 0.4){
          r_backShin = 120; 
          r_backFoot = -20;
      } else {
          r_backShin = 120 - smoothBack * (120 - 80); 
          r_backFoot = -20 - smoothBack * (-20 + 40);
      }
    }
    if (specialNeckActive) {
    let elapsed = g_seconds - specialNeckStartTime;
    if (elapsed < 1.0) {
      r_neckz = 30 * Math.sin(16 * elapsed);
    } else {
      specialNeckActive = false;
      r_neckz = 0;
    }
  }
  }
  
  function renderAllShapes() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    var startTime = performance.now();
    var u_GlobalRotMat = new Matrix4();
    u_GlobalRotMat.rotate(g_globalAngleX, 1, 0, 0);
    u_GlobalRotMat.rotate(g_globalAngleY + parseFloat(g_globalAngle), 0, 1, 0); 
    let projMat = new Matrix4();
    projMat.setPerspective(60, canvas.width / canvas.height, 0.01, 10);
    let viewMat = new Matrix4();
    viewMat.setLookAt(0, 0, 2.0, 0, 0, 0, 0, 1, 0);
    let globalMatrix = projMat.multiply(viewMat).multiply(u_GlobalRotMat);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalMatrix.elements);
    gl.uniformMatrix4fv(u_ModelMatrix, false, new Matrix4().elements);

    var bodyPivot = new Cube();
    bodyPivot.color = [.75,.75,.75,1];
    bodyPivot.matrix.translate(-.05,-.22,.2);
    bodyPivot.matrix.rotate(r_body,0,0,1);
    var bp = new Matrix4(bodyPivot.matrix);
    bodyPivot.matrix.scale(0.1,.1,.1)
    var body = new Cube();
    body.color = [1.0,0.965,0.988,1];
    body.matrix = new Matrix4(bp);
    body.matrix.translate(-.05,-.08,-.2);
    body.matrix.translate(-.1,t_body,0.0);
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
  }

  function sendTextToHTML(text, htmlID) {
    let elem = document.getElementById(htmlID);
    if (elem) elem.innerHTML = text;
  }
