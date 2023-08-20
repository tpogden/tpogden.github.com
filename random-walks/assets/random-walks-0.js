(function() {

  // Parameters

  var margin = {top: 16, right: 16, bottom: 16, left: 16},
      // width = 594 - margin.left - margin.right,
      width = 928 - margin.left - margin.right,
      height = 32 - margin.top - margin.bottom;

  var walkerSize = 8;

  var startPos = 0;

  var xSteps = 20; // Number of steps across the x-axis

  var numSteps = 20;
  var stepSize = 1;

  var stepDelay = 1000;

  // var xRange = d3.range(-xSteps/2, xSteps/2);

  // var xScale = d3.scale.ordinal()
  //     .domain(xRange)
  //     .rangeRoundBands([0, width], 0);
  
  var xScale = d3.scale.linear()
      .domain([-xSteps/2, xSteps/2])
      .range([0, width]);

  var yScale = d3.scale.linear()
      .domain([0, 1])
      .range([0, height]);

  // Draw SVG
  var svg = d3.select("article").append("svg")
      .classed("svg-canvas", false)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Walker
  var walker = svg.append("circle");
  walker.attr("cx", xScale(startPos))
          .attr("cy", yScale(0.5))
          .attr("r", walkerSize)
          .classed("red-fill", true);

// Random Walk Functions

function takeRandomStep(pos, stepSize) {

    if (Math.random() < 0.5) {
        pos_next = pos + stepSize;
    } else {
        pos_next = pos - stepSize;
    }

    return pos_next;

}


function drawWalker(walker, pos, i, stepSize, stepDelay, numSteps) {
// Recursively moves the walker, returns it to 0 after numSteps. 
// Does not stop.

  setTimeout(function() {

    console.log("step: " + i);    
    console.log("Current pos:" + pos);

    var nextPos = takeRandomStep(pos, stepSize);

    walker.transition()
        .attr("cx", xScale(nextPos));    

    i++;

    if (i > numSteps) {
      i = 0;
      nextPos = 0;
      walker.transition()
        .attr("cx", xScale(nextPos));
    }

    drawWalker(walker, nextPos, i, stepSize, stepDelay, numSteps);

  }, stepDelay)

}

// Run

drawWalker(walker, startPos, 0, stepSize, stepDelay, numSteps);

})()