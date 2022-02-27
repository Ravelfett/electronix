class Component{
  constructor(type, x, y, inputCount, outputCount){
    this.type = type;
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = Math.max(inputCount, outputCount);
    this.inputCount = inputCount;
    this.inputs = [];
    for(let i = 0; i < inputCount; i++){
      this.inputs.push(new Input(this, -0.5, -(inputCount-1)/2+i));
    }
    this.outputCount = outputCount;
    this.outputs = [];
    for(let i = 0; i < outputCount; i++){
      this.outputs.push(new Output(this, 0.5, -(outputCount-1)/2+i));
    }
  }

  update(){
    this.getInputs();
    this.setOutputs();
  }

  getInputs(){
    for(let i in this.inputs){
      this.inputs[i].setValue();
    }
  }
  setOutputs(){
  }

  renderWires(ctx){
    for (let i in this.inputs) {
      if (this.inputs[i].wire != null) {
        const other = this.inputs[i].wire.input;
        if (other.on) {
          ctx.strokeStyle = "rgb(198, 163, 131)";
        }else {
          ctx.strokeStyle = "rgb(82, 76, 71)";
        }
        ctx.beginPath();
        ctx.moveTo(this.x + this.w/2 + this.inputs[i].xOffset, this.y + this.h/2 + this.inputs[i].yOffset);
        ctx.lineTo(other.parent.x+other.parent.w/2+other.xOffset, other.parent.y+other.parent.h/2+other.yOffset);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }

  render(ctx){
    for(let i in this.inputs){
      this.inputs[i].render(ctx);
    }
    for(let i in this.outputs){
      this.outputs[i].render(ctx);
    }
    ctx.beginPath();
    ctx.fillStyle = "rgb(108, 165, 217)";
    ctx.rect(this.x, this.y, this.w, this.h);
    ctx.fill();
    ctx.closePath();
  }
}

// connections
class Input{
  constructor(parent, x, y){
    this.on = false;
    this.wire = null;
    this.parent = parent;
    this.xOffset = x;
    this.yOffset = y;
  }

  setValue(){
    if (this.wire == null) {
      this.on = false;
    }else{
      this.on = this.wire.getState();
    }
  }

  render(ctx){
    ctx.beginPath();
    ctx.fillStyle = "rgb(108, 165, 217)";
    ctx.arc(this.parent.x + this.parent.w/2 +this.xOffset, this.parent.y + this.parent.h/2 + this.yOffset, 0.1, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}
class Output{
  constructor(parent, x, y){
    this.on = false;
    this.parent = parent;
    this.xOffset = x;
    this.yOffset = y;
  }

  getState(){
    return this.on;
  }

  render(ctx){
    ctx.beginPath();
    ctx.fillStyle = "rgb(108, 165, 217)";
    ctx.arc(this.parent.x + this.parent.w/2 +this.xOffset, this.parent.y + this.parent.h/2 + this.yOffset, 0.1, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}
class Wire{
  constructor(input, output){
    this.input = input;
    //this.output = output;
  }

  getState(){
    return this.input.getState();
  }
}

// components
const componentTypes = {
  button: 0,
  light: 1,
  notGate: 2,
  andGate: 3,
  norGate: 4,
}

class Button extends Component{
  constructor(x = 0, y = 0){
    super(componentTypes.button, x, y, 0, 1);
    this.pressed = false;
  }

  setOutputs(){
    this.outputs[0].on = this.pressed;
  }

  render(ctx){
    super.render(ctx);
    ctx.beginPath();
    if (this.pressed) {
      ctx.fillStyle = "rgb(190, 190, 190)";
    }else {
      ctx.fillStyle = "rgb(59, 59, 59)";
    }
    ctx.rect(this.x+0.5/4, this.y+0.5/4, 0.75, 0.75);
    ctx.fill();
    ctx.closePath();
  }
}
class NotGate extends Component{
  constructor(x = 0, y = 0){
    super(componentTypes.notGate, x, y, 1, 1);
  }

  setOutputs(){
    this.outputs[0].on = !this.inputs[0].on;
  }

  render(ctx){
    super.render(ctx);
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.moveTo(this.x+this.w/2-25/100, this.y+this.h/2-25/100);
    ctx.lineTo(this.x+this.w/2+25/100, this.y+this.h/2);
    ctx.lineTo(this.x+this.w/2-25/100, this.y+this.h/2+25/100);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.x+this.w/2+25/100, this.y+this.h/2, 0.1, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}

class AndGate extends Component{
  constructor(x = 0, y = 0){
    super(componentTypes.andGate, x, y, 2, 1);
  }

  setOutputs(){
    this.outputs[0].on = this.inputs[0].on && this.inputs[1].on;
  }

  render(ctx){
    super.render(ctx);
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.rect(this.x+this.w/2-0.25, this.y+this.h/2-0.25, 0.25, 0.5);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.x+this.w/2, this.y+this.h/2, 0.25, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.x+this.w*3/4, this.y+this.h/2, 0.1, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}

class NorGate extends Component{
  constructor(x = 0, y = 0){
    super(componentTypes.norGate, x, y, 2, 1);
  }

  setOutputs(){
    this.outputs[0].on = !(this.inputs[0].on || this.inputs[1].on);
  }

  render(ctx){
    super.render(ctx);
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.moveTo(this.x+this.w/2-25/100, this.y+this.h/2-25/100);
    ctx.lineTo(this.x+this.w/2+25/100, this.y+this.h/2);
    ctx.lineTo(this.x+this.w/2-25/100, this.y+this.h/2+25/100);
    ctx.lineTo(this.x+this.w/2-10/100, this.y+this.h/2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.x+this.w/2+25/100, this.y+this.h/2, 0.1, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}

class Light extends Component{
  constructor(x = 0, y = 0){
    super(componentTypes.light, x, y, 1, 0);
    this.on = false;
  }

  update(){
    super.update();
    this.on = this.inputs[0].on;
  }

  render(ctx){
    super.render(ctx);
    ctx.beginPath();
    if (this.on) {
      ctx.fillStyle = "rgb(255, 237, 0)";
    }else {
      ctx.fillStyle = "rgb(51, 54, 2)";
    }
    ctx.arc(this.x+0.5, this.y+0.5, 0.35, 0, Math.PI*2, false);
    ctx.fill();
    ctx.closePath();
  }
}
