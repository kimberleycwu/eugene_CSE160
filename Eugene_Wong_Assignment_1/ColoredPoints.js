// Vertex shader program
var VSHADER_SOURCE = `
  attribute vec4 a_Position; 
  uniform float u_Size;
  void main() { 
    gl_Position = a_Position; 
    gl_PointSize = u_Size; 
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
let u_Size;

let v1x = 1.0, v1y = 0.0, v2x = 0.0, v2y = 1.0;

function setupWebGL() {
  canvas = document.getElementById('webgl');
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
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

  if (!u_FragColor || !u_Size) {
    console.log('Failed to get uniform locations');
    return;
  }
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedSize = 5;
let g_selectedType = POINT;
let g_selectedSegments = 10;

let g_shapesList = [];
let g_shapesHistory = [];

function getAllTriangleProperties() {
  let output = "";

  for (let shape of g_shapesList) {
    if (shape.type === 'triangle' || shape instanceof Triangle) {
      output += `{\n`;
      output += `  type: TRIANGLE,\n`;
      output += `  position: [${shape.position[0].toFixed(3)}, ${shape.position[1].toFixed(3)}],\n`;
      output += `  color: [${shape.color.map(c => c.toFixed(3)).join(', ')}],\n`;
      output += `  size: ${shape.size},\n`;
      output += `  vertex1Offset: [${shape.vertex1Offset[0].toFixed(3)}, ${shape.vertex1Offset[1].toFixed(3)}],\n`;
      output += `  vertex2Offset: [${shape.vertex2Offset[0].toFixed(3)}, ${shape.vertex2Offset[1].toFixed(3)}]\n`;
      output += `},\n`;
    }
  }
  return output;
}

function loadPreloadedImage(imageName) {
  g_shapesList = [];
  const configurations = preloadedImages[imageName];

  configurations.forEach(config => {
    let shape;

    if (config.type === TRIANGLE || config.type === "triangle") {
      shape = new Triangle();
      shape.vertex1Offset = config.vertex1Offset.slice();
      shape.vertex2Offset = config.vertex2Offset.slice();
    } else if (config.type === CIRCLE || config.type === "circle") {
      shape = new Circle();
      if (config.segments) shape.segments = config.segments;
    } else {
      shape = new Point();
    }

    shape.position = config.position.slice();
    shape.color = config.color.slice();
    shape.size = config.size;
    g_shapesList.push(shape);
  });

  renderAllShapes();
  g_shapesHistory.push([...g_shapesList]); 
}

function addActionsforHtmlUI() {
  document.getElementById("green").onclick = () => g_selectedColor = [0.0, 1.0, 0.0, 1.0];
  document.getElementById("red").onclick = () => g_selectedColor = [1.0, 0.0, 0.0, 1.0];

  document.getElementById("clearButton").onclick = () => {
    g_shapesHistory.push([...g_shapesList]);
    g_shapesList = [];
    renderAllShapes();
  };

  document.getElementById("pointButton").onclick = () => g_selectedType = POINT;
  document.getElementById("triButton").onclick = () => g_selectedType = TRIANGLE;
  document.getElementById("circleButton").onclick = () => g_selectedType = CIRCLE;

  document.getElementById("redSlide").addEventListener('mouseup', e => g_selectedColor[0] = e.target.value / 100);
  document.getElementById("greenSlide").addEventListener('mouseup', e => g_selectedColor[1] = e.target.value / 100);
  document.getElementById("blueSlide").addEventListener('mouseup', e => g_selectedColor[2] = e.target.value / 100);
  document.getElementById("sizeSlide").addEventListener('mouseup', e => g_selectedSize = e.target.value);

  const segmentSlider = document.getElementById("segmentSlide");
  g_selectedSegments = segmentSlider.value;
  segmentSlider.addEventListener("input", function () {
    g_selectedSegments = parseInt(this.value);
    document.getElementById("segmentVal").innerText = this.value;
  });

  document.getElementById("v1xInput").addEventListener("input", e => v1x = parseFloat(e.target.value));
  document.getElementById("v1yInput").addEventListener("input", e => v1y = parseFloat(e.target.value));
  document.getElementById("v2xInput").addEventListener("input", e => v2x = parseFloat(e.target.value));
  document.getElementById("v2yInput").addEventListener("input", e => v2y = parseFloat(e.target.value));

  document.getElementById("undoButton").onclick = undo;
  document.getElementById("loadDragonButton").onclick = () => loadPreloadedImage("dragon");
}

function main() {
  setupWebGL();
  connectVariablesToGLSL();
  addActionsforHtmlUI();

  canvas.onmousedown = click;
  canvas.onmousemove = ev => { if (ev.buttons === 1) click(ev); };

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function click(ev) {
  g_shapesHistory.push([...g_shapesList]); 

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
  g_shapesList.push(shape);

  renderAllShapes();
}

function undo() {
  if (g_shapesHistory.length > 0) {
    g_shapesList = g_shapesHistory.pop();
    renderAllShapes();
  }
}

function convertCoordinatesEventToGL(ev) {
  let x = ev.clientX, y = ev.clientY;
  let rect = ev.target.getBoundingClientRect();
  x = ((x - rect.left) - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  return [x, y];
}

function renderAllShapes() {
  let startTime = performance.now();
  gl.clear(gl.COLOR_BUFFER_BIT);

  for (let shape of g_shapesList) {
    if (typeof shape.render === 'function') {
      shape.render();
    } else {
      console.warn("Shape missing render():", shape);
    }
  }

  let duration = performance.now() - startTime;
  sendTextToHTML(`numdot: ${g_shapesList.length} ms: ${Math.floor(duration)} fps: ${Math.floor(10000 / duration) / 10}`, "numdot");
}

function sendTextToHTML(text, htmlID) {
  let elem = document.getElementById(htmlID);
  if (elem) elem.innerHTML = text;
}
