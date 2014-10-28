(function() {

  var boxLength = 10.0;
  var num_points = 50;
  var circleRad = 6;
  var delay = 50;

  // var jsonFile = "/assets/notes/moldy-argon-2/json/moldy-argon-2-2-n.json"
  var jsonFile = "/assets/notes/moldy-argon-2/json/moldy-argon-2-2-b.json"
  // var jsonFile = "/assets/notes/moldy-argon-2/json/moldy-argon-2-2-t.json"
  // var jsonFile = "/assets/notes/moldy-argon-2/json/moldy-argon-2-2-big.json"

  var margin = {top: 16, right: 16, bottom: 32, left: 32},
      width = 606 - margin.left - margin.right,
      height = 606 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width])
      .domain([-boxLength/2, boxLength/2]);

  var y = d3.scale.linear()
      .range([height, 0])
      .domain([-boxLength/2, boxLength/2]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  // Draw SVG
  var svg = d3.select("article").append("svg")
      .classed("svg-canvas", true)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Y axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  // Y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

  function drawAtoms(data, circles, delay, j) {

    setTimeout(function() {

      // console.log("t_step:" + j);

      circles.data(data[j].atoms.pos)
        // .transition()
        // .duration(25)
        .attr("cx", function (d) { return x(d[0]); } )
        .attr("cy", function (d) { return y(d[1]); } )

      j++;

      if (j < data.length) {

        drawAtoms(data, circles, delay, j);

      }

      else {

        drawPlayButton();
        circles.remove();

      }

    }, delay);

  }

  function drawPlayButton() {

    play_1 = svg.append("g")
      .attr("class", "play")
      .on("click", start);

    play_1.append("path")
      .attr("d", "M-48,-48L48,0L-48,48Z")
      .attr("transform", "translate(" + width/2 + "," 
                                      + height/2 + ")scale(.6)");

    play_1.append("rect")
      .attr("width", width)
      .attr("height", height);

  }

  function removePlayButton() {

    play_1.remove();

  }

  function start() {

    // removePlayButton();
    play_1.remove();

    var data; // a global
        
    d3.json(jsonFile, 
            function(error, json) {

      if (error) return console.warn(error);
      data = json;

      var circles = svg.selectAll("circle")
        .data(data[0].atoms.pos)
        .enter().append("svg:circle")
          .classed("circle", true)
          .attr("cx", function (d) { return x(d[0]); } )
          .attr("cy", function (d) { return y(d[1]); } )
          .attr("r", circleRad);

      drawAtoms(data, circles, delay, 1);

    });

  }

// Run

drawPlayButton();

})();