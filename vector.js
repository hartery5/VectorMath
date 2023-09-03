class vector{
  constructor(x1,y1,x2,y2){
    this.r = createVector(x1, y1)
    this.v = createVector(x2-x1, y2-y1);
    this.vmag = this.v.mag();
    this.theta = this.v.heading();
    this.active = false;
    this.done = false;
  }
  
  update(x,y){
    this.v.x = x - this.r.x;
    this.v.y = y - this.r.y;
    this.vmag = this.v.mag();
    this.theta = this.v.heading();
  }
  
  show(){
    push();
    strokeWeight(3);
    if (this.active){
      fill(200,0,0);
      stroke(200,0,0);
    } else {
      fill(0);
      stroke(0);
    }
    translate(this.r.x,this.r.y);
    rotate(this.theta);
    line(0,0,this.vmag-8,0);
    translate(this.vmag-8,0);
    triangle(0,5,8,0,0,-5);
    pop();
  }
  
}