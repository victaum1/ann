const relu = (f) => {
    let fun = (x) => {
        if(x>0) return x;
        if (x==0) return 0.5;
        return 0.0;
    };
    let funPrime = (x) =>{
        return sigmoid(0)(x);
    };
    if (f == 0) return fun;
    if (f == 1) return funPrime;
    return undefined};

const sigmoid = (f) => {
    let fun = (x) => {
        return 1.0 / (1.0 + Math.exp(-x));
    };
    let funPrime = (x) => {
        return fun(x)*(1.0 - fun(x));
    };
    if (f == 0)
        return fun;
    if (f == 1)
        return funPrime;
    return undefined};

class Neuron{
  constructor(num_inputs, act_func, bias,id){
    this.bias = bias;
    this.actFunc = act_func;
    this.id = id;
    if (this.id[0] == 0)
      this.type="input";
    else
      this.type=""; 
    this.num_inputs = num_inputs;
    this.weights = this.makeWeights();
    this.outputs = [];
  }
  makeWeights(){
    if (this.type == "input")
      return undefined;
    return randomVec(this.num_inputs);
  }
  setInputs(inp){
    if (inp.length != this.num_inputs){
      alert("Wrong number of inputs, setInputs");
      return undefined;}
    this.inputs = inp;
  }
  foward(inp){
    if(!inp){
      ;
    }else{
      this.setInputs(inp);
    };
    if (this.type == "input"){
      this.output = this.inputs[0];
    }else{
      this.z = dot(this.weights,this.inputs) + this.bias;
      this.output = this.actFunc(0)(this.z);
    };
  }
  backProp(delta){
    let nabla = {};
    nabla.nBias = delta;
    nabla.nWeights = by(this.inputs,delta);
    return nabla;
  }
  updateBias(delta, eta){
    this.bias -= eta*delta;
  }
  updateWeights(deltas, eta){
    let jL = shape(this.weights)[0];
    let dL = shape(deltas)[0];
    if (jL != dL){
      alert("Wrong sizes between deltas and weights, updateWeights");
      return undefined;
    };
    for (let j = 0; j<jL; j++){
      this.weights[j] -= eta * deltas[j]
    }
  }
}

class NeuralNework{
  constructor(layers=[1,1], act_func=relu, eta=0.1){
    this.nodesPerLayer = layers;
    this.num_layers = layers.length;
    this.actFunc = act_func;
    this.eta = eta;
    this.nodes = this.makeNodes();
  }
  setExpectedOutputs(e_o){
    let nL = this.nodes[this.num_layers-1].length
    if (nL != e_o.length){
      alert("Wrong number of expected outputs, setExpectedOutputs");
    };
    this.expected_outputs = e_o;
  }
  makeNodes(){
    let mat = []; 
    for (let i = 0; i<this.num_layers; i++){
      let vec = [];
      for(let j=0;j<this.nodesPerLayer[i];j++){
        if (i == 0){
          vec.push(new Neuron(1,this.actFunc,0.0,[i,j]))
        } else 
          vec.push(new Neuron(this.nodesPerLayer[i-1],this.actFunc,0.0,[i,j]))
      }
      mat.push(vec);
    }
    return mat;
  }
  feedFoward(inputs){
    let nI = this.nodes[0].length;
    if(nI != inputs.length){
      alert("Wrong number of inputs, feedFoward");
      return undefined;
    };
    let activations = inputs;
    for (let i = 0;i<this.num_layers;i++){
      this.nodes[i].forEach(it => {
        it.foward(activations);
      });
      activations = [];
      this.nodes[i].forEach(it => {
        activations.push(it.output);
      });
  }
  this.outputs = activations;
  }
  getZ(l){
    let zL=[];
    this.nodes[l].forEach(it => {
      zL.push(it.z);
    });
    return zL;
  }
  getZprime(l){
    let zL = this.getZ(l);
    let res = byFunc(this.actFunc(1),zL);
    return res;
  }
  getInitDelta(){
    let nabla_cost = itemSub(this.outputs,this.expected_outputs);
    let zprime = this.getZprime(this.num_layers-1);
    let deltaL = itemBy(nabla_cost, zprime);
    return deltaL;
  }
  getWeights(l){
    let layer = ann.nodes[l];
    let res = [];
    layer.forEach(it =>{
      res.push(it.weights);
    });
    return res;
  }
  getBiases(l){
    let layer = ann.nodes[l];
    let res = [];
    layer.forEach(it =>{
      res.push(it.bias);
    });
    return res;
  } 
  getDelta(l){
    if (l==this.num_layers-1)
      return this.getInitDelta();
    else{
      let kL = this.nodes[l+1].length;
      let jL = this.nodes[l].length;
      let res = mkVec(jL,zero);
      for (let j = 0;j<jL;j++){
        let sum = 0.0;
        for(let k = 0;k<kL;k++){
          sum += this.getWeights(l+1)[k][j]*this.getDelta(l+1)[k];
        }
        res[j] = sum;
      }
      res = itemBy(res,this.getZprime(l));
      return res;
    };
  }
  backProp(){
    let kL,delta ,nodes, nLayer, nabla;
    nLayer = [];
    for(let l = this.num_layers-1;l>=1;l--){
      delta = this.getDelta(l);
      nodes = this.nodes[l];
      kL = shape(nodes)[0];
      nabla = [];
      for (let k = 0;k<kL;k++){
        nabla.push(nodes[k].backProp(delta[k]));
      }
      nLayer.push(nabla);
    }
    nLayer = reverseVec(nLayer);
    return nLayer;
  }
  updateBiases(grad_cost){
    const nL = shape(this.nodes)[0], gL = shape(grad_cost)[0];
    let kL; 
    if (nL-1!= gL){
      alert("Wrong number of layers, updateBiases");
      return undefined;
    };
    for(let l = nL-1;l>=1;l--){
      kL = this.nodes[l].length;
      for(let k = 0;k<kL;k++){
        this.nodes[l][k].updateBias(grad_cost[l-1][k].nBias,this.eta);
      }
    }
  }
  updateWeights(grad_cost){
    const nL = shape(this.nodes)[0], gL = shape(grad_cost)[0];
    let kL; 
    if (nL-1!= gL){
      alert("Wrong number of layers, updateBiases");
      return undefined;
    };
    for(let l = nL-1;l>=1;l--){
      kL = this.nodes[l].length;
      for(let k = 0;k<kL;k++){
        this.nodes[l][k].updateWeights(grad_cost[l-1][k].nWeights,this.eta);
      }
    }
  }
  stepSDG(e_o){
    this.setExpectedOutputs(e_o);
    let gradCost = this.backProp();
    this.updateBiases(gradCost);
    this.updateWeights(gradCost);
  }
}
