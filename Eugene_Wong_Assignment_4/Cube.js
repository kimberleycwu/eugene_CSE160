//import { Matrix4, Vector3 } from "/lib/cuon-matrix-cse160";

class Cube {
    constructor() {
      this.type = 'cube';

      this.color = [1, 1, 1, 1.0];

      this.matrix = new Matrix4(); 
      this.textureNum = -2;
    }
  
    render() {
        var rgba = this.color;
        gl.uniform1i(u_whichTexture, this.textureNum);
  
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
   
        //Back face
        drawTriangle3DUVNormal([0,0,1, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
        // drawTriangle3D([0,0,1, 1,1,1, 1,0,1]);
        drawTriangle3DUVNormal([0,0,1, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);

        //Front face
        drawTriangle3DUVNormal([0,0,0, 1,1,0, 0,1,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
        drawTriangle3DUVNormal([0,0,0, 1,0,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);
        
        // Top face
        //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3DUVNormal([0,1,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
        drawTriangle3DUVNormal([0,1,0, 1,1,1, 0,1,1], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

        // // Bottom face
        drawTriangle3DUVNormal([0,0,0, 1,0,1, 1,0,0], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
        drawTriangle3DUVNormal([0,0,0, 0,0,1, 1,0,1], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

        // Left face
        //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);
        drawTriangle3DUVNormal([0,0,0, 0,1,0, 0,1,1], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);

        // Right face
        //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
        drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);
        drawTriangle3DUVNormal([1,0,0, 1,0,1, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    }
    renderfast(){
      var rgba = this.color; 
      gl.uniform1i(u_whichTexture, this.textureNum);
      gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
      gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

      var allverts = [];
      var alluvs = [];
      allverts = allverts.concat([0,0,1, 1,1,1, 1,0,1]);
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);
      allverts = allverts.concat([0,0,1, 0,1,1, 1,1,1]);
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);

      allverts = allverts.concat([0,0,0, 1,1,0, 0,1,0]);
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);
      allverts = allverts.concat([0,0,0, 1,0,0, 1,1,0]);
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);
      
      allverts = allverts.concat([0,1,0, 1,1,0, 1,1,1]);
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);
      allverts = allverts.concat([0,1,0, 1,1,1, 0,1,1]);
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);

      allverts = allverts.concat([0,0,0, 1,0,1, 1,0,0]);
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);
      allverts = allverts.concat([0,0,0, 0,0,1, 1,0,1]);  
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);
      
      allverts = allverts.concat([0,0,0, 0,1,1, 0,0,1]);
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);
      allverts = allverts.concat([0,0,0, 0,1,0, 0,1,1]);  
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);

      allverts = allverts.concat([1,0,0, 1,1,1, 1,1,0]);
      alluvs = alluvs.concat([0,0, 1,1, 1,0]);
      allverts = allverts.concat([1,0,0, 1,0,1, 1,1,1]);  
      alluvs = alluvs.concat([0,0, 0,1, 1,1]);
      drawTriangle3DUV(allverts, alluvs);
    }
}