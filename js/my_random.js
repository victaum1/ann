const randomSign = () => {
    if (Math.random()> 0.5)
        return -1;
    return 1;}            

const randomNumber = () => {
    return randomSign() * Math.random();}

const  randomVec = (n) => {
    let vec = zeroes(n);
    for (var i = 0; i<n;i++){
        vec[i] = randomNumber();}
    return vec;}

const randomMatrix = (n,m) => {
    let mat = zeroes(n,m);
    for (let i = 0;i<n;i++){
      for(let j=0;j<m;j++){
        mat[i][j]=randomNumber();
      }
    }
  return mat;};

