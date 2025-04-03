// DrawRectangle.js

function main() {
    // Retrieve <canvas> element                                  <- (1)
    canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

  //Get the rendering context for 2DCG                          <- (2)
  ctx = canvas.getContext('2d');

  // Draw a blue rectangle                                       <- (3)
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; 
  ctx.fillRect(0, 0, canvas.width, canvas.height); 
  let v1 = new Vector3([2.25, 2.25, 0]); 
  drawVector(v1, "red");
  }
function drawVector(v, color){
    //const canvas = document.getElementById("example");
    //const ctx = canvas.getContext("2d");
    ctx.beginPath(); 
    ctx.moveTo(canvas.width / 2, canvas.height / 2);
    ctx.lineTo(canvas.width/2 + v.elements[0]*20,canvas.height/2 - v.elements[1]*20); 
    ctx.strokeStyle = color; 
    ctx.stroke();
}
function handleDrawEvent(){
    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height); 
    var v1 = new Vector3([document.getElementById("v1x").value, document.getElementById("v1y").value])
    var v2 = new Vector3([document.getElementById("v2x").value, document.getElementById("v2y").value])
    drawVector(v1, "red");
    drawVector(v2, "blue");
}
function handleDrawOperationEvent(){
    handleDrawEvent(); 
    var v1 = new Vector3([document.getElementById("v1x").value, document.getElementById("v1y").value, 0])
    var v2 = new Vector3([document.getElementById("v2x").value, document.getElementById("v2y").value, 0])
    var scalar = document.getElementById('scalar').value; 
    var op = String(document.getElementById("ops-select").value)
    //console.log(op); 
    if(op == "add"){
        drawVector(v1.add(v2), "green");
    }
    if(op == "sub"){
        drawVector(v1.sub(v2), "green");
    }
    if(op == "mul"){
        drawVector(v1.mul(scalar), "green");
        drawVector(v2.mul(scalar), "green");
    }
    if(op == "div"){
        drawVector(v1.div(scalar), "green");
        drawVector(v2.div(scalar), "green");
    }
    if(op == "mag"){
        console.log("Magnitude of v1:", String(v1.magnitude()))
        console.log("Magnitude of v2:", String(v2.magnitude()))
    }
    if(op == "norm"){
        drawVector(v1.normalize(), "green");
        drawVector(v2.normalize(), "green");
    }
    if(op == "ang"){
        angleBetween(v1, v2); 
    }
    if(op == "area"){
        areaOfTriangle(v1, v2);
    }
    function angleBetween(v1, v2){
        var dotp = Vector3.dot(v1, v2);
        var angle = Math.acos(dotp / (v1.magnitude() * v2.magnitude()))
        deg = angle * (180 / Math.PI); 
        console.log("Angle between the vectors: ", deg);
    }
    function areaOfTriangle(v1, v2){
        var crossp = Vector3.cross(v1, v2);
        var v3 = crossp.magnitude();
        var area = v3 / 2; 
        console.log("Area of the triangle: ", area);
    }
}
