class Triangle{
    constructor(){
        this.type = 'triangle';
        this.position = [0.0, 0.0, 0.0];
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.size = 5.0;
        this.vertex1Offset = [1.0, 0.0]; 
        this.vertex2Offset = [0.0, 1.0];

    }
    render(){
      var xy = this.position;
      var rgba = this.color;
      var size = this.size;
  
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniform1f(u_Size, size);
  
      var scale = size / 200.0;  // or adjust based on canvas size
      let x = xy[0];
      let y = xy[1];
  
      let x1 = x + this.vertex1Offset[0] * scale;
      let y1 = y + this.vertex1Offset[1] * scale;
  
      let x2 = x + this.vertex2Offset[0] * scale;
      let y2 = y + this.vertex2Offset[1] * scale;
  
      drawTriangle([x, y, x1, y1, x2, y2]);
  }  
}

function drawTriangle(vertices) {
    //   var vertices = new Float32Array([
    //     0, 0.5,   -0.5, -0.5,   0.5, -0.5
    //   ]);
      var n = 3; // The number of vertices
    
      // Create a buffer object
      var vertexBuffer = gl.createBuffer();
      if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
      }
    
      // Bind the buffer object to target
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      // Write date into the buffer object
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
      //gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    

      // Assign the buffer object to a_Position variable
      gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
    
      // Enable the assignment to a_Position variable
      gl.enableVertexAttribArray(a_Position);
    
      gl.drawArrays(gl.TRIANGLES, 0, n)
      return n;
    }