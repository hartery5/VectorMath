let Npos = 40;
let vectors = [];
let tvectors = [];
let _PX1, _PY1, _PX2, _PY2;

let beginSelect = true;
let menuActive = false;
let isActive = false;
let i_Active = 0;

let SELECT;
let CLEAR;
let RANDOMIZE;
let ANSWER;
let textANSWER;

function setup() {
  let w = floor(windowWidth/Npos)*Npos;
  let h = floor(windowHeight/Npos)*Npos;
  createCanvas(w, h);
  textSize(18);
  textFont('Consolas');
  textStyle('bold');
  

  SELECT = createSelect();
  SELECT.style("font-family", "monospace");
  SELECT.style("font-weight", "bold");
  SELECT.position(125,40);
  SELECT.option("Freeform");
  SELECT.option("Practice");
  SELECT.selected("Freeform");
  
  CLEAR = createButton('CLEAR VECTORS');
  CLEAR.style("font-family", "monospace");
  CLEAR.style("font-weight", "bold");
  CLEAR.mousePressed(EMPTY);
  CLEAR.position(5,40);
  
  RANDOMIZE = createButton('RANDOMIZE');
  RANDOMIZE.style("font-family", "monospace");
  RANDOMIZE.style("font-weight", "bold");
  RANDOMIZE.mousePressed(createRANDOM);
  RANDOMIZE.position(5,80);
  RANDOMIZE.hide();
}

function draw() {
  background(220);

  push();
  stroke(150);
  setLineDash([5, 5]);
  for (let i = Npos; i < width; i += Npos) {
    line(i, 5*Npos, i, height);
  }
  for (let i = 5*Npos; i < height; i += Npos) {
    line(0, i, width, i);
  }
  pop();
  
  if (SELECT.selected() == 'Practice'){
    RANDOMIZE.show();
    if (beginSelect){
      let nums = [-2,-1,1,2];
      for (let i = 0; i<3; i++){
        let px1 = 8*Npos+5*i*Npos;
        let py1 = 2*Npos;
        let px2 = px1 + nums[int(random(0,4))]*Npos;
        let py2 = py1 + nums[int(random(0,4))]*Npos;
        let v = new vector(px1,py1,px2,py2);
        append(tvectors,v);
      }
      nums = [-2, -1, 0, 1, 2];
      let labs = ['A','B','C']
      ANSWER = new vector(0,0,0,0);
      textANSWER = '';
      let checksum = 0;
      for (let i=0; i<3; i++){
        let a = nums[int(random(0,5))];
        if (a==0){
          continue
        }
        ANSWER.v.x += a*tvectors[i].v.x;
        ANSWER.v.y += a*tvectors[i].v.y;
        if (a>=0){
          textANSWER += '+'
        } else {
          textANSWER += '-'
        }
        textANSWER += nf(abs(a));
        textANSWER += labs[i];
        textANSWER += ' ';
        checksum += a;
      }
      if (abs(checksum)>0){
        beginSelect = false;
      }
    } else {
      let labs = ['A','B','C']
      for (let i=0; i<tvectors.length; i++){
        tvectors[i].show();
        push();
        textAlign(CENTER, CENTER);
        let label = labs[i];
        label += ' = (';
        label += nf(tvectors[i].v.x/Npos);
        label += ', ';
        label += nfs(-tvectors[i].v.y/Npos);
        label += ')';
        text(label,8*Npos+5*i*Npos,4.5*Npos);
        pop();
      }
      text(textANSWER,5,125);
      let label = '';
      label += ' = (';
      label += nf(ANSWER.v.x/Npos);
      label += ', ';
      label += nfs(-ANSWER.v.y/Npos);
      label += ')';
      text(label,5,140);
    }
  } else {
    tvectors = [];
    beginSelect=true;
  }
  
  isActive = false;
  for (let i =0; i<vectors.length; i++){
    let dx = abs(mouseX-(vectors[i].r.x + vectors[i].v.x/2));
    let dy = abs(mouseY-(vectors[i].r.y + vectors[i].v.y/2));
    if ((dx<Npos/2) && (dy<Npos/2) && (!mouseIsPressed)){
      vectors[i].active = true;
      isActive = true;
      i_Active = i;
    } else {
      vectors[i].active = false;
    }
    vectors[i].show();
  }
}

function mousePressed() {
  menuActive = false;
  if (mouseY<5*Npos){
    menuActive = true;
    isActive = false;
  } else if (!isActive){
    menuActive = false;
    _PX1 = round(mouseX / Npos) * Npos;
    _PY1 = round(mouseY / Npos) * Npos;
    let v = new vector(_PX1, _PY1, mouseX, mouseY);
    append(vectors, v);
    i_Active = vectors.length-1;
    isActive = true;
  }
}

function mouseDragged(){
  if (!menuActive){
    if (!vectors[i_Active].done){
      vectors[vectors.length-1].update(mouseX, mouseY);
    } else {
      vectors[i_Active].r.x = mouseX - vectors[i_Active].v.x/2;
      vectors[i_Active].r.y = mouseY - vectors[i_Active].v.y/2;
    }
  }

}

function mouseReleased(){
  _PX2 = round(mouseX / Npos) * Npos;
  _PY2 = round(mouseY / Npos) * Npos;
  
  if (!menuActive){
    if (!vectors[i_Active].done){
      if (_PY2 < 5*Npos) {
        vectors.pop();
      } else {
        vectors[vectors.length-1].update(_PX2, _PY2);
        if (vectors[vectors.length-1].vmag<Npos){
          vectors.pop();
        }
        vectors[vectors.length-1].done=true;
      }
    } else if (isActive) {
      if (_PY2 < 5*Npos) {
        vectors.splice(i_Active,1);
      } else {
        _PX2 = round((mouseX - vectors[i_Active].v.x/2) / Npos) * Npos;
        _PY2 = round((mouseY - vectors[i_Active].v.y/2) / Npos) * Npos;
        vectors[i_Active].r.x = _PX2;
        vectors[i_Active].r.y = _PY2;
      }
    }
  }
}

function setLineDash(list) {
  drawingContext.setLineDash(list);
}

function createRANDOM(){
  tvectors = [];
  beginSelect=true;
}

function EMPTY(){
  vectors = [];
}