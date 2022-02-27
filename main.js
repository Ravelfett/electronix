const canvas = document.getElementById("cnv");
const context = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;


function resize() {
  width = window.innerWidth,
    height = window.innerHeight,
    ratio = window.devicePixelRatio;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = width + "px";
  canvas.style.height = height + "px";
  context.scale(ratio, ratio);
}
window.onresize = function() {
  resize();
};
window.onload = function() {
  resize();
  window.requestAnimationFrame(render);
}

document.addEventListener('contextmenu', event => event.preventDefault());

document.addEventListener('mousemove', (p) => {
  const t = canvas.getBoundingClientRect();
  mouse[0] = (p.pageX - t.left);
  mouse[1] = (p.pageY - t.top);
}, false);

document.onmousedown = function(e) {
  if (e.button == 0) {
    for(let i in components){
      if (components[i].type == componentTypes.button) {
        if(mouse[0]/zoom > components[i].x && mouse[1]/zoom > components[i].y &&
        mouse[0]/zoom < components[i].x+components[i].w && mouse[1]/zoom < components[i].y+components[i].h){
          components[i].pressed = !components[i].pressed;
        }
      }
    }
  }
  if (e.button == 2) {
    for(let i in components){
      if(mouse[0]/zoom > components[i].x && mouse[1]/zoom > components[i].y &&
      mouse[0]/zoom < components[i].x+components[i].w && mouse[1]/zoom < components[i].y+components[i].h){
        moving = components[i];
        mouv = true;
        offset = [components[i].x-mouse[0]/zoom, components[i].y-mouse[1]/zoom];
      }
    }
  }
};

document.onmouseup = function(e) {
  if (e.button == 0) {
  }
  if (e.button == 2) {
    mouv = false;
  }
};

const mouse = [0, 0];
let zoom = 80;
let offset = [];
let mouv = false;
let moving = null;

const components = [];

const button1 = new Button(5, 2);
components.push(button1);

const button2 = new Button(5, 6);
components.push(button2);

const norGate1 = new NorGate(8, 2);
const norGate2 = new NorGate(8, 5);
norGate1.inputs[0].wire = new Wire(button1.outputs[0]);
norGate1.inputs[1].wire = new Wire(norGate2.outputs[0]);
norGate2.inputs[0].wire = new Wire(norGate1.outputs[0]);
norGate2.inputs[1].wire = new Wire(button2.outputs[0]);
components.push(norGate1);
components.push(norGate2);

const light = new Light(11, 2);
light.inputs[0].wire = new Wire(norGate1.outputs[0]);
components.push(light);

const light1 = new Light(11, 6);
light1.inputs[0].wire = new Wire(norGate2.outputs[0]);
components.push(light1);



function render() {
  context.clearRect(0, 0, width, height);
  context.beginPath();
  context.fillStyle = "#33004C";
  context.rect(0, 0, width, height);
  context.fill();
  context.closePath();

  if (mouv) {
    moving.x = Math.floor((offset[0]+mouse[0]/zoom)*4)/4;
    moving.y = Math.floor((offset[1]+mouse[1]/zoom)*4)/4;
  }

  for(let i in components){
    components[i].update();
  }

  context.lineWidth = 0.1;
  context.scale(zoom, zoom);
  for(let i in components){
    components[i].renderWires(context);
  }
  for(let i in components){
    components[i].render(context);
  }
  context.setTransform(1, 0, 0, 1, 0, 0);

  window.requestAnimationFrame(render);
}
