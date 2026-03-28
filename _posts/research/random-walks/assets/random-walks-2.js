(function() {

  // Parameters

  var margin = {top: 16, right: 16, bottom: 48, left: 32, inner: 0},
      width = 606 - margin.left - margin.right,
      walkHeight = 396,
      msdHeight = 288,
      height = walkHeight + msdHeight + margin.inner - margin.top - 
               margin.bottom;

  var xSteps = 54;
  var ySteps = 36;

  var startPos = [0,0];

  var numSteps = 100;
  var stepSize = 1;
  var numWalkers = 50;

  var walkDelay = 1500;
  var stepDelay = 10;
  var colorTransitionDur = 500;
  var pathTransitionDur = 10;

  var yMax = 200; // MSD axis max

  var xRange = d3.range(-xSteps/2, xSteps/2+1);
  var yRange = d3.range(-ySteps/2, ySteps/2+1);

  // X scale
  var xScale = d3.scale.ordinal()
      .domain(xRange)
      .rangeRoundBands([0, width], 0);  

  // Y scale
  var yScale = d3.scale.ordinal()
      .domain(yRange)
      .rangeRoundBands([0, walkHeight], 0);  

  // X MSD scale
  var xScaleMSD = d3.scale.linear()
      .domain([0, numSteps])
      .range([0, width]);

  // Y MSD scale
  var yScaleMSD = d3.scale.linear()
      .domain([0, yMax])
      .range([height, walkHeight + margin.inner]);

  // Draw SVG
  var svg = d3.select("article").append("svg")
      .classed("svg-canvas", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Y MSD axis  
  var yAxis = d3.svg.axis()
      .scale(yScaleMSD)
      .ticks(4)
      .orient("left");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // Draw X axis  
  var xAxis2 = d3.svg.axis()
      .scale(xScaleMSD)
      .orient("bottom");

  svg.append("g")
      .attr("id", "x-axis-2")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis2)
    .append("text")
      .attr("x", width/2)
      .attr("y",40)
      .style("text-anchor", "middle")
      .text("Number of steps");

  // Walker number in top right
  var walkNumText = svg.append("text")
      .attr("id", "walk-num-text-2")
      .attr("class", "svg-small-text")
      .style("text-anchor", "end")
      .attr("x", width)
      .attr("y", 4);

  var pathMSD = svg.append("path")
      .attr("class", "msd-path");

  var trendline = svg.append("line")
      .classed("trendline", true);

  // Slope text
  var eqText = svg.append("text")
      .attr("id", "eq-text")
      .style("text-anchor", "start")
      .attr("x", xScaleMSD(numSteps*1/4))
      .attr("y", yScaleMSD(yMax*2/3));

// Random Walk Functions

  function takeRandomStep(pos, stepSize) {

    var randomStep = Math.random();

    if (randomStep < 0.25) {
        pos_next = [pos[0], pos[1]-stepSize]; // Move up
    } else if (randomStep < 0.5) {
        pos_next = [pos[0]+stepSize, pos[1]]; // Move right
    } else if (randomStep < 0.75) {
        pos_next = [pos[0], pos[1]+stepSize]; // Move down
    } else {
        pos_next = [pos[0]-stepSize, pos[1]];// Move left
    }

    return pos_next;

    }  

  function takeRandomWalk(startPos, numSteps, stepSize) {

    var randomWalk = new Array();

    randomWalk[0] = startPos; // pass as variable

    for (i = 0; i < numSteps; i++) {
        randomWalk[i+1] = takeRandomStep(randomWalk[i], stepSize);
    }

    return randomWalk;
  }

  function takeRandomWalks(numWalkers, numSteps, startPos, stepSize) {

    var randomWalks = new Array(numWalkers);

    for (j = 0; j < numWalkers; j++) {

        var walk = takeRandomWalk(startPos, numSteps, stepSize);

        randomWalks[j] = walk; 

    }

    return randomWalks;

  }

  function getLineData(randomWalk) {

    var lineData = new Array();

    for (i = 0; i < randomWalk.length; i++) {
        lineData[i] = { "step":i, "x":randomWalk[i][0], "y":randomWalk[i][1] };
    }

    return lineData;

  }

  // Accessor function
  var lineFunction = d3.svg.line()
      .x(function(d) { return xScale(d.x); })
      .y(function(d) { return yScale(d.y); })
      .interpolate("linear");

  // Move the walker along the walk, draw a path
  function drawWalker(walkArray, walkPath, i, stepDelay, pathTransitionDur, 
                        colorTransitionDur) {
    setTimeout(function() {

      // console.log("Walker pos:" + walkArray[i]);

      var walkLineData = getLineData(walkArray)

      walkPath.transition()
        .duration(pathTransitionDur)
        .attr("d", lineFunction(walkLineData.slice(0,i+1)))

      i++;

      if (i < walkArray.length) {
          drawWalker(walkArray, walkPath, i, stepDelay);
      }

      else {
        walkPath.transition()
                // .duration(colorTransitionDur) // Makes line disappear?
                .attr("stroke", "rgb(208,199,198)")
                .attr("stroke-width", 1)
                .style("opacity", 0.25)
          // .attr("class", "walk-path-done");
      }

    }, stepDelay)
    return walkArray;   
  }

  function drawWalkers(walksArray, walkDelay, j, stepDelay, pathTransitionDur, 
                        colorTransitionDur, pathMSD) {

    // console.log("Walker:" + j);
    d3.select('#walk-num-text-2').text(j + "/" + numWalkers);

    setTimeout(function() {

      // The line SVG Path we draw
      var walkPath = svg.append("path")
                           .attr("class", "walk-path-2")
                           .attr("stroke", "rgb(189,54,19)")
                           .attr("stroke-width", 1)
                           .attr("fill", "none")
                           .style("opacity", 0.8);
                       // .attr("class", "walk-path-2");

      drawWalker(walksArray[j], walkPath, 0, stepDelay, pathTransitionDur, 
          colorTransitionDur);

      updateMSDLine(walksArray, pathMSD, numSteps, j);

      j++;

      // console.log("Walker:" + j);
      d3.select('#walk-num-text-2').text(j + "/" + numWalkers);

      if (j < walksArray.length) {
          drawWalkers(walksArray, walkDelay, j, stepDelay, 
            pathTransitionDur, colorTransitionDur, pathMSD);
      }

      else {
        msd = getMSD(walksArray, numSteps, j);
        stepRange = d3.range(0, numSteps);
        updateTrendline(trendline, stepRange, msd);
        drawPlayButton();
      }

    }, walkDelay);

  }

// MSD functions

  function getMSD(walksArray, numSteps, numWalkers) {

    var msd = new Array();

    for (i = 0; i <= numSteps; i++) {

      msd[i] = 0;

      for (j = 0; j < numWalkers; j++) {
          x = walksArray[j][i][0];
          y = walksArray[j][i][1];
          // d = Math.abs(x) + Math.abs(y); // This is Manhattan metric
          d = Math.sqrt(Math.pow(Math.abs(x),2) + Math.pow(Math.abs(y),2)); // This is Pythagorean metric

          msd[i] += Math.pow(d, 2);
      }

      if (numWalkers > 0) {
        msd[i] = msd[i]/numWalkers;
      }

    }

    return msd;
  }

  function getMSDLineData(msd) {

    var lineData = new Array();

    for (i = 0; i < msd.length; i++) {
        lineData[i] = { "step": i, "msd": msd[i] };
    }

    return lineData;
  }

  // Accessor function
  var lineFunctionMSD = d3.svg.line()
    .x(function(d) { return xScaleMSD(d.step); })
    .y(function(d) { return yScaleMSD(d.msd); });

  function updateMSDLine(walksArray, pathMSD, numSteps, numWalkers) {

    var msd = getMSD(walksArray, numSteps, numWalkers);

    // console.log(msd);

    MSDLineData = getMSDLineData(msd);

    // console.log(pathMSD);

    pathMSD.transition()
      .attr("d", lineFunctionMSD(MSDLineData));

  }

  function updateTrendline(trendline, xSeries, ySeries) {

    // console.log(xSeries);
    // console.log(ySeries);

    var leastSquaresCoeff = leastSquares(xSeries, ySeries);

    var slope = leastSquaresCoeff[0];
    var intercept = leastSquaresCoeff[1];
    var rSquare = leastSquaresCoeff[2];

    // console.log("slope: " + slope);
    // console.log("intercept: " + intercept);

    trendline
      .transition()
      .duration(walkDelay)
        .attr("x1", xScaleMSD(0.))
        .attr("y1", yScaleMSD(intercept))
        .attr("x2", xScaleMSD(numSteps))
        .attr("y2", yScaleMSD(numSteps*slope + intercept));

    // d3.select('#eq-text').text("y = " + format2d(slope) 
                                // + "x + " + format2d(intercept));

    var diff_coeff = slope/4.0;

    d3.select('#eq-text').text("D = " + format2d(diff_coeff));

  }

  // returns slope, intercept and r-square of the line
  // from: http://bl.ocks.org/benvandyke/8459843
  function leastSquares(xSeries, ySeries) {
    var reduceSumFunc = function(prev, cur) { return prev + cur; };
    
    var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
    var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

    var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
      .reduce(reduceSumFunc);
    
    var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
      .reduce(reduceSumFunc);
      
    var ssXY = xSeries.map(function(d, i) { 
        return (d - xBar)*(ySeries[i] - yBar); 
    })
      .reduce(reduceSumFunc);
      
    var slope = ssXY / ssXX;
    var intercept = yBar - (xBar * slope);
    var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
    
    return [slope, intercept, rSquare];
  }

  var format2d = d3.format("0.2f");


  function drawPlayButton() {

    play = svg.append("g")
        .attr("class", "play")
        .on("click", start);

    play.append("path")
        .attr("d", "M-48,-48L48,0L-48,48Z")
        .attr("transform", "translate(" + width / 2 + "," + 
                walkHeight / 2 + ")scale(.6)");

    play.append("rect")
        .attr("width", width)
        .attr("height", height);

  }

  function removePlayButton() {

    play.remove();

}

  function start() {

    svg.selectAll(".walk-path-2")
      .transition()
        .attr("d", lineFunction([]));

    removePlayButton();

    randomWalks = takeRandomWalks(numWalkers, numSteps, startPos, stepSize);

    // Initialise MSD line
    msd = getMSD(randomWalks, numSteps, 0);

    MSDLineData = getMSDLineData(msd);

    svg.selectAll("msd-path")
      .transition()
        .attr("d", lineFunctionMSD(MSDLineData));

    trendline
        .transition()
        .attr("x1", xScaleMSD(0.))
        .attr("y1", yScaleMSD(0.))
        .attr("x2", xScaleMSD(0.))
        .attr("y2", yScaleMSD(0.));

    d3.select('#eq-text').text("");    

    drawWalkers(randomWalks, walkDelay, 0, stepDelay, pathTransitionDur, 
        colorTransitionDur, pathMSD);

  }

  drawPlayButton();

})();