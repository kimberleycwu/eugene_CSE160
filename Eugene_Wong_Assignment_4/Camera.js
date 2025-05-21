class Camera {
    constructor() {
      this.eye = new Vector3([0, 0, 3]);
      this.at = new Vector3([0, 0, -100]);
      this.up = new Vector3([0, 1, 0]);
  
      this.yaw = -90;   
      this.pitch = 0;
      this.updateAt();
    }
  
    updateAt() {
      const radYaw = this.yaw * Math.PI / 180;
      const radPitch = this.pitch * Math.PI / 180;
      const dirX = Math.cos(radPitch) * Math.cos(radYaw);
      const dirY = Math.sin(radPitch);
      const dirZ = Math.cos(radPitch) * Math.sin(radYaw);
      const dir = new Vector3([dirX, dirY, dirZ]);
      dir.normalize();
  
      this.at = new Vector3([
        this.eye.elements[0] + dir.elements[0],
        this.eye.elements[1] + dir.elements[1],
        this.eye.elements[2] + dir.elements[2]
      ]);
    }
  
    panLeft() {
      this.yaw += 5;
      this.updateAt();
    }
  
    panRight() {
      this.yaw -= 5;
      this.updateAt();
    }
  
    moveForward(distance) {
      const forward = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2],
      ]);
      forward.normalize();
      forward.mul(distance);
      this.eye.add(forward);
      this.at.add(forward);
    }
  
    strafeRight(distance) {
      const forward = new Vector3([
        this.at.elements[0] - this.eye.elements[0],
        this.at.elements[1] - this.eye.elements[1],
        this.at.elements[2] - this.eye.elements[2],
      ]);
      const right = Vector3.cross(forward, this.up);
      right.normalize();
      right.mul(distance);
      this.eye.add(right);
      this.at.add(right);
    }
    moveUp(distance) {
        const upMove = new Vector3(this.up.elements);
        upMove.normalize();
        upMove.mul(distance);
        this.eye.add(upMove);
        this.at.add(upMove);
      }
  }
  