(function() {

  var margin = {top: 16, right: 16, bottom: 48, left: 48, inner: 32},
      width = 606 - margin.left - margin.right,
      walkHeight = 288,
      histHeight = 288,
      height = walkHeight + histHeight + margin.inner - margin.top - 
               margin.bottom;

  var xSteps = 20,
      xRange = d3.range(-xSteps/2, xSteps/2+1);

// Walk parameters

  var ySteps = 20;

  var startXPos = 0;

  var numSteps = 20;
  var stepSize = 1;

  var numWalkers = 100;

  var stepDelay = 50;
  var walkDelay = 1000;

  var colorTransitionDur = 500;
  var pathTransitionDur = 10;

// Hist parameters

  var yMax = 20;

  var transitionDuration = 500;
  var updateDelay = 500;

  // Draw SVG
  var svg = d3.select("article").append("svg")
      .classed("svg-canvas", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // X scale
  var xScale = d3.scale.ordinal()
      .domain(xRange)
      .rangeRoundBands([0, width], 0);

  // X axis
  var xAxis1 = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(xRange);

  svg.append("g")
      .attr("id", "x-axis-1")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis1);

  // Walk scale
  var yScale = d3.scale.linear()
                .domain([0, ySteps])
                .range([0, walkHeight]);

  // Y Histogram scale
  var yScaleHist = d3.scale.linear()
      .range([height, walkHeight + margin.inner])
      .domain([0, yMax]);

  // Y axis  
  var yAxis = d3.svg.axis()
      .scale(yScaleHist)
      // .ticks(6)
      .orient("left");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Walker number in top right
  var walkNumText = svg.append("text")
      .attr("id", "walk-num-text-1")
      .attr("class", "svg-small-text")
      .style("text-anchor", "end")
      .attr("x", width)
      .attr("y", 4);

  // Initial, empty histogram
  var dataHist = d3.layout.histogram()
    .range([-10,11])
    .bins(21)
    ([]);

  // console.log(dataHist);

  // Draw initial bars
  var barRects = svg.selectAll("rect")
      .data(dataHist)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + xScale(d.x) 
            + "," + yScaleHist(d.y) + ")"; }) 
      .attr("width", xScale.rangeBand())
      .attr("height", function(d) { return height - yScaleHist(d.y); });

// Random Walk Functions

  function takeRandomStep(pos, stepSize) {
    
      if (Math.random() < 0.5) {
          pos_next = pos + stepSize;
      } else {
          pos_next = pos - stepSize;
      }

      return pos_next;
  }

  function takeRandomWalk(numSteps, stepSize) {
      
      var randomWalk = new Array();
      randomWalk[0] = startXPos; // pass as variable

      for (i = 0; i < numSteps; i++) {
          randomWalk[i+1] = takeRandomStep(randomWalk[i], stepSize);
      }

      return randomWalk;
  }

  function takeRandomWalks(numWalkers_, numSteps_, stepSize_) {

      var randomWalks = new Array(numWalkers_);

      for (j = 0; j < numWalkers_; j++) {
          randomWalks[j] = takeRandomWalk(numSteps_, stepSize_);
      }

      return randomWalks;
  }

  function getLineData(randomWalk) {

      var lineData = new Array();
 
      for (i = 0; i < randomWalk.length; i++) {
          lineData[i] = { "step": i, "pos": randomWalk[i] };
      }
 
      return lineData;
  }

  // Accessor function
  var lineFunction = d3.svg.line()
      .x(function(d) { return xScale(d.pos); })
      .y(function(d) { return yScale(d.step); })
      .interpolate("linear");

  // Move the walker along the walk, draw a path
  function drawWalker(walkArray, walkPath, i, stepDelay_) {
      setTimeout(function() {

          // console.log("Walker pos:" + walkArray[i]);

          var walkLineData = getLineData(walkArray)

          walkPath.transition()
            .duration(pathTransitionDur)
            .attr("d", lineFunction(walkLineData.slice(0,i+1)))

          i++;

          if (i <= walkArray.length) {
              drawWalker(walkArray, walkPath, i, stepDelay);
          }

          else {

              walkPath.transition()
                .duration(colorTransitionDur)
                .attr("stroke", "rgb(208,199,198)")
                .attr("stroke-width", 1)
                .style("opacity", 0.25)

          }

      }, stepDelay_)
      return walkArray;   
  }

  function drawWalkers(walksArray, endPoints, walkDelay, j) {

      setTimeout(function() {

          // console.log("Walker:" + j);

          // The line SVG Path we draw
          var walkPath = svg.append("path")
                           .attr("class", "walk-path-1")
                           .attr("stroke", "rgb(189,54,19)")
                           .attr("stroke-width", 2)
                           .attr("fill", "none")
                           .style("opacity", 0.8);

          drawWalker(walksArray[j], walkPath, 0, stepDelay);

          // console.log(endPoints.slice(0, j));

          updateBars(endPoints.slice(0, j));

          d3.select('#walk-num-text-1').text(j + "/" + numWalkers);

          j++;

          if (j <= walksArray.length) {

              drawWalkers(walksArray, endPoints, walkDelay, j);

          }

          else {

            // play_1.style("display", null);

            drawPlayButton();

          }

      }, walkDelay);

  }

  function updateBars(dataPoints) {

      var dataHist = d3.layout.histogram()
        .range([-10,11])
        // .bins([-10,11])
        // .bins(xRange)
        .bins(21)
        (dataPoints);

      svg.selectAll("rect")
          .data(dataHist)
        .transition()
          .duration(transitionDuration)
          .ease("bounce")
          .attr("transform", function(d) { return "translate(" + xScale(d.x) 
                + "," + yScaleHist(d.y) + ")"; })
          .attr("height", function(d) { return height - yScaleHist(d.y); });

  }

  function getWalkEndPoints(walksArray) {

      var endPoints = new Array();

      for (k = 0; k < walksArray.length; k++) {

        endPoints[k] = walksArray[k][numSteps];

      }

      return endPoints;

  }

  function drawPlayButton() {

    play_1 = svg.append("g")
        .attr("class", "play")
        .on("click", start);

    play_1.append("path")
        .attr("d", "M-48,-48L48,0L-48,48Z")
        .attr("transform", "translate(" + width / 2 + "," 
                                        + walkHeight / 2 + ")scale(.6)");

    play_1.append("rect")
        .attr("width", width)
        .attr("height", height);

  }

  function removePlayButton() {

    play_1.remove();

  }

  function start() {

    svg.selectAll(".walk-path-1")
      .transition()
        .attr("d", lineFunction([]));

    removePlayButton();

    randomWalks = takeRandomWalks(numWalkers, numSteps, 1);

    // console.log(randomWalks);

    endPoints = getWalkEndPoints(randomWalks);

    // console.log(endPoints);

    drawWalkers(randomWalks, endPoints, walkDelay, 0);

  }

// Run

drawPlayButton();

})()