let inputs = [];
let expected_results = [];
let data1 = [];
let data2 = [];
let ann, act_func, steps, n_steps, eta, cost;

let loadInputs = () => {
    n_steps = 0;
    let dat1 = [];
    let dat2 = [];
    inputs = JSON.parse(document.getElementById("l_inputs").value)
    expected_results = JSON
      .parse(document.getElementById("e_results").value);
    act_func = JSON.parse(document.getElementById("act_func").value);
    
    if (act_func==0)
        act_func = relu;
    else
        act_func = sigmoid;

    steps =  JSON.parse(document.getElementById("steps").value);
    eta = 0.001 * JSON.parse(document.getElementById("eta").value);
    ann = new NeuralNework([1,2,1], act_func, eta);
    if (inputs.length != expected_results.length)
        alert("Inputs and Expected results do not have the "+   
        "same size!");
    const len = inputs.length
    for (i = 0; i<len; i++){
        dat1.push({x: inputs[i], y:expected_results[i]});
        dat2.push({x: inputs[i], y:Math.random()});
    }
    if (data1.toString() != dat1.toString())
        data1 = dat1;
    if (data2.toString() != dat2.toString())
        data2 = dat2;
    trace();};

let trace = () => {
    // Set up the chart area
    const margin = { top: 20, right: 20, bottom: 30, left: 40 }; 
    const width = 300 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;
    if (document.getElementsByTagName('svg').length != 0){
        d3.select('svg').remove();
    }
    const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
    // Define scales for X and Y coordinates
    const xScale = d3.scaleLinear()
    .range([0, width]) // Scales the data points to a visible range within the plot
    .domain([d3.min(data1, (d) => d.x), d3.max(data1, (d) => d.x)]);
    
    const yScale = d3.scaleLinear()
    .range([height, 0]) // Scales the data points to a visible range within the plot
    .domain([d3.min(data1, (d) => d.y), d3.max(data1, (d) => d.y)]);
    // Define the scatterplot elements
    svg.selectAll(".dot1")
    .data(data1).enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return xScale(d.x); })
    .attr("cy", function(d) { return yScale(d.y); }) // Position the dot based on scales
    .attr("r", 4)
    .style("fill", "blue"); // Customize colors if needed
    
    svg.selectAll(".dot2")
    .data(data2)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", function(d) { return xScale(d.x); })
    .attr("cy", function(d) { return yScale(d.y); }) // Position the dot based on scales 
    .attr("r", 4)
    .style("fill", "green"); // Customize colors if needed
    }

let fowardPass = () => {
    data2.forEach(it => {
      ann.feedFoward(it.x);
      it.y = ann.outputs[0];
    });
    trace();
};

let batchSDG = () => {
    const nI = data2.length;
    let i;
    let s;
    for (s=0;s<steps;s++){
    for (i = 0;i<nI;i++){
        ann.feedFoward([data2[i].x]);
        data2[i].y = ann.outputs[0];
        ann.stepSDG([data1[i].y]);
        trace();
        document.getElementById("cost").innerHTML = cost.toFixed(4);
        document.getElementById("total-steps").innerHTML=n_steps.toString();
    }
    }
};

let runSimul = () => {
    for(n_steps=0;n_steps<10000;){
        let sum = 0.0;
        let len = data2.length;
        for (i=0;i<len;i++){
            sum += Math.pow(data2[i].y - expected_results[i],2);
        }
        cost = sum /(2*len);
        setTimeout(batchSDG,250);
        if (cost < 0.0001) break;
        n_steps += steps;
    }
};