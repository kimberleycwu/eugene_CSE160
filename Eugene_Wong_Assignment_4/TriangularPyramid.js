// import { Matrix4, Vector3 } from "/lib/cuon-matrix-cse160";

class triangularPyramid {
    constructor() {
        this.type = 'triangularPyramid';
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4(); 
    }

    render() {
        var rgba = this.color;
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var v0 = [0.0, 0.0, 0.0];  
        var v1 = [1.0, 0.0, 0.0];  
        var v2 = [0.0, 0.0, 1.0];  
        var v3 = [0.5, 1.0, 0.5];  

        // Base (right triangle)
        drawTriangle3D([...v0, ...v1, ...v2]);

        // Side 1
        gl.uniform4f(u_FragColor, rgba[0]*0.95, rgba[1]*0.95, rgba[2]*0.95, rgba[3]);
        drawTriangle3D([...v0, ...v1, ...v3]);

        // Side 2
        gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        drawTriangle3D([...v1, ...v2, ...v3]);

        // Side 3
        //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
        gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
        drawTriangle3D([...v2, ...v0, ...v3]);
    }
}
