const  mkVec = (n,func) =>{
    let res = [];
    if (n==undefined)
      return res;
    if(func==undefined){
      for (let i = 0; i<n; i++){
        res.push(0.0);
      }
      return res;
    }
    for (let i = 0; i<n; i++){
      res.push(func());
    }
    return res;
    };

const reverseVec = (vec) => {
  const n = shape(vec)[0];
  let i, res = mkVec(n);
  for (i = 0;i<n;i++){
    res[i] = vec[n-i-1];
  }
  return res;
};

const mkMatrix = (n,m,func) => {
  if (n != undefined && m != undefined){
    let res = [];
    for (i = 0;i<n;i++){
      res.push(mkVec(m,func));
    }
    return res;
  };
  if (n != undefined && m == undefined){
    return mkVec(n,func);
  };
};

const zero = () => {
  return 0,0;
};

const zeroes = (n,m) =>{
    if (!n)
      return zero();
    if (!m)
      return mkVec(n);
    let res = mkMatrix(n,m)
    return res;
  };

const shape = (x,res) => {
  if (!res){
    let _res = shape(x,[]);
    return _res;
  }
  if(!x.length){
    let _res = res;
    return _res;
  }
  if(x.length){
    let _res = res;
    _res.push(x.length);
    _res = shape(x[0],_res);
    return _res;
  }
  return undefined;
}

const transpose = (x) => {
  const xShape = shape(x);
  if (xShape.length == 2){
    const n = xShape[1];
    const m = xShape[0]; 
    let res = mkMatrix(n,m,zero);
    for(let i = 0;i<n;i++){
      for(let j = 0;j<m;j++){
        res[i][j] = x[j][i];
      }
    }
    return res;
  }
};

const matrixMuliply = (x,y) => {
  const xShape = shape(x);
  const yShape = shape(y);
  const n = xShape[0];
  const m = yShape[1];
  const kL = yShape[0];
  let res = mkMatrix(n,m,zero);
  for (let i = 0;i<n;i++){
    for(let j = 0;j<m;j++){
      for(let k = 0;k<kL;k++){
        res[i][j] += x[i][k]*y[k][j];
      }
    }
  }
  return res;
  };

const by = (x,y) => {
  let xShape = shape(x);
  let yShape = shape(y);
  if(yShape.length==0){
    let scalar = mkMatrix(xShape[0],xShape[1],()=>y);
    let res = itemBy(x,scalar);
    return res;
  };
  if (xShape[1]==yShape[0]){
    return matrixMuliply(x,y);
  };
}

const byFunc = (func,x) => {
  let xShape = shape(x);
  if (xShape.length==1){
    let n = xShape[0];
    let res = zeroes(n);
    for(let i = 0; i<n; i++){
      res[i] = func(x[i]);
    }
    return res;
  };
  if (xShape.length==2){
    let n = xShape[0], m = xShape[1];
    let res = zeroes(n,m);
    for (let i = 0; i<n; i++){
      for(let j = 0; j<m; j++){
        res[i][j] = func(x[i][j]);
      }
    }
    return res;
  };
  return undefined;
};

const itemBinFunc = (x,y,binOp) =>{
  const xShape = shape(x), yShape=shape(y);
  if (JSON.stringify(xShape) != JSON.stringify(yShape)) {
    alert("Matrices with wrong dimentions!");
    return undefined;};
  if (xShape.length==1){
  let n = xShape[0];
  let res = zeroes(n);
  for(let i = 0;i<n; i++){
    res[i] = binOp(x[i],y[i]);
  }
  return res;
  };
  if(xShape.length=2){
  let nx = xShape[0], mx = xShape[1];
  let res = zeroes(nx,mx);
  for(let i = 0; i<nx; i++){
    for(let j = 0; j<mx; j++){
      res[i][j] = binOp(x[i][j],y[i][j]);
    }}
  return res;};
  return undefined;
};

const itemBy = (x,y) => {
  const op = (x,y) =>{return x*y};
  let res = itemBinFunc(x,y,op);
  return res;
};

const itemAdd = (x,y) => {
  const op = (x,y) =>{return x+y};
  let res = itemBinFunc(x,y,op);
  return res;
};

const itemSub = (x,y) => {
  const op = (x,y) => {return x-y};
  let res = itemBinFunc(x,y,op);
  return res;
};

const sumAll = (x) => {
  const xShape = shape(x);
  let sum = 0.0;
  if (xShape.length==1){
    const n = xShape[0];
    for(let i = 0;i<n;i++){
      sum += x[i];
    }
    return sum;
  };
  if (xShape.length==2){
  const n = xShape[0];
  const m = xShape[1];
  for (let i = 0; i<n; i++){
    for (let j=0;j<m;j++){
      sum += x[i][j];
    }
  }
  return sum;
  };
  return undefined;
};

const dot = (x,y) =>{
  let mat = itemBy(x,y)
  let res = sumAll(mat);
  return res;
};